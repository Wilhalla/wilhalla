# How the Wilhalla monorepo works

The long version of the root `AGENTS.md`: where each piece lives, and how the old standalone
repositories were folded in. It follows the layout of Jan-Peter's `jp` monorepo, scaled down:
two frontends need a shared workspace and shared versions, not a build orchestrator.

## The pieces

| Concern              | Tool                         | Source of truth                                  |
| -------------------- | ---------------------------- | ------------------------------------------------ |
| JS/TS dependencies   | pnpm 11 workspace + catalog  | `pnpm-workspace.yaml`, `pnpm-lock.yaml`          |
| Node and pnpm        | pnpm `devEngines`            | `package.json`                                   |
| UI components, theme | shadcn/ui, Tailwind CSS v4   | `packages/ui`, `apps/playground`                 |
| Formatting           | oxfmt                        | `.oxfmtrc.json`                                  |
| Linting              | oxlint                       | `.oxlintrc.json`                                 |
| Command surface      | just                         | `justfile`, `apps/<app>/justfile`                |
| Checks               | one script                   | `tools/ci/check.sh`                              |
| CI                   | GitHub Actions, one job      | `.github/workflows/ci.yml`                       |
| Git hooks            | prek                         | `prek.toml`                                      |
| Deployment           | Vercel, one project per app  | Vercel project settings (Root Directory)         |
| Worktrees, env, state| `jp` helper                  | `~/.local/bin/jp`                                |

### Shared dependencies

Every external version is in the default catalog of `pnpm-workspace.yaml`, also when only one app
uses it today: there is exactly one place to read and bump versions, and an app that starts
using a package gets the version the other app already runs. The lockfile is shared too, so a
version is installed once.

Exceptions are explicit:

- **Named catalogs** for a second major an app cannot leave yet. `catalogs.astro` holds Vite 7,
  because Astro 6 bundles Vite 7 and `@tailwindcss/vite` in `apps/fruit` must resolve the same
  Vite as Astro (with the site's Vite 8 it fails with `Missing field tsconfigPaths`).
- **Exact pins** in the catalog (`@tanstack/react-start`, `nitro`, `recharts`) are deliberate;
  the TanStack packages move together, with `@tanstack/start-server-core` held by an override.
- `trustPolicyExclude` lists the few old releases that lost npm provenance but are known good.

### Shared UI

`@wilhalla/ui` is consumed as TypeScript source (no build step), like shadcn's monorepo layout:
`packages/ui/components.json` points `shadcn add` at the package, `normalize-imports.sh` turns
the generated alias imports into relative ones. `tokens.css` carries an `@source` for the
package's components, so each app's Tailwind build generates the classes they use.

`cn()` is tailwind-merge extended with the theme's custom steps (`text-body`, `leading-body`,
`shadow-subtle-2`, …). Without that, it treats `text-body` as a colour and silently drops it
when a `text-gravel` follows.

The site was moved onto it first (its `el-*`, `eleven-*`, `site-container` and Markdown CSS
became Tailwind utilities and `buttonVariants()`); screenshots of every route at 1280 and 390 px
were compared with the build before the change and match within anti-aliasing.

Fruit followed: its 19 shadcn components (already styled on the same palette) moved into the
package, its alias colours (`midnight-navy`, `slate-ink`, `rule`, `shadow-soft`, …) were renamed
to the shared tokens they pointed at, and its `@utility` classes (`display-title`,
`section-title`, `section-kicker`, `eyebrow`, `site-shell`, `button-link`, `legacy-content`)
became the `typography`/`layout` recipes, `buttonVariants()` and a `legacyContent` class list.
Fruit screenshots match the previous build except where links became shared buttons
(34 px pills instead of 36 px). What stays app-local on purpose: each app's typefaces, and
fruit's `global.css` animations and state-driven layout (site loader, collapsing photo panel,
view transitions).

