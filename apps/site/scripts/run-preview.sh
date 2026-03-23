#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$script_dir/worktree-common.sh"

repo_root="$(wilhalla_repo_root)"
env_file="$repo_root/.env.worktree"

if [[ ! -f "$env_file" ]]; then
  "$script_dir/bootstrap-worktree.sh" "$repo_root" >/dev/null
fi

wilhalla_load_env_file "$env_file"

exec bun run preview -- --host 0.0.0.0 --port "$VITE_PREVIEW_PORT"
