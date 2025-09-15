# Multi-stage build for production optimization
FROM node:20-alpine AS base

# Install production dependencies only
FROM base AS deps
WORKDIR /app

# Install build tools for native dependencies (bcrypt, etc.)
RUN apk add --no-cache python3 make g++ pkgconfig

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Development dependencies for building
FROM base AS build-deps
WORKDIR /app

# Install build tools for Prisma and native dependencies
RUN apk add --no-cache python3 make g++ pkgconfig

COPY package*.json ./
RUN npm ci

# Build the application
FROM build-deps AS build
WORKDIR /app

# Copy source code
COPY . .

# Generate Prisma client with dev dependencies available
RUN npx prisma generate

# Build client and server (esbuild bundles server into single dist/index.js)
RUN npm run build

# Prepare production node_modules by pruning dev dependencies
RUN npm prune --production

# Production image
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S replit -u 1001

# Copy production dependencies with generated Prisma client
COPY --from=build /app/node_modules ./node_modules

# Copy built application (esbuild outputs bundled server to dist/index.js)
COPY --from=build /app/dist ./dist
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/package*.json ./

# Set ownership to non-root user
RUN chown -R replit:nodejs /app
USER replit

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 5000

# Start the application (esbuild outputs to dist/index.js)
CMD ["node", "dist/index.js"]