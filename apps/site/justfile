set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

default:
    @just --list

install:
    pnpm install

dev:
    pnpm run dev -- --host 0.0.0.0

preview:
    HOST=0.0.0.0 pnpm run preview

build:
    pnpm run build

test:
    pnpm run test

fmt:
    pnpm run format

check:
    pnpm run check

sync-map-overlays source='/home/jp/Downloads/transfer-16' output='public/map-overlays':
    ./scripts/sync-map-overlays.sh "{{source}}" "{{output}}"