Visible differences that remain between the apps, now side by side in the playground, are
design decisions rather than code: the typefaces (EB Garamond vs Fraunces + DM Sans), the page
title size (the site's `PageHeader` scales 36 to 48 px; `typography.display` is a fixed 48 px),
and the page column (`Container`: 16 px gutter; `layout.shell`: 32 px padding).

### What CI runs

`tools/ci/check.sh --affected` compares the commit with the base (the PR's base commit, or the
previous `main` commit on a push):

1. `oxfmt --check` and `oxlint` over the whole repository (seconds),
2. `typecheck`, `test`, `build` of the packages with changed files, and of everything that
   depends on them (`pnpm --filter "...[<base>]"`),
3. everything, when a file outside `apps/`, `packages/` and `docs/` changed (lockfile, catalog,
   lint config, the workflow itself).

So a CMS content commit in `apps/site` checks only the site. `just check [app]` runs the same
script locally for everything or one app.

### Lint debt

The imported apps were never linted with the shared config. Rules they still violate are
`warn` in `.oxlintrc.json` (the React Compiler rules such as `react/set-state-in-effect`,
`react-hooks/exhaustive-deps`, and a few `jsx-a11y` rules). Fixing them changes behaviour, so
they are fixed per app in their own commits; when a rule reaches zero, raise it to `error`.

## Migration record (2026-10-28)

The standalone repositories were imported with full history by `tools/migration/import-repos.sh`
(`git filter-repo --to-subdirectory-filter` on mirror clones; the originals were not modified).

| Slug  | Source (`~/Projects/src/wilhalla_bak/…`)                       | Now          | Branches |
| ----- | -------------------------------------------------------------- | ------------ | -------- |
| fruit | `seniorennet-fruit-archive` (`Wilhalla/seniorennet-fruit-archive-site`) | `apps/fruit` | 5 |
| site  | `wilhalla-site` (`Wilhalla/wilhalla-site`)                     | `apps/site`  | 1 |

- `main` has one merge commit per import; tag `monorepo/import` marks the state right after.
- Every branch is kept, rewritten into its subdirectory, under `refs/archive/<slug>/heads/*` and
  `refs/archive/<slug>/remotes/*` (`git for-each-ref refs/archive`). Neither repository had tags.
  The four fruit feature branches were fully merged into `develop` and their worktrees clean, so
  no branch or worktree was recreated.
- The repo-wide formatting commit is listed in `.git-blame-ignore-revs`.
- Moved out of the checkouts: the fruit `.env` (central env store), `.vercel` project link, and
  the `ml-work/` cache (state store). `.venv` was not moved: `just fruit/ml-setup` recreates it.

### Changed on the way in

- Per-app lockfiles, `pnpm-workspace.yaml`, oxfmt/oxlint configs and `.githooks` replaced by the
  root ones; package names are `@wilhalla/fruit` and `@wilhalla/site`.
- TypeScript 6 for both apps (the site was on 5.9); the deprecated `baseUrl` was dropped.
- fruit: `build` no longer runs `astro check`; that is the separate `typecheck` script.
- site: `public/admin/config.yml` points the CMS at `Wilhalla/wilhalla`, branch `main`, with
  paths prefixed `apps/site/`; the Dockerfile builds with the repository root as context.
- Old worktree instructions (`instances/`, `runtime/`, `docs/guides/worktrees.md`) removed.

## Cutover checklist

Done locally; these steps publish or switch things over. Until step 4 the old repositories stay
authoritative: **CMS edits made there in the meantime must be brought over** (see below).

1. Create `Wilhalla/wilhalla` on GitHub, `git remote add origin git@github.com:Wilhalla/wilhalla.git`,
   push `main` and tags, and optionally the archive: `git push origin 'refs/archive/*:refs/archive/*'`.
2. Give the CMS editors write access to `Wilhalla/wilhalla` (the CMS commits with their own
   GitHub account). Protecting `main` with required reviews would block CMS saves; require the
   CI check at most.
3. Vercel, for both projects: Settings → Git → connect `Wilhalla/wilhalla`; Settings → Build →
   Root Directory `apps/site` resp. `apps/fruit`, and enable "Skip deployments when there are no
   changes to the root directory". Production branch `main`. Leave the install command at its
   default (Vercel detects the pnpm workspace from the lockfile at the root). Keep the
   environment variables (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `PUBLIC_*`) as they are.
4. Deploy the site from the monorepo, open `/admin`, log in and save a small change: it must
   land as a `content(cms): …` commit under `apps/site/` on `main` of `Wilhalla/wilhalla`.
5. Archive `Wilhalla/wilhalla-site` and `Wilhalla/seniorennet-fruit-archive-site` (read-only);
   move open issues with `gh issue transfer`. Delete `~/Projects/src/wilhalla_bak` once you no
   longer need it.

Bringing over commits made in an old repository after the import (e.g. CMS edits):

```sh
git fetch git@github.com:Wilhalla/wilhalla-site.git develop
git format-patch --stdout refs/archive/site/heads/develop..FETCH_HEAD \
  | git am --directory=apps/site
```
