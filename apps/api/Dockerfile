# Dockerfile for API
FROM node:18-alpine AS builder

WORKDIR /app/apps/api

# Copy package files
COPY ../../package*.json ../../
COPY ../../turbo.json ../../
COPY apps/api/package*.json ./
COPY packages/db/package*.json ../../packages/db/
COPY packages/types/package*.json ../../packages/types/

# Install dependencies
ENV HUSKY=0
RUN npm install --ignore-scripts

# Copy source code
COPY ../../apps/api ./
COPY ../../packages ../../packages

# Generate Prisma client
WORKDIR /app
RUN npm run db:generate --workspace=packages/db
WORKDIR /app/apps/api

# Build the application
RUN npm run build





# Expose port
EXPOSE 3001

# Start the application

FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl curl

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "apps/api/dist/apps/api/src/main.js"]