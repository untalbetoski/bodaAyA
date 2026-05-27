// api/index.js — Express server para Vercel serverless
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

const DATA_DIR = path.join(__dirname, '../data');

(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch(e) { console.error('Error:', e); }
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

app.get('/api/content', async (req, res) => {
  try {
    const content = await readJSON('content.json');
    res.json({ ok: true, data: content || null });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/content', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ ok: false, error: 'No data' });
    const success = await writeJSON('content.json', data);
    res.json({ ok: success, savedAt: new Date().toISOString() });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/rsvp', async (req, res) => {
  try {
    const ref = 'RH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const entry = { ...req.body, ref, submittedAt: new Date().toISOString() };
    let rsvps = await readJSON('rsvps.json') || [];
    rsvps.push(entry);
    await writeJSON('rsvps.json', rsvps);
    console.log('[RSVP]', entry);
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
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Internal error' });
});

module.exports = app;
