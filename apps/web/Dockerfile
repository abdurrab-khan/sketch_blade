FROM node:22-alpine

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL

ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY} \
    VITE_API_URL=${VITE_API_URL}

# Installing pnpm
RUN npm install -g pnpm

# Setting the working directory
WORKDIR /home/sketch-blade-web

# Copying the package.json and pnpm-lock.yaml into current directory
COPY package.json pnpm-lock.yaml ./

# Installing all dep
RUN pnpm install --frozen-lockfile

# Copying the rest of the application
COPY . .

# Build the application
# RUN pnpm run build

EXPOSE 5173

# Running application
CMD [ "pnpm", "run", "dev" ]