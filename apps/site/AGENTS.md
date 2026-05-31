# Agent Instructions

This is a regular single-checkout repository. Work directly in the repo root (`/home/jp/Code/wilhalla`).

- Do **not** create or use managed worktrees under `instances/` for normal work.
- Keep generated/dependency directories (`node_modules/`, `dist/`, `.roam/`) out of git.
- For risky repository-layout changes, make an out-of-tree backup first.
- Run `pnpm run build` before landing code changes when practical.

## Common commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run test
just sync-map-overlays
```
