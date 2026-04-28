export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = '04f413eb2a4ae3328cb53b20ef166088';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!q) {
    return res.status(400).json({ error: 'Query obrigatória' });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&sortby=publishedAt&max=10&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Normaliza campos para o formato esperado pelo portal
    if (data.articles) {
      data.articles = data.articles.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        publishedAt: a.publishedAt,
        source: { name: a.source?.name || a.source?.url || 'Internacional' }
      }));
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notícias', detail: error.message });
  }
}
