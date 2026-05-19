export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = '04f413eb2a4ae3328cb53b20ef166088';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!q) return res.status(400).json({ error: 'Query obrigatória' });

  try {
    // Busca em inglês — mais cobertura
    const urlEN = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&sortby=publishedAt&max=9&apikey=${API_KEY}`;
    // Busca em português — notícias brasileiras
    const urlPT = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=pt&sortby=publishedAt&max=3&apikey=${API_KEY}`;

    const [resEN, resPT] = await Promise.all([fetch(urlEN), fetch(urlPT)]);
    const [dataEN, dataPT] = await Promise.all([resEN.json(), resPT.json()]);

    const normalize = (articles) => (articles || []).map(a => ({
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || a.source?.url || 'Internacional' }
    }));

    // Combinar e ordenar por data
    const combined = [
      ...normalize(dataEN.articles),
      ...normalize(dataPT.articles)
    ]
    .filter(a => a.title && a.title !== '[Removed]')
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.status(200).json({ articles: combined });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notícias', detail: error.message });
  }
}
