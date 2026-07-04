# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the source code
COPY . .

# Build frontend and backend bundles, and generate database migration files
RUN npm run build

# Stage 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set execution environment to production
ENV NODE_ENV=production

# Copy dependency configuration
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled bundles and assets from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database
COPY --from=builder /app/public ./public

# Ensure local persistence directories exist inside the container filesystem
RUN mkdir -p public/uploads

# Expose default application port
EXPOSE 3000

# Command to execute the production server
CMD ["npm", "run", "start"]
