# Dockerfile for Web
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/types/package*.json ./packages/types/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/web ./apps/web
COPY packages ./packages
COPY tsconfig.json ./

# Build the application
RUN npm run build --filter=web

# Expose port
EXPOSE 3000

# Start the application
CMD [\"npm\", \"run\", \"start\", \"--filter=web\"]