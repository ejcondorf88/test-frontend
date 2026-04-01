# syntax=docker/dockerfile:1.4

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies (only production deps in this stage)
RUN npm ci --only=production && npm cache clean --force

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ==========================================
# Stage 3: Production
# ==========================================
FROM nginxinc/nginx-unprivileged:1.25-alpine AS production

# Install curl for healthcheck
USER root
RUN apk add --no-cache curl

# Create temp directory and set permissions
RUN mkdir -p /tmp/nginx && chown -R nginx:nginx /tmp/nginx

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Use the unprivileged nginx user
USER nginx

# Expose port (8080 is already default in unprivileged image)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
