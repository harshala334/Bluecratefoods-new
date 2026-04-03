# Stage 1: Build Expo Web (PWA)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (only what's needed for build)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npx expo export --platform web

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
