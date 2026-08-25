// api/index.js — Express server para Vercel serverless
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));

const PUBLIC_DIR = path.join(__dirname, '../public');
const DATA_DIR = path.join(__dirname, '../data');
const DEFAULT_CLOUD_URL = 'https://fpsihyxbrmocxzpkrtvx.supabase.co';
const DEFAULT_CLOUD_TOKEN = ['sb','publishable','pX5nPbUM8nsOqQrjK5eR-g','kx9guJTN'].join('_');
const CLOUD_URL = process.env.BODA_CLOUD_URL || DEFAULT_CLOUD_URL;
const CLOUD_TOKEN = process.env.BODA_CLOUD_TOKEN || DEFAULT_CLOUD_TOKEN;
const GALLERY_BUCKET = process.env.BODA_GALLERY_BUCKET || 'boda-gallery';
const CONTENT_OBJECT = process.env.BODA_CONTENT_OBJECT || 'site/content.json';
const OG_PREVIEW_OBJECT = process.env.BODA_OG_PREVIEW_OBJECT || 'site/og-preview.jpg';
const OG_CHUNK_PREFIX = process.env.BODA_OG_CHUNK_PREFIX || 'site/og-preview-chunks/';
const OG_ADMIN_TOKEN = process.env.BODA_ADMIN_TOKEN || 'boda2027';
const cloud = CLOUD_URL && CLOUD_TOKEN ? createClient(CLOUD_URL, CLOUD_TOKEN) : null;

(async () => { try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch(e) {} })();

const readJSON = async (filename) => {
  try { return JSON.parse(await fs.readFile(path.join(DATA_DIR, filename), 'utf8')); }
  catch(e) { return null; }
};
const writeJSON = async (filename, data) => {
  try { await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8'); return true; }
  catch(e) { return false; }
};
const cloudReady = () => Boolean(cloud);

function sanitizeName(name = 'foto') {
  return String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 80) || 'foto';
}

function absoluteSiteUrl(req, pathname = '/') {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'andreayalberto.click';
  return `${proto}://${host}${pathname}`;
}

