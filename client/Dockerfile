# Dockerfile for the client application
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the client application (if applicable)
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
