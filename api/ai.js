export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, max_tokens } = req.body;
    const prompt = messages.map(m => m.content).join('\n');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: max_tokens || 900 }
        }),
      }
    );

    const data = await response.json();

    // ← Retorna tudo para debug
    return res.status(200).json({
      content: [{ type: 'text', text: '' }],
      _geminiRaw: data  // ← mostra resposta completa do Gemini
    });

  } catch (error) {
    res.status(500).json({ error: 'Proxy error', detail: error.message });
  }
}
