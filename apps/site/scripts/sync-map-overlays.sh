#!/usr/bin/env bash

set -euo pipefail

SOURCE_DIR="${1:-/home/jp/Downloads/transfer-16}"
OUTPUT_DIR="${2:-public/map-overlays}"
MAP_WIDTH="${3:-4000}"
MAP_HEIGHT="${4:-2337}"
ORIGINAL_DIR="$OUTPUT_DIR/original"
HOVER_DIR="$OUTPUT_DIR/hover"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

  echo "Syncing $source_name -> $original_path"
  magick "$source_path" \
    -resize "${MAP_WIDTH}x${MAP_HEIGHT}!" \
    -define webp:lossless=true \
    "$original_path"

done

"$SCRIPT_DIR/generate-map-hover-overlays.sh" "$ORIGINAL_DIR" "$HOVER_DIR"
"$SCRIPT_DIR/generate-map-caption-glows.sh" "$HOVER_DIR" "$MAP_WIDTH" "$MAP_HEIGHT"

echo "Overlay images written to $OUTPUT_DIR"
