# Wilhalla website (`apps/site`)

Public site for www.wilhalla.be: React, TanStack Start (SSR through Nitro), Vite, Tailwind CSS.
The root `AGENTS.md` applies; this file only adds what is specific to the site.

## Commands

Run from `apps/site` (or `just site/<recipe>` from the root):

```bash
just dev        # http://localhost:3000
just check      # typecheck, tests and build, like CI
just build      # SSR bundle in .output/
```

## Content and the CMS

Page content lives in `src/content/` (Markdown with front matter, `gallery.json`) and is compiled
by content-collections. Editors change it through Sveltia CMS at `/admin`, which commits straight
to `main` of `Wilhalla/wilhalla` through the GitHub API. Its config, `public/admin/config.yml`,
therefore uses paths relative to the **repository root** (`apps/site/src/content/…`,
`/apps/site/public/gallery`); `src/modules/cms-config.test.ts` fails when a path stops existing.
When you move or rename a content file, update the config in the same commit.

- CMS commit messages are configured there too; keep them Conventional (`content(cms): …`).
- The GitHub OAuth handshake runs in this app (`src/routes/api/cms-auth`,
  `src/modules/sveltia-github-oauth.ts`) and needs `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
  (and optionally `ALLOWED_DOMAINS`) in the Vercel project.