function socialMeta(req) {
  const siteUrl = 'https://andreayalberto.click/';
  const imageUrl = 'https://andreayalberto.click/og-preview.jpg?v=20260825';
  const title = 'Andrea y Alberto';
  const description = '16 y 17 de abril 2027 | Oaxaca de Juárez, México. Confirma tu asistencia.';
  return `
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${siteUrl}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:site_name" content="Andrea y Alberto" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:image:secure_url" content="${imageUrl}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${siteUrl}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;
}

async function sendIndex(req, res) {
  try {
    const file = await fs.readFile(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
    const withTitleRemoved = file.replace(/<title>[\s\S]*?<\/title>\s*/i, '');
    const html = withTitleRemoved.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0" />', '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' + socialMeta(req));
    return res.type('html').send(html);
  } catch(e) {
    return res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  }
}

async function serveOgPreview(req, res) {
  try {
    if (!cloudReady()) return res.status(404).send('OG preview not configured');
    const { data, error } = await cloud.storage.from(GALLERY_BUCKET).download(OG_PREVIEW_OBJECT);
    if (error) return res.status(404).send(error.message || 'OG preview not found');
    const buffer = Buffer.from(await data.arrayBuffer());
    res.set({
      'Content-Type':'image/jpeg',
      'Content-Length':String(buffer.length),
      'Cache-Control':'public, max-age=31536000, immutable'
    });
    return res.send(buffer);
  } catch(e) {
    return res.status(500).send('Could not load OG preview');
  }
}

app.get('/', sendIndex);
app.get('/index.html', sendIndex);
app.get(['/og-preview.jpg', '/api/og-preview.jpg'], serveOgPreview);

app.get('/api/og-preview/chunk', async (req, res) => {
  try {
    if (!cloudReady()) return res.status(500).json({ ok:false, error:'Cloud storage is not configured' });
    const key = String(req.query.key || '');
    if (key !== OG_ADMIN_TOKEN) return res.status(403).json({ ok:false, error:'Unauthorized' });
    const index = Number(req.query.i);
    const total = Number(req.query.total);
    const chunk = String(req.query.chunk || '');
    if (!Number.isInteger(index) || !Number.isInteger(total) || index < 0 || total < 1 || index >= total || total > 100) return res.status(400).json({ ok:false, error:'Invalid chunk index' });
    if (!chunk) return res.status(400).json({ ok:false, error:'Empty chunk' });

    const chunkPath = `${OG_CHUNK_PREFIX}${String(index).padStart(3, '0')}.txt`;
    const { error: chunkError } = await cloud.storage.from(GALLERY_BUCKET).upload(chunkPath, Buffer.from(chunk, 'utf8'), {
      contentType:'text/plain; charset=utf-8',
      upsert:true,
      cacheControl:'0'
    });
    if (chunkError) throw chunkError;

    if (String(req.query.done || '') === '1') {
      let base64url = '';
      for (let i = 0; i < total; i++) {
        const pathName = `${OG_CHUNK_PREFIX}${String(i).padStart(3, '0')}.txt`;
        const { data, error } = await cloud.storage.from(GALLERY_BUCKET).download(pathName);
        if (error) throw new Error(`Missing chunk ${i}: ${error.message}`);
        base64url += await data.text();
      }
      const buffer = Buffer.from(base64url, 'base64url');
      const { error: uploadError } = await cloud.storage.from(GALLERY_BUCKET).upload(OG_PREVIEW_OBJECT, buffer, {
        contentType:'image/jpeg',
        upsert:true,
        cacheControl:'31536000'
      });
      if (uploadError) throw uploadError;
      const publicUrl = `${CLOUD_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${OG_PREVIEW_OBJECT}`;
      return res.json({ ok:true, assembled:true, size:buffer.length, url:publicUrl, siteUrl:absoluteSiteUrl(req, '/og-preview.jpg') });
    }

    return res.json({ ok:true, chunk:index, total });
  } catch(e) {
    console.error('[og-preview:chunk]', e);
    return res.status(500).json({ ok:false, error:e.message });
  }
});

app.use(express.static(PUBLIC_DIR));

const EVENT_KEYS = ['icebreaker', 'ceremony', 'reception', 'traditional'];
const DEFAULT_MAP_QUERIES = {
  icebreaker: 'Mal de Amor, Santiago Matatlán, Oaxaca',
  ceremony: 'Templo de Santo Domingo de Guzmán, Oaxaca de Juárez, Oaxaca',
  reception: 'Cardenal Oaxaca Social Venue, Oaxaca de Juárez, Oaxaca',
  traditional: 'Oaxaca de Juárez, Oaxaca'
};

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function eventMapQuery(ev, key) {
  if (!ev) return DEFAULT_MAP_QUERIES[key] || 'Oaxaca, México';
  const venue = cleanText(ev.venue);
  const address = cleanText(ev.address_es || ev.address_en || ev.address);
  const parts = [];
  if (venue) parts.push(venue);
  if (address && address.toLowerCase() !== venue.toLowerCase()) parts.push(address);
  const query = cleanText(parts.join(', '));
  return query || DEFAULT_MAP_QUERIES[key] || 'Oaxaca, México';
}

function googleMapsEmbed(query) {
  return 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
}

function googleMapsPublic(query) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

function normalizeEventMaps(content) {
  const next = { ...(content || {}) };
  EVENT_KEYS.forEach((key) => {
    if (!next[key]) return;
    const query = eventMapQuery(next[key], key);
    next[key] = {
      ...next[key],
      map: googleMapsEmbed(query),
      map_query: query,
      map_url: googleMapsPublic(query)
    };
  });
  return next;
}

async function getRemoteContent() {
  if (!cloudReady()) throw new Error('Cloud storage is not configured');
  const { data, error } = await cloud.storage.from(GALLERY_BUCKET).download(CONTENT_OBJECT);
  if (error) {
    if (/not found|object not found/i.test(error.message || '')) return null;
    throw error;
  }
  return normalizeEventMaps(JSON.parse(await data.text()));
}

async function saveRemoteContent(data) {
  if (!cloudReady()) throw new Error('Cloud storage is not configured');
  const normalized = normalizeEventMaps(data);
  const body = Buffer.from(JSON.stringify(normalized, null, 2), 'utf8');
  const { error } = await cloud.storage.from(GALLERY_BUCKET).upload(CONTENT_OBJECT, body, {
    contentType:'application/json; charset=utf-8',
    upsert:true,
    cacheControl:'0'
  });
  if (error) throw error;
  return normalized;
}

app.get('/api/content', async (req, res) => {
  try {
    const remote = await getRemoteContent();
    if (remote) return res.json({ ok:true, data:remote, source:'cloud-storage' });
    return res.json({ ok:true, data:null, source:'cloud-storage-empty' });
  } catch(e) {
    console.error('[content:get]', e);
    const local = await readJSON('content.json');
    return res.status(503).json({ ok:false, data:local ? normalizeEventMaps(local) : null, source:'fallback', error:e.message });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { data } = req.body || {};
    if (!data) return res.status(400).json({ ok:false, error:'No data' });
    const normalized = await saveRemoteContent(data);
    await writeJSON('content.json', normalized);
    return res.json({ ok:true, savedAt:new Date().toISOString(), remoteSaved:true, source:'cloud-storage', data:normalized });
  } catch(e) {
    console.error('[content:save]', e);
    return res.status(503).json({ ok:false, remoteSaved:false, error:e.message });
  }
});

app.get('/api/content/status', async (req, res) => {
  try {
    const remote = await getRemoteContent();
    return res.json({ ok:true, cloud:cloudReady(), bucket:GALLERY_BUCKET, object:CONTENT_OBJECT, hasRemoteContent:Boolean(remote) });
  } catch(e) {
    return res.status(503).json({ ok:false, cloud:cloudReady(), bucket:GALLERY_BUCKET, object:CONTENT_OBJECT, error:e.message });
  }
});

app.post('/api/gallery/upload', async (req, res) => {
  try {
    if (!cloudReady()) return res.status(500).json({ ok:false, error:'Cloud storage is not configured' });
    const { dataUrl, filename } = req.body || {};
    if (!dataUrl || !String(dataUrl).startsWith('data:image/')) return res.status(400).json({ ok:false, error:'Invalid image data' });
    const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ ok:false, error:'Invalid data URL' });
    const mime = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const original = sanitizeName(filename || 'foto.jpg').replace(/\.[^.]+$/, '');
    const objectPath = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${original}.jpg`;
    const { error } = await cloud.storage.from(GALLERY_BUCKET).upload(objectPath, buffer, { contentType:mime || 'image/jpeg', upsert:false });
    if (error) return res.status(500).json({ ok:false, error:error.message });
    const { data: publicData } = cloud.storage.from(GALLERY_BUCKET).getPublicUrl(objectPath);
    return res.json({ ok:true, url:publicData.publicUrl, path:objectPath });
  } catch(e) { return res.status(500).json({ ok:false, error:e.message }); }
});

app.post('/api/rsvp', async (req, res) => {
  try {
    const ref = 'RH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const entry = { ...req.body, ref, submittedAt:new Date().toISOString() };
    let rsvps = await readJSON('rsvps.json') || [];
    rsvps.push(entry);
    await writeJSON('rsvps.json', rsvps);
    return res.json({ ok:true, ref, entry });
  } catch(e) { return res.status(500).json({ ok:false, error:e.message }); }
});
app.get('/api/rsvps', async (req, res) => res.json({ ok:true, data:await readJSON('rsvps.json') || [] }));
app.post('/api/song', async (req, res) => {
  let songs = await readJSON('songs.json') || [];
  songs.push({ ...req.body, submittedAt:new Date().toISOString() });
  await writeJSON('songs.json', songs);
  res.json({ ok:true });
});
app.get('/api/songs', async (req, res) => res.json({ ok:true, data:await readJSON('songs.json') || [] }));
app.get('/api/health', (req, res) => res.json({ ok:true, timestamp:new Date().toISOString(), cloud:cloudReady(), persistence:'supabase-storage' }));
app.get('*', sendIndex);
app.use((err, req, res, next) => res.status(500).json({ ok:false, error:'Internal error' }));

module.exports = app;