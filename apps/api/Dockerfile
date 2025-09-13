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

WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/node_modules ./node_modules

CMD ["npm", "run", "start:prod"]