# Seniorennet fruit archive (`apps/fruit`)

Static Astro site that preserves Daniël Willaeys' Seniorennet fruit blog (fruit.janpeterdhalle.com).
The root `AGENTS.md` applies; this file only adds what is specific to the archive.

## Commands

Run from `apps/fruit` (or `just fruit/<recipe>` from the root):

```bash
just dev        # http://127.0.0.1:4321
just check      # astro check, tests, build, and the Python ML tests
just ml-setup   # .venv for the ML pipeline scripts
```

## Data

- The extracted archive (`src/data`, `src/content`) is committed; a normal build needs nothing
  else. Images are served from the S3 bucket configured in `.env` (`.env.example`).
- `ml-work/` holds cached (paid) classification and embedding results. `just setup` links it to
  the state store (`jp state path`), so it survives clean checkouts and stays out of git.
- The `extract`/`copyImages` scripts expect the raw Seniorennet mirror at `../../mirror` relative
  to the app; it is not part of this repository.
- Pipelines: `ML_PIPELINE.md`, `IMAGE_ATLAS.md`.
