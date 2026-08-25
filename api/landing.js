// api/landing.js — serves the homepage with Open Graph metadata for social previews
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://andreayalberto.click/';
const OG_IMAGE = 'https://andreayalberto.click/api/og-preview?v=20260825-save-the-date';
const TITLE = 'Andrea y Alberto | Oaxaca 2027';
const DESCRIPTION = '16 y 17 de abril 2027 | Oaxaca de Juárez, México. Confirma tu asistencia.';

const SOCIAL_META = `
<meta name="description" content="${DESCRIPTION}" />
<link rel="canonical" href="${SITE_URL}" />

<meta property="og:locale" content="es_MX" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Andrea y Alberto" />
<meta property="og:url" content="${SITE_URL}" />
<meta property="og:title" content="${TITLE}" />
<meta property="og:description" content="${DESCRIPTION}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:secure_url" content="${OG_IMAGE}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Andrea y Alberto — Save the Date Oaxaca 2027" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${SITE_URL}" />
<meta name="twitter:title" content="${TITLE}" />
<meta name="twitter:description" content="${DESCRIPTION}" />
<meta name="twitter:image" content="${OG_IMAGE}" />
`;

function stripOldSocialMeta(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${TITLE}</title>`)
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '');
}

module.exports = function handler(req, res) {
  try {
    const indexPath = path.join(process.cwd(), 'public', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    html = stripOldSocialMeta(html);
    html = html.replace('</head>', `${SOCIAL_META}\n</head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).send(html);
  } catch (error) {
    console.error('[landing]', error);
    res.status(500).send('Could not render landing page');
  }
};