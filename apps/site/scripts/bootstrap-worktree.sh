#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$script_dir/worktree-common.sh"

repo_root="${1:-$(wilhalla_repo_root)}"
common_root="$(git -C "$repo_root" rev-parse --path-format=absolute --git-common-dir)"
common_root="$(dirname "$common_root")"

wilhalla_write_env_files "$repo_root" "$common_root"

printf 'Bootstrapped %s\n' "$repo_root/.env.worktree"
