#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$script_dir/worktree-common.sh"

repo_root="$(wilhalla_repo_root)"
common_root="$(wilhalla_common_root)"

eval "$(wilhalla_emit_env "$repo_root" "$common_root" | sed 's/^/export /')"

cat <<EOF
instance_slug=${WILHALLA_INSTANCE_SLUG}
dev_port=${WILHALLA_DEV_PORT}
preview_port=${WILHALLA_PREVIEW_PORT}
runtime_dir=${WILHALLA_RUNTIME_DIR}
EOF
