export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = '04f413eb2a4ae3328cb53b20ef166088';
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&sortby=publishedAt&max=10&apikey=${API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
}
