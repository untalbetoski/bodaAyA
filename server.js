// server.js — Express backend para persistencia de datos
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────────────
// DATA STORAGE (en memoria + archivos JSON para persistencia)
// ─────────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, 'data');

// Asegurar que exista el directorio de datos
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch(e) { console.error('Error creating data dir:', e); }
})();

// Helper para leer/escribir JSON
const readJSON = async (filename) => {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(data);
  } catch(e) {
    return null;
  }
};

const writeJSON = async (filename, data) => {
  try {
    await fs.writeFile(
      path.join(DATA_DIR, filename),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    return true;
  } catch(e) {
    console.error('Error writing JSON:', e);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────────────

// GET /api/content — obtener contenido actual
app.get('/api/content', async (req, res) => {
  try {
    const content = await readJSON('content.json');
    if (content) {
      return res.json({ ok: true, data: content });
    }
    // Si no existe, retornar un contenido por defecto
    res.json({ ok: true, data: null });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/content — guardar contenido editado
app.post('/api/content', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ ok: false, error: 'No data provided' });
    }
    const success = await writeJSON('content.json', data);
    if (success) {
      return res.json({ ok: true, savedAt: new Date().toISOString() });
    }
    res.status(500).json({ ok: false, error: 'Failed to save' });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/rsvp — enviar RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const payload = req.body;
    const ref = 'RH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const entry = {
      ...payload,
      ref,
      submittedAt: new Date().toISOString()
    };

    // Leer RSVPs existentes
    let rsvps = await readJSON('rsvps.json') || [];
    rsvps.push(entry);

    // Guardar
    await writeJSON('rsvps.json', rsvps);

    console.log('[RSVP] Submitted:', entry);
    res.json({ ok: true, ref, entry });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/rsvps — listar todos los RSVPs (protegido)
app.get('/api/rsvps', async (req, res) => {
  try {
    // En producción, agregar autenticación adecuada aquí
    const rsvps = await readJSON('rsvps.json') || [];
    res.json({ ok: true, data: rsvps });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/song — agregar canción sugerida
app.post('/api/song', async (req, res) => {
  try {
    const song = req.body;

    // Leer canciones existentes
    let songs = await readJSON('songs.json') || [];
    const entry = {
      ...song,
      submittedAt: new Date().toISOString()
    };
    songs.push(entry);

    // Guardar
    await writeJSON('songs.json', songs);

    console.log('[SONG] Submitted:', entry);
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/songs — listar todas las canciones
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await readJSON('songs.json') || [];
    res.json({ ok: true, data: songs });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Catch-all para SPA (React Router / vistas dinámicas)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

// ─────────────────────────────────────────────────────────────────────
// LISTENER
// ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Boda Andrea & Alberto — Server v1.0  ║
║  Listening on port ${PORT}               ║
║  http://localhost:${PORT}                ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
