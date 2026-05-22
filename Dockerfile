FROM --platform=linux/amd64 gdssingapore/airbase:node-22-builder@sha256:f13919c192ca58e8c9f131084969f44443fb94b42bab775b32eb9c64268bff6d AS builder
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
RUN mkdir -p public
RUN npm run build
RUN npm prune --omit=dev

FROM --platform=linux/amd64 gdssingapore/airbase:node-22@sha256:0ea50314140a32b077161db078ea014d86459fa6aa3b04dfddb5aa082d38b367
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/next.config.js ./next.config.js
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next ./.next

USER app
EXPOSE 3000
CMD ["npm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
