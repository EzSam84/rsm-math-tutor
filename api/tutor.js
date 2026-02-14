// Serverless function to call Hugging Face API securely
// This runs on Vercel's servers, not in the browser
// Your API key stays secret here

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, systemPrompt } = req.body;

    // Build the prompt for Mistral
    let fullPrompt = `<s>[INST] ${systemPrompt}\n\n`;

    // Add conversation history
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role === 'user') {
        if (i === 0) {
          fullPrompt += `${msg.content} [/INST]`;
        } else {
          fullPrompt += `<s>[INST] ${msg.content} [/INST]`;
        }
      } else {
        fullPrompt += ` ${msg.content}</s>`;
      }
    }

    // Call Hugging Face API with Mistral model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
            stop: ['</s>', '[INST]']
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API error:', error);
      return res.status(response.status).json({ error: 'AI service error', details: error });
    }

    const data = await response.json();
    
    // Extract the generated text
    let generatedText = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    } else {
      console.error('Unexpected response format:', data);
      return res.status(500).json({ error: 'Unexpected response format', details: data });
    }

    // Clean up the response
    generatedText = generatedText.trim();

    // Return in Anthropic-compatible format
    res.status(200).json({
      content: [
        {
          type: 'text',
          text: generatedText
        }
      ]
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
