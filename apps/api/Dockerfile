# Dockerfile for API
FROM node:18-alpine

# Install OpenSSL and curl for health checks
RUN apk add --no-cache openssl curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/types/package*.json ./packages/types/
COPY packages/db/package*.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma

# Install dependencies
RUN npm install

# Generate Prisma client
WORKDIR /app/packages/db
RUN npx prisma generate --schema=prisma/schema.prisma
WORKDIR /app

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages
COPY tsconfig.json ./

# Build packages first
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=packages/types
RUN npm run build --workspace=packages/ui

# Build the API application
RUN npm run build --filter=api

# Expose port
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/v1/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]