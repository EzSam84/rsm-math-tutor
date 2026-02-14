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

    // Build the prompt for Llama
    let fullPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

${systemPrompt}<|eot_id|>`;

    // Add conversation history
    for (const msg of messages) {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      fullPrompt += `<|start_header_id|>${role}<|end_header_id|>

${msg.content}<|eot_id|>`;
    }

    // Add the start of assistant response
    fullPrompt += `<|start_header_id|>assistant<|end_header_id|>

`;

    // Call Hugging Face API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
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
            stop: ['<|eot_id|>', '<|end_of_text|>']
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API error:', error);
      return res.status(response.status).json({ error: 'AI service error' });
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
      return res.status(500).json({ error: 'Unexpected response format' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
}
