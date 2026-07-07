# Wilhalla website

Public Wilhalla website built with React, TanStack Router, TanStack Start SSR, Vite, and Tailwind CSS.

## Development

```bash
pnpm install
pnpm run dev
```

The dev server runs on <http://localhost:3000>.

## Production

```bash
pnpm run build
pnpm run start
```

`pnpm run build` emits the TanStack Start/Nitro production bundle into `.output/`:

- `.output/public` — browser assets and copied `public/` files
- `.output/server` — SSR server bundle

`pnpm run start` runs Nitro's Node server entry at `.output/server/index.mjs`.

Configure the production server with:

- `HOST` (default `0.0.0.0`)
- `PORT` (default `3000`)

## Checks

```bash
pnpm exec tsc --noEmit
pnpm run build
pnpm run test
```
