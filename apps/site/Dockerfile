# syntax=docker/dockerfile:1

# ── Builder stage ──────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine-slim

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built SPA assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Let nginx run in foreground
CMD ["nginx", "-g", "daemon off;"]
