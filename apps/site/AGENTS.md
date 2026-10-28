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

## Commit messages

Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) for every commit: `type(scope): summary`, with the scope optional. Use `feat` for features, `fix` for bug fixes, and `!` or a `BREAKING CHANGE:` footer for breaking changes. Other descriptive types such as `docs`, `chore`, and `content` are allowed. Run `just install` in a fresh checkout to enable the tracked `commit-msg` hook. Sveltia CMS writes commits through GitHub; keep its templates in `public/admin/config.yml` conventional as well.
