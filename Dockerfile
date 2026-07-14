# IoMarkets.ai — OKX.AI A2MCP service image (server + ingester share this image;
# the compose file overrides the command per service). Runs TypeScript directly
# via tsx — no separate build step, matching package.json's scripts.
FROM node:22-slim

WORKDIR /app

# Enable pnpm via corepack, pinned to the version in package.json's packageManager.
RUN corepack enable

# Install deps first for layer caching. Copy lockfile + manifest, then install.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# App source.
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
COPY sql ./sql

EXPOSE 3000

# Default command = the API server; the ingester service overrides this with
# `pnpm ingest` in docker-compose.okx.yml.
CMD ["pnpm", "start"]
