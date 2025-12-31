# Use Node.js LTS
FROM node:18-slim

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build
RUN npm run build

# Hugging Face Spaces defaults to port 7860
# We will set the environment variable to ensure the app uses it
ENV PORT=7860
EXPOSE 7860

# Start the server
CMD ["npm", "start"]