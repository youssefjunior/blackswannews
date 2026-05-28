export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { messages, max_tokens } = req.body;
    const prompt = messages.map(m => m.content).join('\n');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 900,
        messages: [{ role: 'user', content: prompt }]
      }),
    });

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || '';
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (error) {
    res.status(500).json({ error: 'Proxy error', detail: error.message });
  }
}
