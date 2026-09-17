# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Dùng --omit=dev thay cho --only=production (Chuẩn mới từ npm v7+)
# Dùng 'npm ci' nếu có file package-lock.json để cài đặt chính xác và nhanh hơn
RUN npm ci --omit=dev || npm install --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]