FROM node:22-alpine


#Installing pnpm globally
RUN npm install -g pnpm 

# Set working directory
WORKDIR /home/excalidraw-api 

# Copy package files
COPY package.json pnpm-lock.yaml

# Installing all dep
RUN pnpm install --include=dev

# Installing typescript
RUN npm install -g typescript

# Copy the rest of the application
COPY . .

# Exposing the port
EXPOSE 8080

# Run the development server
CMD [ "pnpm", "run", "start" ]