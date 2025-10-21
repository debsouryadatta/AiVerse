FROM node:18-slim AS base

# Install OpenSSL early in your Dockerfile
RUN apt-get update -y
RUN apt-get install -y openssl

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]