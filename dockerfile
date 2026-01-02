FROM node:22-alpine AS builder

WORKDIR /app

# Habilita o corepack antes de copiar os arquivos
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# Instala TODAS as dependências (incluindo devDependencies para o build)
RUN pnpm install --frozen-lockfile

COPY . .

# Build do TypeScript
RUN pnpm run build

# Stage de produção
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# Agora sim, instala apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Copia os arquivos buildados do stage anterior
COPY --from=builder /app/dist ./dist
# Se tiver outros arquivos necessários (ex: .env, public), copie aqui

EXPOSE 3000

CMD ["node", "dist/server.js"]