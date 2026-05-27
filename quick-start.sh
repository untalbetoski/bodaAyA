#!/bin/bash
# quick-start.sh — Script para iniciar el proyecto localmente

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🎉 Boda Andrea & Alberto — Quick Start                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si existe node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
fi

echo ""
echo "🚀 Iniciando servidor local..."
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "   🌐 Sitio disponible en: http://localhost:3000"
echo ""
echo "   💡 Tips:"
echo "      • Panel admin: Presiona Ctrl+E (o Cmd+E en Mac)"
echo "      • Contraseña admin: boda2027"
echo "      • Detener servidor: Ctrl+C"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

npm start
