# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build the project (Vite outputs to /dist)
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files from Stage 1 into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (the default Nginx port)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]