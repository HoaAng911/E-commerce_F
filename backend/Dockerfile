# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
