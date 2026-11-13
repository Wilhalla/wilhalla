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

Then both apps were standardized on the site's design: one set of typefaces (EB Garamond
headings, Inter text, Geist Mono; all self-hosted through Fontsource in `tokens.css`, so no
visitor falls back to a system font), the site's radii, the site's scaling page and section
titles (`typography.display`, `.section`), and the site's page column (`Container`). Fruit's
Fraunces/DM Sans/Ioskeley fonts, its cream diagram colours and its padded shell are gone.

### Design-system lint

`@shadcn/lint` runs as an oxlint JS plugin (`.oxlintrc.json`: `jsPlugins`, `settings.shadcn.ui`
= `@wilhalla/ui/components`, `themeImports` = `@wilhalla/ui/`). Each app has a
`components.json` naming its stylesheet and pointing `ui` at the shared package, so the linter
reads each app's own Tailwind entry and the shared components; `packages/ui/components.json`
points at `globals.css` (Tailwind + tokens) for the same reason.

All six rules are on. Setting it up found and fixed real problems: `fullscreen:` classes in
fruit's atlas that generated no CSS (now a `@custom-variant`), amber palette colours, dynamic
class strings on table cells, and recurring hand-typed values that became tokens
(`tracking-ui`, `tracking-caps`, `text-label`, `text-mono`, `text-display-fluid`,
`text-heading-lg-fluid`, `rounded-image`). What remains is fruit restyling shared components
(about 315 `no-restyle` warnings, mostly gallery and atlas controls) and some one-off sizes;
the warning cap keeps that number from growing. Promote a rule to `error` for an app once its
count reaches zero.

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
