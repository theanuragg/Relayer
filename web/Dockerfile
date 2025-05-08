# Base image
FROM node:20.18.0

# Set working directory
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build Next.js
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "start"]
