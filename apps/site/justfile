set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

default:
    @just --list

bootstrap:
    ./scripts/bootstrap-worktree.sh

env:
    ./scripts/print-worktree-env.sh

port-map:
    ./scripts/port-map.sh

worktree-add name branch='' start='HEAD':
    if [[ -n "{{branch}}" ]]; then ./scripts/worktree-create.sh "{{name}}" "{{branch}}" "{{start}}"; else ./scripts/worktree-create.sh "{{name}}"; fi

worktree-list:
    ./scripts/worktree-list.sh

worktree-rm name force='false':
    ./scripts/worktree-remove.sh "{{name}}" "{{force}}"

install:
    bun install

dev:
    ./scripts/run-ui.sh

preview:
    ./scripts/run-preview.sh

build:
    bun run build

test:
    bun run test

fmt:
    bun run format

check:
    bun run check
