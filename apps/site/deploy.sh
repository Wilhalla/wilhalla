#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-jp@isabeldhalle.be}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/wilhalla}"
BUILD_TOOL="${BUILD_TOOL:-pnpm}"
RESTART_CMD="${RESTART_CMD:-}"

cd "$(dirname "$0")"

"${BUILD_TOOL}" run build
ssh "${REMOTE_HOST}" "mkdir -p '${REMOTE_PATH}/.output'"
rsync -az --delete .output/ "${REMOTE_HOST}:${REMOTE_PATH}/.output/"

if [[ -n "${RESTART_CMD}" ]]; then
  ssh "${REMOTE_HOST}" "${RESTART_CMD}"
else
  echo "Deployed TanStack Start SSR bundle to ${REMOTE_HOST}:${REMOTE_PATH}"
  echo "Run 'node .output/server/index.mjs' from ${REMOTE_PATH}, or set RESTART_CMD='systemctl restart <service>'."
fi
