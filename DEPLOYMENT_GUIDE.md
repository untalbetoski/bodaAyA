# 📖 GUÍA PASO A PASO: Desplegar tu Sitio de Boda en GitHub + Vercel

## 🎯 Objetivo Final
Tu sitio estará en línea en: `https://boda-andrea-alberto.vercel.app`
(O un dominio personalizado como `boda-aya.com`)

---

## ⭐ ANTES DE EMPEZAR

✅ Tienes los siguientes archivos:
- `package.json` — Dependencias del proyecto
- `server.js` — Backend Node.js
- `vercel.json` — Configuración para Vercel
- `README.md` — Documentación
- `public/` — Carpeta con todos los archivos del sitio
  - `index.html`
  - `app.jsx`
  - `sections.jsx`
  - `admin.jsx`
  - `tweaks-panel.jsx`
  - `data.jsx` (versión mejorada)

---

## 🔧 PASO 1: Preparar Git Localmente (5 minutos)

### 1.1 Instalar Git
Si no lo tienes, descárgalo de [git-scm.com](https://git-scm.com)

### 1.2 Configurar Git con tu usuario
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@example.com"
```

### 1.3 Crear carpeta del proyecto
```bash
mkdir boda-andrea-alberto
cd boda-andrea-alberto
git init
```

### 1.4 Copiar archivos a esta carpeta
Copia todos los archivos mencionados arriba a la carpeta `boda-andrea-alberto/`

Estructura final:
```
boda-andrea-alberto/
├── package.json
├── server.js
├── vercel.json
├── .gitignore
├── README.md
├── DEPLOYMENT_GUIDE.md (este archivo)
└── public/
    ├── index.html
    ├── app.jsx
    ├── sections.jsx
    ├── admin.jsx
    ├── tweaks-panel.jsx
    └── data.jsx
```

### 1.5 Inicializar Git
```bash
git add .
git commit -m "Initial commit: boda website"
```

---

## 🐙 PASO 2: Crear Repositorio en GitHub (10 minutos)

### 2.1 Crear cuenta o loguearse
- Ir a [github.com](https://github.com)
- Si no tienes cuenta: Click en "Sign up" y completar
- Si tienes cuenta: Click en "Sign in"

### 2.2 Crear nuevo repositorio
1. Click en el ícono `+` (arriba a la derecha)
2. Seleccionar "New repository"
3. Completar el formulario:
   - **Repository name**: `boda-andrea-alberto`
   - **Description**: "Sitio web de boda para Andrea & Alberto"
   - **Privacy**: Seleccionar "Public" ⭐
   - **Inicializar**: Dejar sin checkear (.gitignore y README ya existen)
4. Click en "Create repository"

### 2.3 Conectar repositorio remoto
GitHub te dará instrucciones. Copia y pega esto en tu terminal:

```bash
git remote add origin https://github.com/TU-USUARIO/boda-andrea-alberto.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU-USUARIO` con tu usuario de GitHub**

### 2.4 Verificar
Ir a `https://github.com/TU-USUARIO/boda-andrea-alberto` y deberías ver tus archivos

---

## 🚀 PASO 3: Desplegar en Vercel (10 minutos)

### 3.1 Crear cuenta en Vercel
- Ir a [vercel.com](https://vercel.com)
- Click en "Sign up"
- Seleccionar "Continue with GitHub"
- Autorizar a Vercel para acceder a GitHub

### 3.2 Importar proyecto
1. Una vez logueado en Vercel, click en "Add New..."
2. Seleccionar "Project"
3. Seleccionar "Import Git Repository"
4. Buscar y hacer click en `boda-andrea-alberto`

### 3.3 Configurar el proyecto
En la pantalla de configuración:
- **Project Name**: `boda-andrea-alberto` (dejarlo como está)
- **Framework Preset**: Seleccionar "Other"
- **Root Directory**: `.` (dejarlo como está)
- **Environment Variables**: Dejar vacío por ahora
- **Ignore Build Step**: Dejar unchecked

### 3.4 Desplegar
Click en "Deploy"

**¡Espera 2-3 minutos!** Vercel está compilando y desplegando tu sitio.

### 3.5 ¡Éxito!
Cuando veas "✓ Production", tu sitio está en vivo en:
```
https://boda-andrea-alberto.vercel.app
```

---

## ✅ VERIFICAR QUE FUNCIONA TODO

### 4.1 Visitar el sitio
Abre: `https://boda-andrea-alberto.vercel.app`

Verifica que:
- ✅ Se cargan las imágenes y estilos
- ✅ El sitio se ve bonito
- ✅ La navegación funciona
- ✅ El contador regresivo está funcionando

### 4.2 Probar el panel admin
1. Presiona `Ctrl+E` (o `Cmd+E` en Mac)
2. Entra con la contraseña: `boda2027`
3. Intenta editar algo y guardar
4. Recarga la página (F5) — los cambios deben estar ahí

### 4.3 Probar RSVP
1. Baja a la sección "RSVP"
2. Completa el formulario
3. Envía la confirmación
4. Deberías ver un número de referencia

---

## 🌐 PASO 4 (OPCIONAL): Usar Dominio Personalizado

Si quieres `boda-aya.com` en lugar de `vercel.app`:

### 4.1 Comprar dominio
Opciones recomendadas:
- [Namecheap.com](https://namecheap.com)
- [Google Domains](https://domains.google)
- [GoDaddy](https://godaddy.com)
- Costo: ~$10-15 USD/año

### 4.2 Conectar con Vercel
1. En Vercel, abre tu proyecto
2. Settings → Domains
3. Click en "Add"
4. Escribe tu dominio: `boda-aya.com`
5. Vercel te dará instrucciones de DNS

### 4.3 Configurar DNS
En el panel de control de tu registrador:
1. Ir a "DNS" o "Domain Settings"
2. Agregar los records que Vercel proporciona
3. Esperar 24-48 horas para que se propague

---

## 📝 PASO 5: Cambiar Contenido del Sitio

### 5.1 Opción A: Usar Panel Admin (Más fácil)
1. Ir a tu sitio en línea
2. Presionar `Ctrl+E`
3. Entrar con contraseña `boda2027`
4. Editar lo que quieras
5. Click "Guardar cambios"

### 5.2 Opción B: Editar en GitHub (Para cambios que permanezcan)
1. Ir a tu repositorio en GitHub
2. Ir a `public/data.jsx`
3. Click en el ícono de lápiz (Edit)
4. Busca la sección que quieres cambiar
5. Haz tus ediciones
6. Click en "Commit changes" abajo
7. **Vercel se actualizará automáticamente en 1-2 minutos**

**Ejemplo: Cambiar la contraseña del admin**
Busca esta línea en `public/data.jsx`:
```javascript
admin_password: "boda2027",
```
Cámbiala a:
```javascript
admin_password: "mi-contraseña-nueva",
```

---

## 🎨 PERSONALIZACIONES FRECUENTES

### Cambiar colores
En `public/index.html`, busca:
```css
:root {
  --paper: #f6f5f0;        /* Color fondo */
  --sage-deep: #5a6b5d;    /* Color principal (verde) */
```

Paletas de colores predefinidas en `public/app.jsx`:
- `sage` (verde — predeterminada)
- `rose` (rosa)
- `bone` (beige)
- `midnight` (azul oscuro)

### Cambiar nombres
En `public/data.jsx`:
```javascript
couple: { a: "Andrea", b: "Alberto", and: "&" },
```

### Cambiar fechas
En `public/data.jsx`:
```javascript
date: { 
  iso: "2027-04-16T16:30:00-06:00", 
  day: "16", 
  month_es: "Abril", 
  // ... más campos
},
```

---

## 🔐 SEGURIDAD

⚠️ **Por ahora el sitio es básico. Para hacer más seguro:**

1. **Cambiar contraseña del admin** desde la predeterminada
2. **No compartir la contraseña públicamente**
3. **Usar un email de contacto en lugar de teléfono** en formularios
4. **No guardar información sensible** en el sitio

---

## 🐛 SOLUCIONAR PROBLEMAS

### "Error: Cannot find module 'express'"
Tu máquina local no tiene dependencias. Ejecuta:
```bash
npm install
```

### "El sitio se ve quebrado/raro"
1. Presiona `Ctrl+Shift+Delete` para borrar caché
2. Luego `Ctrl+Shift+R` para reload completo
3. Abre consola (`F12`) y verifica si hay errores rojo

### "Mis cambios no aparecen"
1. Si editaste en GitHub: Espera 2 minutos a que Vercel redeploy
2. Si editaste en panel admin: Borra caché (ver arriba)
3. Si nada funciona: Redeployar desde Vercel dashboard
   - Ir a Vercel → Tu proyecto → Deployments
   - Click en los 3 puntitos al lado del deploy
   - Seleccionar "Redeploy"

### "El RSVP no guarda"
1. Abre consola (`F12`) → Tab "Network"
2. Intenta enviar RSVP de nuevo
3. Mira si la petición a `/api/rsvp` tiene un círculo ✓ verde
4. Si está roja: Vercel puede estar caído (raro) o hay error en server.js

### "No puedo entrar al admin"
1. Verifica que escribes la contraseña correcta: `boda2027`
2. Mayúsculas/minúsculas sí importan
3. Si la cambiaste, usa la nueva contraseña

---

## 📊 VER DATOS GUARDADOS

### RSVPs (confirmaciones)
En Vercel, dentro del proyecto:
1. Click en "Deployments"
2. Click en el deployment actual
3. Click en "Logs"
4. Buscar "RSVP"

O desde terminal (si tienes acceso):
```bash
curl https://tu-dominio.vercel.app/api/rsvps
```

### Canciones sugeridas
Similar a RSVPs, o:
```bash
curl https://tu-dominio.vercel.app/api/songs
```

---

## 💡 TIPS ÚTILES

### Backup de datos
Los datos se guardan automáticamente en Vercel. Para backup manual:
1. Ir a la carpeta `/data` en tu servidor (si tienes acceso)
2. Descargar `rsvps.json` y `songs.json`
3. Guardar en lugar seguro

### Actualizar después de cambios
Si cambias archivos en tu computadora:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
# Vercel se actualizará automáticamente
```

### Testear localmente antes de subir
```bash
npm install
npm start
# Abre http://localhost:3000
```

---

## ✨ PRÓXIMOS PASOS (EXTRAS)

### Agregar email de confirmación
Integrar con servicios como SendGrid o Mailgun

### Agregar galería de fotos
Subir imágenes a CDN (Cloudinary, AWS S3)

### Integrar música en vivo
Usar Spotify Embed para mostrar playlist actual

### Crear mapa interactivo
Mejorar mapas con Mapbox o Google Maps API

---

## 📞 SOPORTE

Si algo falla:
1. Revisar consola del navegador (F12)
2. Copiar el mensaje de error exacto
3. Buscar en Google: "[error específico] vercel express react"
4. Revisar logs de Vercel (Deployments → Logs)

---

## 🎉 ¡FELICITACIONES!

Tu sitio de boda está en vivo. 

**Ahora:**
- ✅ Comparte el enlace con invitados
- ✅ Recibe confirmaciones automáticamente
- ✅ Edita contenido en cualquier momento
- ✅ Disfrutando de la fiesta 🍾

---

**Última actualización: Mayo 27, 2026**
