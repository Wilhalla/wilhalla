#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$script_dir/worktree-common.sh"

repo_root="$(wilhalla_repo_root)"
common_root="$(wilhalla_common_root)"

wilhalla_emit_env "$repo_root" "$common_root"
