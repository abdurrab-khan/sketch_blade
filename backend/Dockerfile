FROM node:22-alpine

# Build arguments
ARG PORT
ARG MONGO_URI
ARG CLERK_PUBLIC_KEY
ARG CLERK_SIGNING_SECRET
ARG CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD

ENV PORT=${PORT} \
 MONGO_URI=${MONGO_URI} \
 CLERK_PUBLIC_KEY=${CLERK_PUBLIC_KEY} \ 
 CLERK_SIGNING_SECRET=${CLERK_SIGNING_SECRET} \
 CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY} \
 CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \
 REDIS_HOST=${REDIS_HOST} \
 REDIS_PORT=${REDIS_PORT} \
 REDIS_PASSWORD=${REDIS_PASSWORD}


 # Installing pnpm globally
RUN npm install -g pnpm 

# Set working directory
WORKDIR /home/sketch-blade-api

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Installing all dep
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Exposing the port
EXPOSE 8080

# Run the development server
CMD [ "pnpm", "run", "start" ]