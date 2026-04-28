export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = '04f413eb2a4ae3328cb53b20ef166088';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!q) {
    return res.status(400).json({ error: 'Query obrigatória' });
  }

  try {
    // Busca em português primeiro
    const urlPT = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=pt&sortby=publishedAt&max=5&apikey=${API_KEY}`;
    // Busca em inglês para complementar
    const urlEN = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&sortby=publishedAt&max=5&apikey=${API_KEY}`;

    const [resPT, resEN] = await Promise.all([
      fetch(urlPT),
      fetch(urlEN)
    ]);

    const [dataPT, dataEN] = await Promise.all([
      resPT.json(),
      resEN.json()
    ]);

    const normalize = (articles) => (articles || []).map(a => ({
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || a.source?.url || 'Internacional' }
    }));

    const combined = [
      ...normalize(dataPT.articles),
      ...normalize(dataEN.articles)
    ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.status(200).json({ articles: combined });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notícias', detail: error.message });
  }
}
