# Use Node.js LTS version
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for dependency caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the application source code
COPY . .

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
