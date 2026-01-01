# 1. Use Node 22 for @prisma/extension-accelerate compatibility
FROM node:22-slim

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies without running scripts
RUN npm install --ignore-scripts

# Copy the rest of the application
COPY . .

# Remove the prisma config file if it exists to avoid path confusion
RUN rm -f prisma.config.ts prisma.config.ts.bak

# Provide a dummy DATABASE_URL for the generation step
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Manually generate Prisma client
# Without prisma.config.ts, it will default to prisma/schema.prisma
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Hugging Face Spaces defaults to port 7860
ENV PORT=7860
EXPOSE 7860

# Start the server using the compiled code
CMD ["npm", "start"]
