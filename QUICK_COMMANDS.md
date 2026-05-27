# ⚡ COMANDOS ESENCIALES

## 🔧 Setup Inicial

```bash
# Instalar dependencias (solo una vez)
npm install

# Iniciar servidor local para testing
npm start

# O manualmente
node server.js
```

## 📤 Git Workflow

```bash
# Ver cambios
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de cambios"

# Subir a GitHub (Vercel se actualizará automáticamente)
git push origin main

# Ver historial
git log --oneline

# Descargar cambios del servidor
git pull origin main
```

## 📊 Ver Datos

```bash
# Health check (verificar que servidor está OK)
curl http://localhost:3000/api/health

# Obtener contenido actual
curl http://localhost:3000/api/content

# Listar RSVPs (confirmaciones)
curl http://localhost:3000/api/rsvps

# Listar canciones sugeridas
curl http://localhost:3000/api/songs
```

## 🧹 Limpiar/Resetear

```bash
# Eliminar dependencias instaladas
rm -rf node_modules

# Eliminar caché npm
npm cache clean --force

# Reinstalar todo
npm install

# Resetear datos locales (localStorage)
# En consola del navegador:
localStorage.clear()

# Redeployar en Vercel (desde Vercel dashboard o CLI)
# Opción 1: Push a GitHub nuevamente
git push origin main

# Opción 2: Usar Vercel CLI
npm i -g vercel
vercel redeploy
```

## 🔍 Debugging

```bash
# Ver logs locales
npm start

# Abirir consola del navegador para logs de cliente
# Atajo: F12 o Ctrl+Shift+I

# Ver logs de Vercel
# Dashboard: Project → Deployments → [Deploy] → Logs

# Testear API
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

## 📝 Editar Contenido

### Opción 1: Panel Admin (Más fácil)
```
En el navegador:
1. Ctrl+E (o Cmd+E en Mac)
2. Contraseña: boda2027
3. Editar y guardar
```

### Opción 2: Directamente en GitHub
```
1. Ir a github.com/tu-usuario/boda-andrea-alberto
2. public/data.jsx
3. Click en botón de editar (lápiz)
4. Cambiar contenido
5. "Commit changes"
6. Esperar 1-2 min a que Vercel redeploy
```

### Opción 3: Editores locales
```bash
# Abrir en editor de código favorito
code .              # VS Code
nano public/data.jsx # Terminal
# ... editar ...
# Hacer commit y push
git add public/data.jsx
git commit -m "Updated wedding date"
git push origin main
```

## 🔐 Cambiar Contraseña Admin

En `public/data.jsx`:

```javascript
// Buscar:
admin_password: "boda2027",

// Cambiar a:
admin_password: "mi-nueva-contraseña-super-segura",

// Hacer commit
git add public/data.jsx
git commit -m "Changed admin password"
git push origin main
```

## 📦 Desplegar Cambios

```bash
# Flujo completo:
git add .                               # Agregar todos los cambios
git commit -m "Descripción clara"       # Hacer commit
git push origin main                    # Subir a GitHub
# Esperar 2-3 minutos → Vercel redeploy automático
# Verificar en: https://tu-dominio.vercel.app
```

## 🌐 URL Útiles

```
GitHub:        https://github.com/tu-usuario/boda-andrea-alberto
Vercel:        https://vercel.com/dashboard
Sitio:         https://boda-andrea-alberto.vercel.app (o tu dominio)
Local:         http://localhost:3000
```

## 💾 Backup de Datos

```bash
# Crear backup de RSVPs
curl http://localhost:3000/api/rsvps > rsvps-backup.json

# Crear backup de canciones
curl http://localhost:3000/api/songs > songs-backup.json

# Crear backup manual de archivos
zip -r boda-backup-$(date +%Y%m%d).zip public/ data/
```

## 🆘 Si Algo Falla

```bash
# Reinstalar todo
rm -rf node_modules package-lock.json
npm install
npm start

# Limpiar caché
npm cache clean --force
rm -rf .next

# Desconectar y reconectar repo
git remote -v                          # Ver remoto actual
git remote remove origin                # Quitar remoto
git remote add origin https://github.com/tu-usuario/boda-andrea-alberto.git
git push origin main

# Ver el último error en logs
tail -20 /var/log/syslog | grep node
```

## 📱 Testing Rápido

```bash
# Abrir URL en diferentes navegadores
# Chrome:   https://boda-andrea-alberto.vercel.app
# Firefox:  https://boda-andrea-alberto.vercel.app
# Safari:   https://boda-andrea-alberto.vercel.app
# Mobile:   Usar DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)

# Ver performance
# F12 → Network tab → recargar → ver tiempos de carga

# Ver errores
# F12 → Console → Buscar mensajes rojos
```

---

**Pro Tip**: Guarda este archivo en tu escritorio para referencia rápida 📌

---

*Última actualización: Mayo 27, 2026*
