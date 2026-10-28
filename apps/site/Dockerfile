# syntax=docker/dockerfile:1
# Build context = repository root: `docker build -f apps/site/Dockerfile .` (or `just site/image`).

# ── Builder stage ──────────────────────────────────────────────────────────────
FROM node:24.22.1-alpine AS builder
RUN npm install -g pnpm@11.28.5
WORKDIR /src

# `pnpm fetch` only needs the lockfile, so the download layer survives source changes.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile --filter "@wilhalla/site..."
RUN pnpm --filter @wilhalla/site run build

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM node:24.22.1-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

COPY --from=builder /src/apps/site/.output ./.output

EXPOSE 80

CMD ["node", ".output/server/index.mjs"]
