FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY scripts/ scripts/
COPY src/ src/
# `npm run build` runs prebuild (fetches OpenAPI spec from
# api.adbutler.com), then tsc + copies the spec into dist/.
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist/ dist/
EXPOSE 3000
CMD ["node", "dist/sse.js"]
