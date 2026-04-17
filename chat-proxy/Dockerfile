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

# Build-time environment variables — baked into the image
ARG AI_API_KEY
ARG AI_BASE_URL
ARG AI_MODEL
ARG GENERAL_MODEL
ARG RESOURCES_MODEL
ARG PRODUCT_MODEL
ARG LOG_S3_ENABLED
ARG ADMIN_API_KEY
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_BUCKET

ENV AI_API_KEY=${AI_API_KEY} \
    AI_BASE_URL=${AI_BASE_URL} \
    AI_MODEL=${AI_MODEL} \
    GENERAL_MODEL=${GENERAL_MODEL} \
    RESOURCES_MODEL=${RESOURCES_MODEL} \
    PRODUCT_MODEL=${PRODUCT_MODEL} \
    LOG_S3_ENABLED=${LOG_S3_ENABLED} \
    ADMIN_API_KEY=${ADMIN_API_KEY} \
    AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    AWS_REGION=${AWS_REGION} \
    AWS_BUCKET=${AWS_BUCKET} \
    SQLITE_PATH="/data/chat-proxy.db"

EXPOSE 8787
CMD ["node", "dist/server.js"]
