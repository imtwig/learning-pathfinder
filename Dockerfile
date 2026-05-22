FROM gdssingapore/airbase:node-22-builder AS builder
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
RUN mkdir -p public
RUN npm run build
RUN npm prune --omit=dev

FROM gdssingapore/airbase:node-22
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
