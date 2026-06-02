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
const DEFAULT_CLOUD_URL = 'https://cfzdqwgzqhhadwtufdyh.supabase.co';
const DEFAULT_CLOUD_TOKEN = ['sb','publishable','mYDadNC7XuVK','fXa7eAtog','J47r3EvA'].join('_');
const CLOUD_URL = process.env.BODA_CLOUD_URL || DEFAULT_CLOUD_URL;
const CLOUD_TOKEN = process.env.BODA_CLOUD_TOKEN || DEFAULT_CLOUD_TOKEN;
const GALLERY_BUCKET = process.env.BODA_GALLERY_BUCKET || 'boda-gallery';
const CONTENT_OBJECT = process.env.BODA_CONTENT_OBJECT || 'site/content.json';
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

async function getRemoteContent() {
  if (!cloudReady()) throw new Error('Cloud storage is not configured');
  const { data, error } = await cloud.storage.from(GALLERY_BUCKET).download(CONTENT_OBJECT);
  if (error) {
    if (/not found|object not found/i.test(error.message || '')) return null;
    throw error;
  }
  return JSON.parse(await data.text());
}

async function saveRemoteContent(data) {
  if (!cloudReady()) throw new Error('Cloud storage is not configured');
  const body = Buffer.from(JSON.stringify(data, null, 2), 'utf8');
  const { error } = await cloud.storage.from(GALLERY_BUCKET).upload(CONTENT_OBJECT, body, {
    contentType: 'application/json; charset=utf-8',
    upsert: true,
    cacheControl: '0'
  });
  if (error) throw error;
  return true;
}

app.get('/api/content', async (req, res) => {
  try {
    const remote = await getRemoteContent();
    if (remote) return res.json({ ok:true, data:remote, source:'cloud-storage' });
    return res.json({ ok:true, data:null, source:'cloud-storage-empty' });
  } catch(e) {
    console.error('[content:get]', e);
    const local = await readJSON('content.json');
    return res.status(503).json({ ok:false, data:local || null, source:'fallback', error:e.message });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { data } = req.body || {};
    if (!data) return res.status(400).json({ ok:false, error:'No data' });
    await saveRemoteContent(data);
    await writeJSON('content.json', data);
    return res.json({ ok:true, savedAt:new Date().toISOString(), remoteSaved:true, source:'cloud-storage' });
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
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public', 'index.html')));
app.use((err, req, res, next) => res.status(500).json({ ok:false, error:'Internal error' }));

module.exports = app;