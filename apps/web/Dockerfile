# Multi-stage Dockerfile for Web
# Base stage
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat curl
RUN npm install -g turbo@1.10.7

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/types/package*.json ./packages/types/
COPY packages/db/package*.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma

# Install dependencies with better caching and timeout handling
# Skip prepare scripts (husky) during Docker build
RUN npm ci --only=production --timeout=300000 --ignore-scripts
RUN npm ci --timeout=300000 --ignore-scripts

# Builder stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client
RUN npx turbo run db:generate

# Build packages and application
RUN npx turbo run build --filter=web

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
# Copy public directory if it exists, otherwise create empty one
RUN mkdir -p ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "run", "start", "--workspace=web"]