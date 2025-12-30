FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --prod --frozen-lockfile


COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start"]