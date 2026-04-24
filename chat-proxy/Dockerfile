FROM node:22-alpine AS build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src/ ./src/
RUN pnpm exec tsc && cp src/admin-dashboard.html dist/ && pnpm prune --prod

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/
COPY prompts/ ./prompts/

# Non-sensitive config — baked into image
ARG AI_BASE_URL
ARG AI_MODEL
ARG GENERAL_MODEL
ARG RESOURCES_MODEL
ARG PRODUCT_MODEL
ARG CODE_MODEL
ARG SCHEMA_MODEL
ARG REWRITE_MODEL
ARG GROUNDING_MODEL
ARG LOG_S3_ENABLED
ARG AWS_REGION
ARG AWS_BUCKET

ENV AI_BASE_URL=${AI_BASE_URL} \
    AI_MODEL=${AI_MODEL} \
    GENERAL_MODEL=${GENERAL_MODEL} \
    RESOURCES_MODEL=${RESOURCES_MODEL} \
    PRODUCT_MODEL=${PRODUCT_MODEL} \
    CODE_MODEL=${CODE_MODEL} \
    SCHEMA_MODEL=${SCHEMA_MODEL} \
    REWRITE_MODEL=${REWRITE_MODEL} \
    GROUNDING_MODEL=${GROUNDING_MODEL} \
    LOG_S3_ENABLED=${LOG_S3_ENABLED} \
    AWS_REGION=${AWS_REGION} \
    AWS_BUCKET=${AWS_BUCKET}

# Sensitive secrets injected at runtime via k8s Secret (AVP):
# DATABASE_URL, AI_API_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, ADMIN_API_KEY

EXPOSE 8787
CMD ["node", "dist/server.js"]
