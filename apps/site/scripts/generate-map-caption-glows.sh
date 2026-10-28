#!/usr/bin/env bash

set -euo pipefail

OUTPUT_DIR="${1:-public/map-overlays/hover}"
MAP_WIDTH="${2:-4000}"
MAP_HEIGHT="${3:-2337}"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required ('magick' command not found)." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

# name cx cy outer_rx outer_ry inner_rx inner_ry
# Coordinates are in the 4000x2337 source-map viewBox.
GLOWS=(
  "kippenhok 2410 1322 150 135 96 86"
  "trampoline 2253 1294 130 90 82 56"
  "boomgaard-kleinfruit 3214 1437 520 410 360 280"
)

for glow in "${GLOWS[@]}"; do
  read -r name cx cy outer_rx outer_ry inner_rx inner_ry <<<"$glow"
  target_path="$OUTPUT_DIR/$name.webp"

  echo "Creating caption glow: $target_path"
  magick -size "${MAP_WIDTH}x${MAP_HEIGHT}" xc:none \
    \( -size "${MAP_WIDTH}x${MAP_HEIGHT}" xc:none \
      -fill "rgba(242,216,123,0.30)" \
      -draw "ellipse $cx,$cy $outer_rx,$outer_ry 0,360" \
      -blur 0x34 \) \
    -compose Over -composite \
    \( -size "${MAP_WIDTH}x${MAP_HEIGHT}" xc:none \
      -fill "rgba(255,246,196,0.24)" \
      -draw "ellipse $cx,$cy $inner_rx,$inner_ry 0,360" \
      -blur 0x16 \) \
    -compose Over -composite \
    -define webp:lossless=true \
    "$target_path"
done

echo "Caption glow overlays written to $OUTPUT_DIR"
