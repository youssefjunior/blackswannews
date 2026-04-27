// ── BLACK SWAN NEWS · app.js v2.0 ──
// Integração: NewsAPI · Ticker Demo · Relógio · Interações

const NEWS_API_KEY = 'fdae4d04533a42baa37f26fcefd085ef';

// Categorias de busca por seção
const NEWS_QUERIES = {
  'Destaques':        'market OR economy OR fed OR gold OR oil OR war OR crash',
  'Geopolítica':      'geopolitics OR war OR conflict OR sanctions OR diplomacy',
  'Commodities':      'gold OR oil OR wheat OR soybean OR commodity OR OPEC',
  'CME · Futuros':    'futures OR nasdaq OR S&P500 OR CME OR dow jones',
  'Cripto':           'bitcoin OR ethereum OR cryptocurrency OR crypto OR BTC',
  'Bancos Centrais':  'federal reserve OR ECB OR central bank OR interest rate OR inflation',
  'Guerras & Conflitos': 'war OR conflict OR Ukraine OR Russia OR Gaza OR NATO OR military',
  'Saúde Global':     'pandemic OR WHO OR disease OR outbreak OR health emergency',
  'Metais Preciosos': 'gold OR silver OR platinum OR palladium OR precious metals',
  'Análises SMC':     'smart money OR market structure OR liquidity OR institutional trading',
};

let currentCategory = 'Destaques';

// ── RELÓGIO ──
function updateClock() {
  const now = new Date();
  const opts = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
  const dateStr = now.toLocaleDateString('pt-BR', opts);
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' BRT';
  const el = document.getElementById('header-date');
  if (el) el.textContent = dateStr + ' · ' + timeStr;
}
updateClock();
setInterval(updateClock, 30000);

// ── TICKER (demo animado) ──
const TICKERS = [
  { sym: 'NQ1!',    val: '21,847', chg: '+0.34%', up: true  },
  { sym: 'ES1!',    val: '5,912',  chg: '+0.21%', up: true  },
  { sym: 'YM1!',    val: '42,160', chg: '+0.18%', up: true  },
  { sym: 'RTY1!',   val: '2,071',  chg: '-0.44%', up: false },
  { sym: 'GC1!',    val: '3,312',  chg: '+1.14%', up: true  },
  { sym: 'SI1!',    val: '31.88',  chg: '+0.66%', up: true  },
  { sym: 'CL1!',    val: '82.40',  chg: '-0.87%', up: false },
  { sym: 'BZ1!',    val: '86.10',  chg: '-0.72%', up: false },
  { sym: 'NG1!',    val: '2.41',   chg: '+1.30%', up: true  },
  { sym: 'HG1!',    val: '4.72',   chg: '+0.44%', up: true  },
  { sym: 'ZW1!',    val: '538',    chg: '-1.10%', up: false },
  { sym: 'ZS1!',    val: '1,142',  chg: '+0.88%', up: true  },
  { sym: 'ZC1!',    val: '461',    chg: '-0.33%', up: false },
  { sym: 'BTC',     val: '93,210', chg: '+2.31%', up: true  },
  { sym: 'ETH',     val: '3,440',  chg: '+1.77%', up: true  },
  { sym: 'SOL',     val: '172.40', chg: '+3.12%', up: true  },
  { sym: 'DXY',     val: '104.21', chg: '-0.32%', up: false },
  { sym: 'US10Y',   val: '4.41%',  chg: '-0.04',  up: false },
  { sym: 'USD/BRL', val: '5.14',   chg: '-0.41%', up: false },
  { sym: 'IBOV',    val: '128,770',chg: '-0.22%', up: false },
  { sym: 'EUR/USD', val: '1.0731', chg: '-0.18%', up: false },
  { sym: 'USD/JPY', val: '154.82', chg: '+0.27%', up: true  },
  { sym: 'KC1!',    val: '214.50', chg: '+1.22%', up: true  },
  { sym: 'CT1!',    val: '81.20',  chg: '-0.55%', up: false },
];

