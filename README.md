# 💍 Andrea & Alberto — Sitio Web de Boda

Sitio web elegante y funcional para la boda de Andrea y Alberto, construido con React + Express + Vercel.

## 🚀 Despliegue Rápido en GitHub + Vercel

### Paso 1: Crear un Repositorio en GitHub

1. **Ir a [github.com](https://github.com)** y loguearse
2. **Crear nuevo repositorio:**
   - Click en el ícono `+` (arriba a la derecha) → "New repository"
   - Nombre: `boda-andrea-alberto`
   - Descripción: "Sitio web de boda para Andrea & Alberto"
   - Seleccionar "Public" (para que Vercel pueda acceder)
   - Click en "Create repository"

3. **Clonar el repositorio a tu computadora:**
   ```bash
   git clone https://github.com/tu-usuario/boda-andrea-alberto.git
   cd boda-andrea-alberto
   ```

### Paso 2: Copiar los Archivos del Proyecto

Coloca los siguientes archivos en la carpeta raíz del proyecto:

```
boda-andrea-alberto/
├── package.json                (ya incluido)
├── server.js                   (backend Express)
├── vercel.json                 (config Vercel)
├── .gitignore                  (archivos a ignorar)
├── README.md                   (este archivo)
├── public/
│   ├── index.html              (tu archivo HTML)
│   ├── data.jsx                (USAR data-mejorado.jsx)
│   ├── app.jsx
│   ├── sections.jsx
│   ├── admin.jsx
│   └── tweaks-panel.jsx
└── data/                       (creado automáticamente)
    ├── content.json
    ├── rsvps.json
    └── songs.json
```

### Paso 3: Subir a GitHub

```bash
git add .
git commit -m "Initial commit: boda website setup"
git push origin main
```

### Paso 4: Conectar con Vercel

1. **Ir a [vercel.com](https://vercel.com)** y crear una cuenta (o loguearse)

2. **Importar proyecto:**
   - Click en "Add New..." → "Project"
   - Seleccionar "Import Git Repository"
   - Buscar y seleccionar `boda-andrea-alberto`
   - Click en "Import"

3. **Configurar:**
   - **Framework**: Seleccionar "Other"
   - **Root Directory**: Dejar como "."
   - **Environment Variables**: (opcional, por ahora dejar vacío)
   - Click en "Deploy"

4. **¡Listo!** Tu sitio estará en vivo en `https://boda-andrea-alberto.vercel.app`

## 🛠️ Configuración Local (Desarrollo)

Si quieres testear localmente antes de desplegar:

```bash
# Instalar dependencias
npm install

# Iniciar servidor local
npm start
# O manualmente: node server.js

# El sitio estará en http://localhost:3000
```

## 📝 Editar Contenido

### Opción 1: Panel Admin (En Vivo)
1. Ir a tu sitio en línea
2. Presionar **Ctrl+E** (o Cmd+E en Mac)
3. Entrar con contraseña: **boda2027**
4. Editar contenido y guardar

### Opción 2: Cambiar Contraseña del Admin
En `public/data.jsx`, busca:
```javascript
admin_password: "boda2027",
```
Cámbialo a tu contraseña preferida y despliega de nuevo.

### Opción 3: Cambiar Datos por Defecto
En `public/data.jsx`, edita el objeto `DEFAULT_DATA`:
```javascript
const DEFAULT_DATA = {
  couple: { a: "Andrea", b: "Alberto", and: "&" },
  // ... más contenido
};
```

## 🌐 Tu Dominio Propio

Para usar un dominio personalizado (ej: `boda-aya.com`):

### En Vercel:
1. Ir a tu proyecto en Vercel
2. Settings → Domains
3. Agregar tu dominio
4. Seguir instrucciones de DNS

### En tu registrador de dominios:
1. Ir a configuración DNS
2. Agregar records CNAME o A según Vercel indique
3. Esperar 24-48 horas para propagación

## 📊 Ver RSVPs y Canciones

### En el Panel Admin:
1. Editar → "Admin Panel" (Ctrl+E)
2. Tab "RSVPs" para ver confirmaciones
3. Tab "Playlist" para ver canciones sugeridas

### En línea de comandos:
```bash
# Listar RSVPs (requiere acceso a server)
curl https://tu-dominio.vercel.app/api/rsvps

# Listar canciones
curl https://tu-dominio.vercel.app/api/songs
```

## 🎨 Personalizar Diseño

### Colores
En `index.html`, busca `:root` en `<style>`:
```css
:root {
  --paper: #f6f5f0;          /* fondo principal */
  --sage-deep: #5a6b5d;      /* color principal */
  --sage: #8a9a8b;           /* color secundario */
  /* ... más variables */
}
```

### Tipografía
En `app.jsx`, busca `PALETTES` para cambiar combinaciones de fuentes:
```javascript
{ value:"italiana-pinyon", label:"Italiana + Pinyon" },
{ value:"cormorant-italianno", label:"Cormorant + Italianno" },
```

### Modo
En `app.jsx`, busca `TWEAK_DEFAULTS`:
```javascript
"mode": "classic",  // o "editorial"
```

## 📱 Mobile-Friendly

El sitio es completamente responsive. Prueba en dispositivos móviles:
- Pantalla completa
- Touch optimizado
- Navegación clara

## 🔒 Privacidad & Seguridad

⚠️ **Importante:**
- La contraseña del admin se envía en texto plano en desarrollo
- Para producción, considera:
  - Usar autenticación OAuth (Google, GitHub)
  - Añadir SSL/HTTPS (incluido en Vercel ✅)
  - Validar contraseñas en servidor

## 🐛 Troubleshooting

### "Error: Cannot find module 'express'"
```bash
npm install
```

### "RSVP no guarda"
Verificar que el servidor está corriendo:
```bash
curl http://localhost:3000/api/health
```

### "Sitio se ve quebrado"
1. Borrar caché del navegador (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Verificar consola de desarrollador (F12)

### "Cambios no se reflejan"
- En GitHub: `git add . && git commit -m "..." && git push`
- En Vercel: Esperar 30-60 segundos después de push
- Si tarda mucho: Redeployar manualmente desde Vercel dashboard

## 📈 Estadísticas

El servidor almacena automáticamente:
- ✅ Confirmaciones (RSVP)
- 🎵 Canciones sugeridas
- 📝 Ediciones del admin
- Todos en JSON para backup fácil

## 💬 Soporte

Para preguntas o problemas:
1. Revisar consola del navegador (F12)
2. Verificar logs de Vercel (Project → Deployments)
3. Probar localmente primero

## 📄 Licencia

Proyecto personal - Uso libre

---

**¡Que disfruten la boda! 🎉**

*Actualizado: Mayo 2026*
