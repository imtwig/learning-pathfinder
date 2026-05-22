#!/bin/sh
set -eu

frontend_port="${PORT:-3000}"

cd /app/backend
PORT=3001 NODE_ENV=production node dist/index.js &
backend_pid="$!"

cleanup() {
  kill "$backend_pid" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

cd /app/frontend
npm start -- -H 0.0.0.0 -p "$frontend_port"
