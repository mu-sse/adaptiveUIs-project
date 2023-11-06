# Use an official Node.js image as the base image
FROM node:16.13.2


# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the image
COPY . .

# Expose port 3000 for the app to listen on
EXPOSE 3001

# Start the app
CMD [ "npm", "start" ]
