# Use an official Node.js runtime as the base image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the necessary ports
EXPOSE 11180
EXPOSE 80

# Env variables
ENV RABBITMQ_HOSTNAME=rabbit
ENV RABBITMQ_PORT=5672
ENV RABBITMQ_USERNAME=student
ENV RABBITMQ_PASSWORD=student123
ENV MONGODB_CONNECTION_STRING=mongodb+srv://sua-user:30SD8YKo4tg7R7v5@cluster0.550s6o6.mongodb.net/?retryWrites=true&w=majority

# Start nginx
CMD ["nginx", "-g", "daemon off;"]