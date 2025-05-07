# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "run", "start"]
