FROM --platform=linux/amd64 gdssingapore/airbase:node-22-builder@sha256:f13919c192ca58e8c9f131084969f44443fb94b42bab775b32eb9c64268bff6d AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_TELEMETRY_DISABLED=1
RUN mkdir -p public
RUN npm run build
RUN npm prune --omit=dev

FROM --platform=linux/amd64 gdssingapore/airbase:node-22-builder@sha256:f13919c192ca58e8c9f131084969f44443fb94b42bab775b32eb9c64268bff6d AS backend-builder
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci

COPY backend/ ./
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

FROM --platform=linux/amd64 gdssingapore/airbase:node-22@sha256:0ea50314140a32b077161db078ea014d86459fa6aa3b04dfddb5aa082d38b367
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=/api/v1
ENV PORT=3000

COPY --from=frontend-builder --chown=app:app /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-builder --chown=app:app /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-builder --chown=app:app /app/frontend/next.config.js ./frontend/next.config.js
COPY --from=frontend-builder --chown=app:app /app/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=app:app /app/frontend/.next ./frontend/.next

COPY --from=backend-builder --chown=app:app /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=app:app /app/backend/package.json ./backend/package.json
COPY --from=backend-builder --chown=app:app /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=app:app /app/backend/prisma ./backend/prisma

COPY --chown=app:app scripts/start-airbase.sh ./start-airbase.sh

USER app
EXPOSE 3000
CMD ["sh", "/app/start-airbase.sh"]
