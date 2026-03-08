#!/usr/bin/env bash

set -euo pipefail

SOURCE_DIR="${1:-/home/jp/Downloads/transfer-16}"
OUTPUT_DIR="${2:-public/map-overlays}"
MAP_WIDTH="${3:-4000}"
MAP_HEIGHT="${4:-2337}"
ORIGINAL_DIR="$OUTPUT_DIR/original"
HOVER_DIR="$OUTPUT_DIR/hover"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required (`magick` command not found)." >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$ORIGINAL_DIR" "$HOVER_DIR"

slugify() {
  local input="$1"

  input="${input#cutout }"
  input="${input% wilhalla.png}"
  input="$(printf '%s' "$input" | tr '[:upper:]' '[:lower:]')"
  input="$(printf '%s' "$input" | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"

  case "$input" in
    paarden) echo "horses" ;;
    samentuin) echo "garden" ;;
    schuur) echo "barn" ;;
    vakes-appelboom) echo "vake-tree" ;;
    zwaluwen) echo "swallows" ;;
    *) echo "$input" ;;
  esac
}

for source_path in "$SOURCE_DIR"/*.png; do
  [[ -e "$source_path" ]] || continue

  source_name="$(basename "$source_path")"
  target_name="$(slugify "$source_name")"
  original_path="$ORIGINAL_DIR/$target_name.webp"
  hover_path="$HOVER_DIR/$target_name.webp"

  echo "Syncing $source_name -> $original_path"
  magick "$source_path" \
    -resize "${MAP_WIDTH}x${MAP_HEIGHT}!" \
    -define webp:lossless=true \
    "$original_path"

  echo "Creating hover treatment for $source_name -> $hover_path"
  magick "$source_path" \
    -resize "${MAP_WIDTH}x${MAP_HEIGHT}!" \
    -write mpr:base \
    -delete 0 \
    \( -size "${MAP_WIDTH}x${MAP_HEIGHT}" xc:none \) \
    \( -size "${MAP_WIDTH}x${MAP_HEIGHT}" xc:"#f2d87b" \
      \( mpr:base -alpha extract -morphology Dilate Disk:6 -blur 0x14 -level 0,58% \) \
      -compose CopyOpacity -composite \) \
    -compose Over -composite \
    \( mpr:base -modulate 122,160,100 -brightness-contrast 10x16 \) \
    -compose Over -composite \
    \( -size "${MAP_WIDTH}x${MAP_HEIGHT}" xc:"#fff6c4" \
      \( mpr:base -alpha extract -morphology EdgeOut Diamond:1 -blur 0x4 -level 0,48% \) \
      -compose CopyOpacity -composite \) \
    -compose Screen -composite \
    -define webp:lossless=true \
    "$hover_path"
done

echo "Overlay images written to $OUTPUT_DIR"
