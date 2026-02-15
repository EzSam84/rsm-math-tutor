// Serverless function to call Groq API securely
// This runs on Vercel's servers, not in the browser
// Your API key stays secret here

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, systemPrompt } = req.body;

    // Build messages array for Groq (OpenAI-compatible format)
    const groqMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages
    ];

    // Call Groq API with Llama 3.1 70B (upgraded for better quality)
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 300,
          top_p: 0.9,
          stream: false
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return res.status(response.status).json({ 
        error: 'AI service error', 
        details: error 
      });
    }

    const data = await response.json();
    
    // Extract the response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const tutorResponse = data.choices[0].message.content;
      
      // Return in Anthropic-compatible format
      res.status(200).json({
        content: [
          {
            type: 'text',
            text: tutorResponse
          }
        ]
      });
    } else {
      console.error('Unexpected response format:', data);
      return res.status(500).json({ 
        error: 'Unexpected response format', 
        details: data 
      });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
