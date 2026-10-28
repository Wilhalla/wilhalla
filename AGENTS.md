# The Wilhalla Monorepo

Wilhalla is a historical ecological sanctuary and community hub located in
Halle-Zoersel, Belgium, dedicated to nature, connection, and holistic
well-being. Continuously cultivated organically since 1962 by founders Daniel
Willaeys and Aleide Lagrou, the site played a foundational role in establishing
Velt (the Association for Ecological Living and Gardening) in 1974. Today,
Wilhalla builds on this heritage by offering a collaborative shared garden
(samentuin), equine coaching with a herd of three horses, and therapy
sessions—including fasciatherapy, music therapy, and yoga—hosted inside its
yurt and renovated barn alongside workshops and community gatherings.

This monorepo contains all digital tooling / infrastructure for Wilhalla. It is hosted on GitHub
(`Wilhalla/wilhalla`) and shared with other people: other editors commit content through the CMS.
An app's own `AGENTS.md` adds app-specific rules; it can tighten these rules, never loosen them.

## Layout

| Path          | What lives there                                                              |
| ------------- | ----------------------------------------------------------------------------- |
| `apps/<app>/` | One directory per product. Components inside keep their names.                |
| `packages/`   | Shared TypeScript packages: `@wilhalla/ui` (theme + shadcn/ui components).    |
| `infra/`      | Infrastructure that is not an app (empty for now).                            |
| `tools/`      | Repo tooling: CI check script, git hooks, the one-time migration script.      |
| `docs/`       | How the monorepo works (`monorepo.md`).                                       |

| App          | What                                                      | Stack                    | Deploys to |
| ------------ | --------------------------------------------------------- | ------------------------ | ---------- |
| `apps/site`  | Public website www.wilhalla.be, with Sveltia CMS          | TanStack Start, Vite     | Vercel     |
| `apps/fruit` | Seniorennet fruit blog archive (fruit.janpeterdhalle.com) | Astro (static)           | Vercel     |
| `apps/playground` | Every `@wilhalla/ui` component in all variants and states | Vite, React     | local only |

## Commands

Run `just` at the root for the list. The important ones:

- `just setup`: install dependencies and git hooks (idempotent).
- `just dev <app>`: start one app's dev server (delegates to `apps/<app>/justfile`).
- `just check [app]`: format check, lint, typecheck, test and build for everything or one app.
- `just ci`: exactly what CI runs: the same checks for the apps changed since `main`.
- `just format`: apply oxfmt everywhere.
- `just <app>/<recipe>`: app-specific recipes, e.g. `just site/sync-map-overlays`.

Each app's justfile keeps the standard recipes `setup`, `dev`, `test`, `check`, `clean`.
`just dev` uses the developer-takeover policy through `jp dev`.

## Dependencies: one version, one lockfile

- One pnpm workspace (`pnpm-workspace.yaml`), one `pnpm-lock.yaml`. **Every** external version
  lives in the workspace catalog; packages declare `"react": "catalog:"`. Upgrading a version in
  the catalog upgrades every app that uses it, in one commit; `just check` shows what broke.
- A deliberate second major goes in a named catalog (`catalog:astro` keeps Vite 7 for Astro 6).
  Pay it down by moving the app to the default version and deleting the named entry.
- Add a dependency: put its version in the catalog, then `pnpm --filter @wilhalla/<app> add
  <dep>@catalog:`. Never run `npm`, `yarn`, `bun` or `nub` installs here.
- Node and pnpm are pinned in `package.json#devEngines` (pnpm downloads them). Do not add a
  second version manager.
- Internal packages use `"@wilhalla/<name>": "workspace:*"`; there is no publishing.

## Formatting, linting, TypeScript

One config each at the root, never per app: `.oxfmtrc.json` (oxfmt), `.oxlintrc.json` (oxlint).
Rules that the imported code still violates are warnings, not errors; fix them and raise them
to `error` rather than adding new exceptions. Each app's `package.json` exposes `typecheck`,
`test` and `build`; the check script runs them with `--if-present`.

## UI: shadcn/ui primitives and Tailwind, not custom CSS

- Build interfaces from **shadcn/ui** primitives and **Tailwind** utilities. Shared components live
  in `packages/ui` (`@wilhalla/ui`); apps import them as
  `@wilhalla/ui/components/<name>` and `cn()` from `@wilhalla/ui/lib/utils`.
- Add a shadcn component with `just ui-add <component>`: it lands in the shared package with
  relative imports. Then move any dependency it added onto the catalog. Both apps use only the
  shared set; keep an app-local copy only when an app deliberately customizes a component.
- The theme is `packages/ui/src/styles/tokens.css`: colours, type scale, shadows, page width and
  the shadcn semantic variables, all as Tailwind theme tokens (it also brings `tw-animate-css` and
  shadcn's base CSS). Apps import it right after `tailwindcss` and only add their typefaces
  (`--font-heading`, `--font-sans`). Type styles for headings and intros are class recipes in
  `@wilhalla/ui/lib/typography` (`typography.display`, `.section`, `.kicker`, `.eyebrow`), usable
  from Astro `class` as well as React.
- No new component classes in CSS (`.my-card { … }`): compose utilities and variants (`cva`)
  instead. Hand-written CSS is for what utilities cannot express, such as complex animations,
  `@font-face` and theme tokens. HTML you do not control (CMS Markdown) is styled with arbitrary
  variants on its wrapper (`[&_a]:underline`), see `apps/site/src/components/markdown-content.tsx`.
- Components never import a router: links take a `linkComponent` (see `link.tsx`) or use
  `asChild`/`buttonVariants()`.
- Every shared component has a story in `apps/playground/src/stories` showing all variants and
  states; add or extend it in the same commit (`just dev playground`).

## CI and deployment

One GitHub Actions workflow (`.github/workflows/ci.yml`) runs `tools/ci/check.sh --affected` on
pull requests and pushes to `main`: format check and lint for the whole repo, then typecheck,
test and build for the apps the change touches (root config changes check every app).
CI does not deploy. Each app is its own Vercel project with its Root Directory set to
`apps/<app>`; Vercel builds previews for branches and production from `main`.

## Branches, commits, worktrees

- `main` is the only long-lived branch. Feature branches are named `<app>/<topic>`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with the
  app as scope: `feat(site): …`, `fix(fruit): …`, `chore: …` for repo-wide work. The
  `commit-msg` hook (`just setup`) checks it. The CMS commits as `content(cms): …`.
- Linked worktrees belong only at `.worktrees/<slug>`; use `just worktree-add <name>`.
- History of the old repositories is kept: `git log -- apps/<app>`, old branches under
  `refs/archive/<app>/…` (see `docs/monorepo.md`).

## Secrets and environment files

- Never commit live `.env`, `.env.*` or `.envrc` files; `.env.example` templates stay versioned.
- Live files are stored with mode `0600` below `~/.config/jpserv/env/wilhalla/<scope>/` and
  symlinked into checkouts; after adding one, run `jp env centralize`.
- Production secrets (CMS OAuth client) live in the Vercel projects, never in the repository.
- Do not copy secret values into docs, logs, issues, shell commands or agent output.
- Do not run `direnv allow` automatically.

## State and builds

- Mutable local state (caches such as `apps/fruit/ml-work`) lives under
  `~/Projects/state/wilhalla/<scope>` (`jp state path`), linked into the checkout.
- Never commit `node_modules`, `dist`, `.output`, `.astro`, `.venv` or caches. Lockfiles are
  source.
