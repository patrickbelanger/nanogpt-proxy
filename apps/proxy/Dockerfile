FROM node:20 as builder

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/proxy
RUN pnpm build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/apps/proxy/dist ./dist
COPY --from=builder /app/apps/proxy/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod

CMD ["node", "dist/main.js"]
