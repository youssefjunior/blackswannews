export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    let messages = [...body.messages];
    let finalContent = [];

    // Loop para lidar com web_search (pode ter múltiplas rodadas)
    for (let i = 0; i < 5; i++) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'interleaved-thinking-2025-05-14'
        },
        body: JSON.stringify({ ...body, messages }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      finalContent = data.content || [];

      // Se não há tool_use, chegamos na resposta final
      const toolUseBlocks = finalContent.filter(b => b.type === 'tool_use');
      if (toolUseBlocks.length === 0 || data.stop_reason === 'end_turn') {
        return res.status(200).json(data);
      }

      // Monta tool_result para continuar o loop
      const toolResults = toolUseBlocks.map(block => ({
        type: 'tool_result',
        tool_use_id: block.id,
        content: block.input?.query
          ? `Search results for: ${block.input.query}`
          : 'No results',
      }));

      messages = [
        ...messages,
        { role: 'assistant', content: finalContent },
        { role: 'user', content: toolResults },
      ];
    }

    // Retorna o que tiver após o loop
    return res.status(200).json({ content: finalContent });

  } catch (error) {
    return res.status(500).json({ error: 'Proxy error', detail: error.message });
  }
}
