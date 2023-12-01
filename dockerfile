# Use Node.js 14
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment variable
ENV API_KEY=fe7e99bf5dmsh5347bbf8af53707p1faf17jsn16ae5377dcb6

# Expose the port
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
