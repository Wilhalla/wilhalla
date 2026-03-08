#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-jp@isabeldhalle.be}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/wilhalla}"
BUILD_TOOL="${BUILD_TOOL:-npm}"

cd "$(dirname "$0")"

"${BUILD_TOOL}" run build
ssh "${REMOTE_HOST}" "mkdir -p '${REMOTE_PATH}'"
rsync -az --delete dist/ "${REMOTE_HOST}:${REMOTE_PATH}/"
