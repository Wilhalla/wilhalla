#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-jp@isabeldhalle.be}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/wilhalla}"
BUILD_TOOL="${BUILD_TOOL:-pnpm}"
RESTART_CMD="${RESTART_CMD:-}"

cd "$(dirname "$0")"

"${BUILD_TOOL}" run build
ssh "${REMOTE_HOST}" "mkdir -p '${REMOTE_PATH}/scripts'"
rsync -az --delete dist/ "${REMOTE_HOST}:${REMOTE_PATH}/dist/"
rsync -az scripts/start-server.mjs "${REMOTE_HOST}:${REMOTE_PATH}/scripts/start-server.mjs"

if [[ -n "${RESTART_CMD}" ]]; then
  ssh "${REMOTE_HOST}" "${RESTART_CMD}"
else
  echo "Deployed TanStack Start SSR bundle to ${REMOTE_HOST}:${REMOTE_PATH}"
  echo "Run 'node scripts/start-server.mjs' from ${REMOTE_PATH}, or set RESTART_CMD='systemctl restart <service>'."
fi
