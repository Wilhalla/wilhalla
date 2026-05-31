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

`pnpm run build` emits:

- `dist/client` — browser assets and copied `public/` files
- `dist/server` — TanStack Start SSR server bundle

`pnpm run start` runs `scripts/start-server.mjs`, a small Node server that serves static assets from `dist/client` and sends all page requests through the TanStack Start SSR handler.

Configure the production server with:

- `HOST` (default `0.0.0.0`)
- `PORT` (default `3000`)

## Checks

```bash
pnpm exec tsc --noEmit
pnpm run build
pnpm run test
```
