# =============================================================
# Dockerfile — Backend API (Express.js)
# Multi-stage build for smaller production image
# =============================================================

# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

# ---- Production Stage ----
FROM node:22-alpine

WORKDIR /app

# Copy only production dependencies and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]
