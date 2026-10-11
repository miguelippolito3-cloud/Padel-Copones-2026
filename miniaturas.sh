#!/usr/bin/env bash
# 📸 Miniaturas livianas para la app: fotos/<tipo>/min/<mismo nombre>.jpg (360 px de ancho, JPEG calidad 78).
# Las grillas, el hero y los avatares usan la miniatura; el visor sigue abriendo la grande.
# Uso (en la carpeta del repo, con ImageMagick): bash miniaturas.sh  → crea solo las que faltan o están viejas.
# Si una foto no tiene miniatura no pasa nada: la app muestra la grande (solo pesa más).
cd "$(dirname "$0")" || exit 1
for f in fotos/*/*.jpg; do
  m="$(dirname "$f")/min/$(basename "$f")"
  [ -f "$m" ] && [ "$m" -nt "$f" ] && continue
  mkdir -p "$(dirname "$m")"
  convert "$f" -auto-orient -strip -resize '360x>' -quality 78 "$m" && echo "✓ $m"
done
