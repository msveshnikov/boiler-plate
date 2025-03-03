FROM oven/bun:1-slim as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install 

# Copy source code
COPY . .
ENV VITE_GOOGLE_CLIENT_ID 652455043417-2tj5qo41pl38e6ufsvplut50e6a2asmp.apps.googleusercontent.com

# Build the application
RUN bun run build

WORKDIR /app/server
COPY server/package*.json server/bun.lockb ./
RUN bun install 

WORKDIR /app
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Start the server
CMD ["bun", "server/index.js"]