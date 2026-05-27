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
app.use(express.static(path.join(__dirname, '../public')));

const DATA_DIR = path.join(__dirname, '../data');
const CLOUD_URL = process.env.BODA_CLOUD_URL;
const CLOUD_TOKEN = process.env.BODA_CLOUD_TOKEN;
const CONTENT_TABLE = process.env.BODA_CONTENT_TABLE || 'boda_site_content';
const GALLERY_BUCKET = process.env.BODA_GALLERY_BUCKET || 'boda-gallery';
const cloud = CLOUD_URL && CLOUD_TOKEN ? createClient(CLOUD_URL, CLOUD_TOKEN) : null;

(async () => {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); }
  catch(e) { console.error('Error:', e); }
})();

const readJSON = async (filename) => {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(data);
  } catch(e) { return null; }
};

const writeJSON = async (filename, data) => {
  try {
    await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch(e) { console.error('Error:', e); return false; }
};

const cloudReady = () => Boolean(cloud);

function sanitizeName(name = 'foto') {
  return String(name)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80) || 'foto';
}

async function getRemoteContent() {
  if (!cloudReady()) return null;
  const { data, error } = await cloud
    .from(CONTENT_TABLE)
    .select('data')
    .eq('id', 'main')
    .maybeSingle();
  if (error) throw error;
  return data?.data || null;
}

async function saveRemoteContent(data) {
  if (!cloudReady()) return false;
  const { error } = await cloud
    .from(CONTENT_TABLE)
    .upsert({ id: 'main', data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
  return true;
}

app.get('/api/content', async (req, res) => {
  try {
    const remote = await getRemoteContent();
    if (remote) return res.json({ ok: true, data: remote, source: 'cloud' });
    const content = await readJSON('content.json');
    res.json({ ok: true, data: content || null, source: content ? 'file' : 'default' });
  } catch(e) {
    console.error('[content:get]', e);
    const content = await readJSON('content.json');
    res.json({ ok: true, data: content || null, source: 'fallback' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ ok: false, error: 'No data' });
    let remoteSaved = false;
    try { remoteSaved = await saveRemoteContent(data); }
    catch (remoteError) { console.error('[content:remote]', remoteError); }
    await writeJSON('content.json', data);
    res.json({ ok: true, savedAt: new Date().toISOString(), remoteSaved });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/gallery/upload', async (req, res) => {
  try {
    if (!cloudReady()) return res.status(500).json({ ok: false, error: 'Cloud storage is not configured' });

    const { dataUrl, filename } = req.body || {};
    if (!dataUrl || !String(dataUrl).startsWith('data:image/')) {
      return res.status(400).json({ ok: false, error: 'Invalid image data' });
    }

    const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ ok: false, error: 'Invalid data URL' });

    const mime = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const original = sanitizeName(filename || 'foto.jpg').replace(/\.[^.]+$/, '');
    const objectPath = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${original}.jpg`;

    const { error } = await cloud.storage
      .from(GALLERY_BUCKET)
      .upload(objectPath, buffer, { contentType: mime || 'image/jpeg', upsert: false });

    if (error) return res.status(500).json({ ok: false, error: error.message });

    const { data: publicData } = cloud.storage.from(GALLERY_BUCKET).getPublicUrl(objectPath);
    res.json({ ok: true, url: publicData.publicUrl, path: objectPath });
  } catch(e) {
    console.error('[gallery:upload]', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/rsvp', async (req, res) => {
  try {
    const ref = 'RH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const entry = { ...req.body, ref, submittedAt: new Date().toISOString() };
    let rsvps = await readJSON('rsvps.json') || [];
    rsvps.push(entry);
    await writeJSON('rsvps.json', rsvps);
    res.json({ ok: true, ref, entry });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/rsvps', async (req, res) => {
  try {
    const rsvps = await readJSON('rsvps.json') || [];
    res.json({ ok: true, data: rsvps });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/song', async (req, res) => {
  try {
    let songs = await readJSON('songs.json') || [];
    songs.push({ ...req.body, submittedAt: new Date().toISOString() });
    await writeJSON('songs.json', songs);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/songs', async (req, res) => {
  try {
    const songs = await readJSON('songs.json') || [];
    res.json({ ok: true, data: songs });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), cloud: cloudReady() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Internal error' });
});

module.exports = app;