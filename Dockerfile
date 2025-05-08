# Stage 1: Build stage
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy the entire project and build
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM node:16-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built server code and client assets from the builder stage.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docs ./docs

# Expose the port and run the compiled server code.
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
