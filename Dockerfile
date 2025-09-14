# AI Email Marketing System
# Multi-stage Dockerfile for production deployment

# Base stage with Node.js
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g turbo@1.10.7 typescript

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY turbo.json ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/
RUN npm ci

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install
RUN npx turbo run db:generate
RUN npm run build
RUN ls -l apps/api/dist
# Temporarily removed failing COPY commands for debugging

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
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "dist/apps/api/src/main.js"]

# Web Production stage  
FROM node:20-alpine AS web-production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
# Temporarily removed failing COPY commands for debugging
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3500

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3500/api/health || exit 1

CMD ["node", "apps/web/server.js"]