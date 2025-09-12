# AI Email Marketing System
# Multi-stage Dockerfile for production deployment

# Base stage with Node.js
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g turbo typescript

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY turbo.json ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/
RUN npm ci --omit=dev --ignore-scripts

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN turbo run build

# API Production stage
FROM node:20-alpine AS api-production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "run", "start:prod"]

# Web Production stage  
FROM node:20-alpine AS web-production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "apps/web/server.js"]