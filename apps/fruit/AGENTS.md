# Seniorennet fruit archive (`apps/fruit`)

Static Astro site that preserves Daniël Willaeys' Seniorennet fruit blog (fruit.wilhalla.be).
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

## Classification and image data

The categories, tags, map positions and image descriptions are generated once and committed as
static JSON (`src/data/generated/`, `public/generated/`); the site only reads them.

- **Posts:** continuation posts are grouped into stories. Each story is scored against the
  approved tag vocabulary (`ml/tag-vocabulary.approved.json`) with Jev on OpenRouter, and
  `ml/category-map.approved.json` groups the tags into the categories of the site. Text
  embeddings (Qwen3 Embedding 8B) are used only for related stories and the positions on the
  Onderwerpen map, not for the categories.
- **Images:** every image gets a short description of what is visible, then Jev scores it
  against `ml/image-vocabulary.approved.json`; `ml/image-category-map.approved.json` groups
  those tags into the gallery filters. Species tags come from `speciesAtlas`.
- **Republish from the cache (free):** `pnpm run semanticAtlas` for posts, `pnpm run imageAtlas`
  for images. Both read `ml-work/`.
- **Rescore (paid):** the `tag`, `embed` and image-tag commands of `scripts/archive_ml*.py`
  need `OPENROUTER_API_KEY` and take `--paid` with a `--max-usd` limit; see their `--help`.
- The scores are model estimates. Nobody has measured their accuracy against hand-labelled
  examples (`ml/review-set.json` is prepared for that).
