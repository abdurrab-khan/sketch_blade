FROM node:22-alpine

WORKDIR /home/sketch-blade-web

ARG NODE_ENV=production
ARG VITE_API_URL
ARG VITE_CLERK_PUBLIC_KEY

ENV NODE_ENV=${NODE_ENV} \
  VITE_API_URL=${VITE_API_URL} \
  VITE_CLERK_PUBLIC_KEY=${VITE_CLERK_PUBLIC_KEY}

# Install pnpm
RUN npm install -g pnpm

# Install dependencies first (better layer cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build only for production
RUN if [ "$NODE_ENV" != "dev" ]; then pnpm run build; fi

EXPOSE 5173 4173

# dev -> vite dev server, prod -> preview built app
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"dev\" ]; then pnpm run dev --host 0.0.0.0 --port 5173; else pnpm run preview --host 0.0.0.0 --port 5173; fi"]