function buildTicker() {
  const container = document.getElementById('ticker-inner');
  if (!container) return;
  const doubled = TICKERS.concat(TICKERS);
  container.innerHTML = doubled.map(t =>
    `<span class="tick">
      <span class="tn">${t.sym}</span>
      <span class="tv">${t.val}</span>
      <span class="${t.up ? 'up' : 'dn'}">${t.chg}</span>
    </span>`
  ).join('');
}
buildTicker();

// ── NAV ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    currentCategory = item.textContent.trim();
    loadNews(currentCategory);
  });
});

// ── CHIPS DE VÍDEO ──
document.querySelectorAll('.chip:not(.chip-live)').forEach(chip => {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.chip:not(.chip-live)').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ── BUSCA COM IA ──
function doSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;
  const url = 'https://claude.ai/new?q=' + encodeURIComponent(
    'Analise o impacto deste evento nos mercados globais e índices CME com visão SMC (Smart Money Concept): ' + query
  );
  window.open(url, '_blank');
}

const searchInput = document.getElementById('search-input');
if (searchInput) searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
const btnAi = document.getElementById('btn-ai');
if (btnAi) btnAi.addEventListener('click', doSearch);

// ── NOVA ANÁLISE ──
const btnNew = document.getElementById('btn-new');
if (btnNew) {
  btnNew.addEventListener('click', () => {
    const url = 'https://claude.ai/new?q=' + encodeURIComponent(
      'Quero criar uma nova análise SMC exclusiva para o portal Black Swan News. Me ajude a estruturar com: ativo, timeframe, estrutura de mercado, Order Blocks, FVGs, direção (Long/Short/Aguardar), níveis de entrada, stop e alvos.'
    );
    window.open(url, '_blank');
  });
}

// ── NEWSAPI — BUSCAR NOTÍCIAS ──
async function fetchNews(query) {
  const url = `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(query)}` +
    `&language=en` +
    `&sortBy=publishedAt` +
    `&pageSize=10` +
    `&apiKey=${NEWS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.message || 'NewsAPI error');
    return data.articles.filter(a => a.title && a.title !== '[Removed]');
  } catch (err) {
    console.error('NewsAPI error:', err);
    return null;
  }
}

// Classificar badge pelo conteúdo da notícia
function classifyBadge(article) {
  const text = (article.title + ' ' + (article.description || '')).toLowerCase();
  if (text.match(/war|attack|military|conflict|nato|nuclear|missile|bomb/))
    return { cls: 'b-geo', label: '● Geopolítica' };
  if (text.match(/bitcoin|crypto|ethereum|blockchain|btc|eth|defi/))
    return { cls: 'b-cry', label: '● Cripto' };
  if (text.match(/gold|silver|oil|wheat|soybean|commodity|opec|metal/))
    return { cls: 'b-com', label: '● Commodities' };
  if (text.match(/pandemic|disease|outbreak|virus|who|health emergency/))
    return { cls: 'b-med', label: '● Saúde Global' };
  if (text.match(/crash|crisis|collapse|recession|bear market/))
    return { cls: 'b-crit', label: '● Crítico' };
  return { cls: 'b-high', label: '● Mercados' };
}

// Gerar tag de impacto baseado no conteúdo
function getImpactTag(article) {
  const text = (article.title + ' ' + (article.description || '')).toLowerCase();
  const tags = [];
  if (text.match(/nasdaq|nq|tech stocks/)) tags.push('NQ1!');
  if (text.match(/s&p|sp500|es futures/)) tags.push('ES1!');
  if (text.match(/gold|ouro/)) tags.push('GC1!');
  if (text.match(/oil|petróleo|crude|opec/)) tags.push('CL1!');
  if (text.match(/bitcoin|btc/)) tags.push('BTC');
  if (text.match(/dollar|dxy|usd/)) tags.push('DXY');
  if (text.match(/wheat|trigo/)) tags.push('ZW1!');
  if (text.match(/soy|soja/)) tags.push('ZS1!');
  if (text.match(/euro|eur/)) tags.push('EUR/USD');
  return tags.length ? '▲ ' + tags.join(' · ') : '▲ Mercados Globais';
}

// Formatar tempo relativo
function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return Math.floor(diff / 60) + 'min atrás';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h atrás';
  return Math.floor(diff / 86400) + 'd atrás';
}

// Renderizar notícias no feed
function renderNews(articles) {
  const feed = document.getElementById('news-feed');
  if (!feed) return;

  if (!articles || articles.length === 0) {
    feed.innerHTML = `
      <div class="section-label">Notícias · ${currentCategory}</div>
      <div style="color:var(--text-4);font-size:12px;padding:20px 0;">
        Nenhuma notícia encontrada para esta categoria no momento.
      </div>`;
    return;
  }

  const leads = articles.slice(0, 3);
  const minis = articles.slice(3);

  let html = `<div class="section-label">Notícias · ${currentCategory} · Tempo Real</div>`;

  // Lead articles
  leads.forEach(article => {
    const badge = classifyBadge(article);
    const impact = getImpactTag(article);
    const source = article.source?.name || 'Internacional';
    const time = timeAgo(article.publishedAt);
    html += `
      <article class="lead-article" onclick="window.open('${article.url}','_blank')">
        <span class="badge ${badge.cls}">${badge.label}</span>
        <h2 class="lead-headline">${article.title}</h2>
        ${article.description ? `<p class="lead-summary">${article.description}</p>` : ''}
        <div class="lead-meta">
          <span>${source} · ${time}</span>
          <span class="impact-tag">${impact}</span>
        </div>
      </article>`;
  });

  // Mini articles
  if (minis.length) {
    html += `<div class="section-label">Mais Notícias</div>`;
    minis.forEach((article, i) => {
      const source = article.source?.name || 'Internacional';
      const time = timeAgo(article.publishedAt);
      html += `
        <article class="mini-article" onclick="window.open('${article.url}','_blank')">
          <div class="mini-num">0${i + 1}</div>
          <div>
            <div class="mini-title">${article.title}</div>
            <div class="mini-meta">${source} · ${time}</div>
          </div>
        </article>`;
    });
  }

  feed.innerHTML = html;
}

// Mostrar loading no feed
function showLoading() {
  const feed = document.getElementById('news-feed');
  if (feed) {
    feed.innerHTML = `
      <div class="section-label">Carregando Notícias...</div>
      <div style="display:flex;flex-direction:column;gap:14px;padding-top:8px;">
        ${[1,2,3].map(() => `
          <div style="border-bottom:1px solid var(--border);padding-bottom:16px;">
            <div style="height:10px;width:100px;background:var(--border-2);border-radius:2px;margin-bottom:10px;"></div>
            <div style="height:20px;width:90%;background:var(--border);border-radius:2px;margin-bottom:6px;"></div>
            <div style="height:14px;width:75%;background:var(--border);border-radius:2px;margin-bottom:6px;opacity:0.6;"></div>
            <div style="height:10px;width:50%;background:var(--border);border-radius:2px;opacity:0.4;"></div>
          </div>`).join('')}
      </div>`;
  }
}

// Carregar notícias para a categoria selecionada
async function loadNews(category) {
  showLoading();
  const query = NEWS_QUERIES[category] || NEWS_QUERIES['Destaques'];
  const articles = await fetchNews(query);
  renderNews(articles);
}

// ── INICIALIZAR ──
document.addEventListener('DOMContentLoaded', function() {
  loadNews('Destaques');
  // Atualizar notícias a cada 5 minutos
  setInterval(() => loadNews(currentCategory), 5 * 60 * 1000);
});
