# Dockerfile for the server application
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the server runs on
EXPOSE 5000

# Command to run the server
CMD ["node", "server.js"]
