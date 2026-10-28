#!/usr/bin/env bash
# Format check, lint, typecheck, test and build: the one check CI and `just check` run.
#
#   tools/ci/check.sh --all          every package
#   tools/ci/check.sh apps/<app>     one app (and the workspace packages it uses)
#   tools/ci/check.sh --affected     packages changed since CI_BASE (default: merge base with
#                                    origin/main), plus everything that depends on them
#
# Formatting and linting always cover the whole repository: they take seconds.
set -euo pipefail
cd "$(dirname "$0")/../.."

mode="${1:---all}"
filter=(-r)
case "$mode" in
  --all) ;;
  --affected)
    base="${CI_BASE:-}"
    if [[ -z "$base" || "$base" =~ ^0+$ ]]; then
      base="$(git merge-base HEAD origin/main 2>/dev/null || true)"
    fi
    if [[ -z "$base" ]]; then
      echo "no base revision: checking everything"
    elif git diff --name-only "$base" HEAD | grep -qvE '^(apps/|packages/|docs/)|\.md$'; then
      # Root config (lockfile, catalog, lint/format config, CI) can affect every app.
      echo "shared files changed since ${base:0:12}: checking everything"
    else
      filter=(--filter "...[$base]")
      echo "checking packages changed since ${base:0:12}"
    fi
    ;;
  *) filter=(--filter "{./${mode%/}}...") ;;
esac

pnpm exec oxfmt --check
pnpm exec oxlint
for script in typecheck test build; do
  pnpm "${filter[@]}" --workspace-concurrency=1 run --if-present "$script"
done
