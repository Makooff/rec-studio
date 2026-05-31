#!/bin/bash
# Rec. Studio — Build macOS (.dmg)

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/installer-app"

echo ""
echo "Rec. — Build macOS"
echo "=================="
echo ""

cd "$APP"

echo "Installation des dépendances..."
npm install

echo "Génération de l'icône..."
node generate-icon.js

echo "Build Electron (macOS DMG)..."
npm run build-mac

EXE=$(find "$APP/dist" -name "*.dmg" 2>/dev/null | head -1)
if [ -n "$EXE" ]; then
  SIZE=$(du -sh "$EXE" | cut -f1)
  echo ""
  echo "  ✓ Build réussi !"
  echo "  Fichier : $EXE"
  echo "  Taille  : $SIZE"
  echo ""
else
  echo "Build terminé — vérifiez installer-app/dist/"
fi
