# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your JavaScript source code into the container
COPY . .

# Specify the command to run your JavaScript application
CMD ["node","calculate.js"]

