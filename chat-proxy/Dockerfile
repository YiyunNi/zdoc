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

# === FOR TESTING ONLY — do not use in production ===
# Override with --build-arg or docker run -e
ARG AI_API_KEY=
ENV AI_API_KEY=${AI_API_KEY}
ARG AI_BASE_URL=https://api.openai.com/v1
ENV AI_BASE_URL=${AI_BASE_URL}
ARG AI_MODEL=gpt-4o
ENV AI_MODEL=${AI_MODEL}
ARG ZILLIZ_ENDPOINT=
ENV ZILLIZ_ENDPOINT=${ZILLIZ_ENDPOINT}
ARG ZILLIZ_TOKEN=
ENV ZILLIZ_TOKEN=${ZILLIZ_TOKEN}
ARG GENERAL_MODEL=
ENV GENERAL_MODEL=${GENERAL_MODEL}
ARG RESOURCES_MODEL=
ENV RESOURCES_MODEL=${RESOURCES_MODEL}
ARG PRODUCT_MODEL=
ENV PRODUCT_MODEL=${PRODUCT_MODEL}
ARG ADMIN_API_KEY=
ENV ADMIN_API_KEY=${ADMIN_API_KEY}
ARG LOG_S3_ENABLED=
ENV LOG_S3_ENABLED=${LOG_S3_ENABLED}
ARG AWS_REGION=
ENV AWS_REGION=${AWS_REGION}
ARG AWS_ACCESS_KEY_ID=
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ARG AWS_SECRET_ACCESS_KEY=
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ARG AWS_BUCKET=
ENV AWS_BUCKET=${AWS_BUCKET}
# === END TESTING ===

EXPOSE 8787
CMD ["node", "dist/server.js"]
