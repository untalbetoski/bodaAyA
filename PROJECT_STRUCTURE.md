# 📁 Estructura del Proyecto

## Árbol de Archivos

```
boda-andrea-alberto/
│
├── 📄 package.json              ← Dependencias del proyecto (Express, CORS, etc)
├── 📄 server.js                 ← Backend Node.js/Express para APIs
├── 📄 vercel.json               ← Configuración para despliegue en Vercel
├── 📄 .gitignore                ← Archivos que Git ignora
├── 📄 .env.example              ← Variables de entorno (ejemplo)
│
├── 📚 Documentación/
│   ├── README.md                ← Guía rápida general
│   ├── DEPLOYMENT_GUIDE.md      ← Guía detallada de despliegue
│   └── CHECKLIST.md             ← Checklist de verificación
│
├── 🎯 quick-start.sh            ← Script para iniciar localmente
│
└── 📦 public/                   ← Archivos del sitio web
    │
    ├── index.html               ← Página principal HTML
    ├── data.jsx                 ← Contenido, i18n, y APIs mejoradas
    ├── utilities.jsx            ← Custom hooks (useTweaks, useLocalStorage, etc)
    │
    ├── app.jsx                  ← Componente raíz (React)
    ├── sections.jsx             ← Componentes visuales (Hero, Countdown, etc)
    ├── admin.jsx                ← Panel de administración
    └── tweaks-panel.jsx         ← Panel de tweaks/customización


```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Cliente)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  public/index.html                                          │
│       ↓                                                      │
│  React 18 (desde CDN)                                       │
│       ↓                                                      │
│  public/app.jsx (App root)                                  │
│       ├→ public/sections.jsx (Vistas)                       │
│       ├→ public/admin.jsx (Panel admin)                     │
│       ├→ public/tweaks-panel.jsx (Customización)            │
│       └→ public/utilities.jsx (Custom hooks)                │
│       ↓                                                      │
│  public/data.jsx (Estado global + APIs)                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
          ↓
     (API Calls)
          ↓
┌─────────────────────────────────────────────────────────────┐
│                  VERCEL EDGE NETWORK                        │
├─────────────────────────────────────────────────────────────┤
│                   server.js (Express)                       │
│                                                              │
│  GET  /api/content      ← Obtener contenido                │
│  POST /api/content      ← Guardar ediciones                │
│  POST /api/rsvp         ← Enviar RSVP                      │
│  GET  /api/rsvps        ← Listar RSVPs                     │
│  POST /api/song         ← Sugerir canción                  │
│  GET  /api/songs        ← Listar canciones                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────┐
│               ALMACENAMIENTO EN VERCEL                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /data/content.json     ← Contenido editado                │
│  /data/rsvps.json       ← Confirmaciones de invitados      │
│  /data/songs.json       ← Canciones sugeridas              │
│                                                              │
│  (Nota: En Vercel serverless, estos archivos son            │
│   efímeros. Para persistencia real, usar base de datos)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Componentes React

```
<App>
├─ <WatercolorField/>           (Fondo animado)
├─ <NavBar/>                    (Navegación superior)
├─ <main>
│  ├─ <Hero/>                   (Portada)
│  ├─ <Countdown/>              (Contador regresivo)
│  ├─ <EventsSection/>          (Eventos)
│  ├─ <DressSection/>           (Código de vestimenta)
│  ├─ <ItinerarySection/>       (Programa)
│  ├─ <RSVPSection/>            (Confirmación)
│  ├─ <GallerySection/>         (Galería)
│  ├─ <PlaylistSection/>        (Playlist)
│  ├─ <GiftsSection/>           (Mesa de regalos)
│  ├─ <LodgingSection/>         (Hospedaje)
│  └─ <ClosingSection/>         (Cierre)
├─ <SiteFooter/>                (Pie de página)
├─ <AdminPanel/>                (Gestión de contenido)
├─ <TweaksPanel/>               (Personalización)
└─ [FAB] Admin button           (Botón flotante)
```

## 🔐 Variables Globales Disponibles

Después de cargar el sitio, puedes acceder en consola (F12):

```javascript
// Contenido por defecto
DEFAULT_DATA

// Strings i18n
I18N

// Backend (simula un servidor)
MockServer
  .getContent()              // GET contenido
  .saveContent(data)         // POST guardar
  .submitRsvp(payload)       // POST RSVP
  .listRsvps()               // GET RSVPs
  .submitSong(song)          // POST canción
  .listSongs()               // GET canciones

// Custom hooks
useTweaks(defaults)          // Hook para tweaks
useLocalStorage(key, init)   // Hook para localStorage
useDebounce(value, delay)    // Hook para debounce
useAsync(fn, immediate)      // Hook para async
```

## 🚀 URLs de Despliegue

```
Local desarrollo:       http://localhost:3000
GitHub:                https://github.com/tu-usuario/boda-andrea-alberto
Vercel (automático):   https://boda-andrea-alberto.vercel.app
Dominio personalizado: https://boda-aya.com (si configuras)
```

## 📡 APIs Backend

Todos estos endpoints están disponibles después de desplegar en Vercel:

```
GET  /api/health                     ← Health check
GET  /api/content                    ← Obtener contenido actual
POST /api/content                    ← Guardar contenido editado
POST /api/rsvp                       ← Enviar confirmación
GET  /api/rsvps                      ← Listar confirmaciones
POST /api/song                       ← Sugerir canción
GET  /api/songs                      ← Listar canciones sugeridas
```

## 🔄 Ciclo de Desarrollo

```
1. Editar archivos localmente
   └→ public/*.jsx, index.html

2. Testear localmente
   └→ npm start

3. Hacer commit en Git
   └→ git add . && git commit && git push

4. Vercel redeploy automático
   └→ ~1-2 minutos

5. Ver cambios en producción
   └→ https://tu-dominio.vercel.app
```

## 📝 Notas Importantes

### LocalStorage vs APIs
- El sitio tiene **fallback a localStorage** si el servidor no está disponible
- En desarrollo: usaría localStorage
- En producción (Vercel): usaría APIs reales
- Los datos se guardan **en memoria + archivos JSON** en Vercel

### Persistencia de Datos
- Vercel Serverless: Los archivos JSON son **efímeros**
- Para base de datos real, integrar:
  - ✅ Firebase Realtime Database
  - ✅ Supabase (PostgreSQL)
  - ✅ MongoDB Atlas
  - ✅ Prisma + Planet Scale

### Seguridad
- Admin password: **cambiable en data.jsx**
- CORS: **habilitado en server.js**
- SSL/HTTPS: **automático en Vercel** ✅
- Rate limiting: **NO configurado** (añadir en futuro)

---

**¿Listo para desplegar?** Ver [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
