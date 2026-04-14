FROM node:22-alpine AS build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src/ ./src/
RUN pnpm exec tsc && pnpm prune --prod

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/
COPY prompts/ ./prompts/

# Runtime env — all secrets and config come from K8s (secretRef + env)
ENV SQLITE_PATH="/data/chat-proxy.db"

EXPOSE 8787
CMD ["node", "dist/server.js"]
