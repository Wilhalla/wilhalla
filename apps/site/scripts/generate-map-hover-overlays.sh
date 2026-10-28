#!/usr/bin/env bash

set -euo pipefail
shopt -s nullglob

INPUT_DIR="${1:-public/map-overlays/original}"
OUTPUT_DIR="${2:-public/map-overlays/hover}"
OUTER_GLOW_COLOR="${OUTER_GLOW_COLOR:-#f2d87b}"
INNER_GLOW_COLOR="${INNER_GLOW_COLOR:-#fff6c4}"
OUTER_GLOW_BLUR="${OUTER_GLOW_BLUR:-32}"
INNER_GLOW_BLUR="${INNER_GLOW_BLUR:-12}"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required ('magick' command not found)." >&2
  exit 1
fi

if [[ ! -d "$INPUT_DIR" ]]; then
  echo "Input directory not found: $INPUT_DIR" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

sources=("$INPUT_DIR"/*.webp "$INPUT_DIR"/*.png)
if (( ${#sources[@]} == 0 )); then
  echo "No .webp or .png overlay images found in $INPUT_DIR" >&2
  exit 1
fi

for source_path in "${sources[@]}"; do
  source_name="$(basename "$source_path")"
  target_name="${source_name%.*}.webp"
  target_path="$OUTPUT_DIR/$target_name"
  dimensions="$(magick identify -format '%wx%h' "$source_path")"

  echo "Creating uniform glow overlay: $source_path -> $target_path"

  magick "$source_path" \
    -alpha on \
    -write mpr:base \
    -delete 0 \
    \( -size "$dimensions" xc:none \) \
    \( -size "$dimensions" xc:"$OUTER_GLOW_COLOR" \
      \( mpr:base -alpha extract -blur "0x$OUTER_GLOW_BLUR" -level 0,72% \) \
      -compose CopyOpacity -composite \) \
    -compose Screen -composite \
    \( -size "$dimensions" xc:"$INNER_GLOW_COLOR" \
      \( mpr:base -alpha extract -blur "0x$INNER_GLOW_BLUR" -level 0,62% \) \
      -compose CopyOpacity -composite \) \
    -compose Screen -composite \
    \( mpr:base -modulate 108,125,100 -brightness-contrast 4x4 \) \
    -compose Over -composite \
    -define webp:lossless=true \
    "$target_path"
done

echo "Hover glow overlays written to $OUTPUT_DIR"
