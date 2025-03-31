export async function POST(request) {
  try {
    const body = await request.json()
    const { input, recipientName, senderName } = body

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a romantic AI that writes heartfelt love letters.',
          },
          {
            role: 'user',
            content: `Write a love letter addressed to ${recipientName}, based on these details: ${input}. Please sign the letter with the name: ${senderName}. The letter recipient is: ${recipientName}.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const data = await response.json()
    
    console.log('Groq API Response:', data)

    if (!response.ok) {
      throw new Error(`Groq API error: ${data.error?.message || 'Unknown error'}`)
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Unexpected response structure from Groq API')
    }

    const letter = data.choices[0].message.content

    return new Response(JSON.stringify({ letter }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error details:', error)
    return new Response(JSON.stringify({ 
      message: 'Error generating letter',
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}
