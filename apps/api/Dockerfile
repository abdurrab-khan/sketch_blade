FROM node:22-alpine AS build

RUN npm install -g pnpm

WORKDIR /api

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 8080

ENTRYPOINT [ "node", "./dist/index.js" ]