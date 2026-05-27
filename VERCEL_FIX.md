# 🔧 ARREGLAR ERROR DE VERCEL

## ❌ Problema
```
The pattern "server.js" defined in 'functions' doesn't match 
any Serverless Functions inside the 'api' directory
```

## ✅ Solución

Tu `vercel.json` está mal configurado. Aquí está cómo arreglarlo:

---

## Opción 1: RÁPIDA (Recomendado)

### Paso 1: Actualiza `vercel.json`

Reemplaza el contenido de **`vercel.json`** con esto:

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "public": true,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/public/index.html"
    }
  ]
}
```

### Paso 2: Crea carpeta `api/`

En la raíz del proyecto, crea una **nueva carpeta** llamada `api/`

```bash
mkdir api
```

### Paso 3: Crea `api/index.js`

Dentro de la carpeta `api/`, crea un archivo `index.js` con el contenido de **`server.js`**.

O simplemente copia y pega esto en `api/index.js`:

```javascript
// api/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

const DATA_DIR = path.join(__dirname, '../data');

(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch(e) { console.error('Error creating data dir:', e); }
})();

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

// API ROUTES

app.get('/api/content', async (req, res) => {
  try {
    const content = await readJSON('content.json');
    if (content) {
      return res.json({ ok: true, data: content });
    }
    res.json({ ok: true, data: null });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

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

app.post('/api/rsvp', async (req, res) => {
  try {
    const payload = req.body;
    const ref = 'RH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const entry = {
      ...payload,
      ref,
      submittedAt: new Date().toISOString()
    };

    let rsvps = await readJSON('rsvps.json') || [];
    rsvps.push(entry);
    await writeJSON('rsvps.json', rsvps);

    console.log('[RSVP] Submitted:', entry);
    res.json({ ok: true, ref, entry });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/rsvps', async (req, res) => {
  try {
    const rsvps = await readJSON('rsvps.json') || [];
    res.json({ ok: true, data: rsvps });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/song', async (req, res) => {
  try {
    const song = req.body;
    let songs = await readJSON('songs.json') || [];
    const entry = {
      ...song,
      submittedAt: new Date().toISOString()
    };
    songs.push(entry);
    await writeJSON('songs.json', songs);

    console.log('[SONG] Submitted:', entry);
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/songs', async (req, res) => {
  try {
    const songs = await readJSON('songs.json') || [];
    res.json({ ok: true, data: songs });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

module.exports = app;
```

### Paso 4: Hacer git commit y push

```bash
git add .
git commit -m "Fix Vercel deployment: move server to api/index.js"
git push origin main
```

Vercel debería redeployar automáticamente. **Espera 2-3 minutos.**

---

## Estructura Final (Correcta)

```
boda-andrea-alberto/
├── api/
│   └── index.js              ← AQUÍ está el servidor Express
├── public/
│   ├── index.html
│   ├── app.jsx
│   ├── data.jsx
│   └── ...
├── package.json
├── vercel.json               ← Actualizado
├── .gitignore
└── README.md
```

---

## ✅ Verificación

Después de hacer push a GitHub:

1. Abre https://vercel.com/dashboard
2. Click en tu proyecto
3. Ir a "Deployments"
4. Deberías ver un nuevo deploy en progreso
5. Espera a que aparezca una ✓ verde
6. Abre tu URL: `https://boda-andrea-alberto.vercel.app`
7. ¡Debe funcionar!

---

## 🆘 Si Sigue Fallando

1. **Verifica que creaste la carpeta `api/`** (no `apis/`, no `API/`)
2. **Verifica que creaste `api/index.js`** (no `api.js`, no `server.js`)
3. **Verifica el `vercel.json`** — debe estar exacto como arriba
4. **Haz `npm install`** localmente para verificar que funciona
5. **Busca errores en los logs de Vercel**:
   - Dashboard → Tu proyecto → Deployments → Click en deploy → Logs

---

## 📝 Resumen de Cambios

| Antes | Después |
|-------|---------|
| `server.js` en raíz | `api/index.js` en carpeta `api/` |
| `vercel.json` con `functions` | `vercel.json` con `rewrites` |
| Error de Vercel ❌ | Despliegue exitoso ✅ |

---

**¡Ahora debería funcionar! 🚀**

Si aún tienes problemas, comparte el error exacto de Vercel y lo arreglamos.
