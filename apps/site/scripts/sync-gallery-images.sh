#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/sync-gallery-images.sh <source.zip|source-dir> [output-dir] [gallery-data-file]

Converts gallery source images to web-optimized WebP assets and writes the
JSON gallery data file consumed by both the site and Sveltia CMS.

Defaults:
  output-dir:        public/gallery
  gallery-data-file: src/content/gallery.json

Requires:
  - ImageMagick (`magick`) with support for the input formats you use
  - unzip, when the source is a .zip archive

Example:
  scripts/sync-gallery-images.sh ~/Downloads/gallery.zip
EOF
}

SOURCE="${1:-}"
OUTPUT_DIR="${2:-public/gallery}"
GALLERY_DATA_FILE="${3:-src/content/gallery.json}"
THUMB_MAX_SIZE="${THUMB_MAX_SIZE:-800x800>}"
FULL_MAX_SIZE="${FULL_MAX_SIZE:-1400x1400>}"
THUMB_QUALITY="${THUMB_QUALITY:-78}"
FULL_QUALITY="${FULL_QUALITY:-76}"

if [[ -z "$SOURCE" || "$SOURCE" == "-h" || "$SOURCE" == "--help" ]]; then
  usage
  [[ -z "$SOURCE" ]] && exit 1 || exit 0
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required (\`magick\` command not found)." >&2
  exit 1
fi

if [[ ! -e "$SOURCE" ]]; then
  echo "Source not found: $SOURCE" >&2
  exit 1
fi

if [[ -d "$SOURCE" ]]; then
  SOURCE="$(cd "$SOURCE" && pwd)"
else
  SOURCE="$(cd "$(dirname "$SOURCE")" && pwd)/$(basename "$SOURCE")"
fi

if [[ "$SOURCE" == *.zip || "$SOURCE" == *.ZIP ]]; then
  if ! command -v unzip >/dev/null 2>&1; then
    echo "unzip is required for zip sources." >&2
    exit 1
  fi
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

WORK_DIR="$(mktemp -d)"
METADATA_TSV="$WORK_DIR/gallery-images.tsv"
trap 'rm -rf "$WORK_DIR"' EXIT

touch "$METADATA_TSV"
mkdir -p "$OUTPUT_DIR" "$(dirname "$GALLERY_DATA_FILE")"
rm -f "$OUTPUT_DIR"/gallery-*.webp

is_supported_image() {
  local path_lower
  path_lower="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"
  case "$path_lower" in
    *.jpg|*.jpeg|*.png|*.webp|*.heic|*.heif|*.tif|*.tiff) return 0 ;;
    *) return 1 ;;
  esac
}

source_paths=()
original_names=()

if [[ -d "$SOURCE" ]]; then
  while IFS= read -r -d '' path; do
    source_paths+=("$path")
    original_names+=("$(basename "$path")")
  done < <(find "$SOURCE" -type f \
    \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.heic' -o -iname '*.heif' -o -iname '*.tif' -o -iname '*.tiff' \) \
    -not -path '*/__MACOSX/*' -not -name '.DS_Store' -print0 | sort -z)
else
  unzip -q "$SOURCE" -d "$WORK_DIR/source"
  while IFS= read -r rel_path; do
    [[ -z "$rel_path" ]] && continue
    [[ "$rel_path" == */ ]] && continue
    [[ "$rel_path" == __MACOSX/* || "$rel_path" == */__MACOSX/* ]] && continue
    [[ "$(basename "$rel_path")" == ".DS_Store" ]] && continue
    if is_supported_image "$rel_path"; then
      source_paths+=("$WORK_DIR/source/$rel_path")
      original_names+=("$(basename "$rel_path")")
    fi
  done < <(unzip -Z1 "$SOURCE")
fi

if (( ${#source_paths[@]} == 0 )); then
  echo "No supported image files found in: $SOURCE" >&2
  exit 1
fi

echo "Converting ${#source_paths[@]} gallery image(s) -> $OUTPUT_DIR"

for index in "${!source_paths[@]}"; do
  source_path="${source_paths[$index]}"
  original_name="${original_names[$index]}"
  number="$((index + 1))"
  base="$(printf 'gallery-%02d' "$number")"
  thumb_path="$OUTPUT_DIR/$base-sm.webp"
  full_path="$OUTPUT_DIR/$base.webp"

  echo "  $original_name -> $base.webp"

  magick "$source_path" \
    -auto-orient \
    -resize "$THUMB_MAX_SIZE" \
    -strip \
    -quality "$THUMB_QUALITY" \
    -define webp:method=6 \
    "$thumb_path"

  magick "$source_path" \
    -auto-orient \
    -resize "$FULL_MAX_SIZE" \
    -strip \
    -quality "$FULL_QUALITY" \
    -define webp:method=6 \
    "$full_path"

  read -r thumb_width thumb_height < <(identify -format '%w %h\n' "$thumb_path")
  read -r full_width full_height < <(identify -format '%w %h\n' "$full_path")

  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "/gallery/$base-sm.webp" \
    "/gallery/$base.webp" \
    "$thumb_width" \
    "$thumb_height" \
    "$full_width" \
    "$full_height" \
    "$original_name" >> "$METADATA_TSV"
done

python3 - "$METADATA_TSV" "$GALLERY_DATA_FILE" <<'PY'
from pathlib import Path
import json
import sys

metadata_path = Path(sys.argv[1])
gallery_data_path = Path(sys.argv[2])
existing_by_original_name = {}
existing_by_image = {}

if gallery_data_path.exists():
    existing = json.loads(gallery_data_path.read_text(encoding="utf-8"))
    for image in existing.get("images", []):
        if image.get("originalName"):
            existing_by_original_name[image["originalName"]] = image
        if image.get("image"):
            existing_by_image[image["image"]] = image

images = []
for line in metadata_path.read_text(encoding="utf-8").splitlines():
    thumbnail, image, width, height, full_width, full_height, original_name = line.split("\t")
    existing = existing_by_original_name.get(original_name) or existing_by_image.get(image) or {}
    images.append(
        {
            "image": image,
            "thumbnail": thumbnail,
            "alt": existing.get("alt", ""),
            "originalName": original_name,
            "width": int(width),
            "height": int(height),
            "fullWidth": int(full_width),
            "fullHeight": int(full_height),
        }
    )

gallery_data_path.write_text(
    json.dumps({"images": images}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
PY

echo "Gallery data written to $GALLERY_DATA_FILE"
echo "Done."
