# Dockerfile for API
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/db/package*.json ./packages/db/
COPY packages/types/package*.json ./packages/types/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages
COPY tsconfig.json ./

# Generate Prisma client
RUN npm run db:generate

# Build the application
RUN npm run build --filter=api

# Expose port
EXPOSE 3001

# Start the application
CMD [\"npm\", \"run\", \"start\", \"--filter=api\"]