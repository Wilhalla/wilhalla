set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

default:
    @just --list

install:
    bun install

dev:
    bun run dev -- --host 0.0.0.0

preview:
    bun run preview -- --host 0.0.0.0

build:
    bun run build

test:
    bun run test

fmt:
    bun run format

check:
    bun run check

sync-map-overlays source='/home/jp/Downloads/transfer-16' output='public/map-overlays':
    ./scripts/sync-map-overlays.sh "{{source}}" "{{output}}"
