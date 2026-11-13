# Wilhalla monorepo: one command surface for every app.
#
#   just setup                 install dependencies for the whole repo
#   just dev <app>             start an app's dev server             (apps/<app>/justfile)
#   just check [app]           format/lint/typecheck/test/build     (`just ci`: affected only)
#   just <app>/<recipe>        any app-specific recipe, e.g. `just site/sync-map-overlays`

set shell := ["bash", "-euo", "pipefail", "-c"]

[private]
default:
    @just --list --unsorted

# Install dependencies and git hooks; idempotent. Node and pnpm come from package.json#devEngines.
setup:
    pnpm install --frozen-lockfile
    git config blame.ignoreRevsFile .git-blame-ignore-revs
    @if command -v prek >/dev/null; then prek install; else echo "prek not installed: git hooks skipped"; fi

# Start an app's local development server.
dev app *args:
    cd apps/{{app}} && just dev {{args}}

# Format check, lint, typecheck, test and build; everything, or one app.
check app="":
    tools/ci/check.sh {{ if app == "" { "--all" } else { "apps/" + app } }}

# What CI runs: checks for the apps changed since main (or CI_BASE).
ci:
    tools/ci/check.sh --affected

# Run tests; everything or one app.
test app="":
    pnpm {{ if app == "" { "-r" } else { "--filter ./apps/" + app } }} run --if-present test

# Build; everything or one app.
build app="":
    pnpm {{ if app == "" { "-r" } else { "--filter ./apps/" + app } }} run --if-present build

# Lint everything with the shared oxlint config, including @shadcn/lint (capped warnings).
lint:
    pnpm run lint

# Apply the shared formatter (oxfmt) everywhere.
format:
    pnpm exec oxfmt .

# Add shadcn/ui components to the shared @wilhalla/ui package, e.g. `just ui-add dialog`.
ui-add +components:
    cd packages/ui && pnpm exec shadcn add -y {{components}} && ./normalize-imports.sh && cd ../.. && pnpm exec oxfmt packages/ui
    @# shadcn resolves the package's own utils alias to the unrelated npm package "cn"; drop it again.
    @if grep -q '"cn":' packages/ui/package.json; then pnpm --filter @wilhalla/ui remove cn; fi

# Create a linked worktree under .worktrees/<name> (env, state and caches set up by `jp`).
worktree-add name *args:
    jp worktree add {{name}} {{args}}

# Remove a linked worktree.
worktree-rm name *args:
    jp worktree remove {{name}} {{args}}

# Remove generated build output only (never sources, env files or state).
clean:
    for app in apps/*/; do (cd "$app" && just clean); done
