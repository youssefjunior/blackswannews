export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;
  
  // ← Mostra os primeiros 10 caracteres da chave para debug
  return res.status(200).json({
    keyPreview: key ? key.substring(0, 10) + '...' : 'NÃO ENCONTRADA',
    keyLength: key ? key.length : 0
  });
}
