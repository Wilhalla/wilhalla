#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || $# -gt 3 ]]; then
  echo "usage: $0 <name> [branch] [start-point]" >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$script_dir/worktree-common.sh"

name="$1"
requested_branch="${2:-}"
start_point="${3:-HEAD}"
common_root="$(wilhalla_common_root)"
slug="$(wilhalla_sanitize_slug "$name")"
branch="${requested_branch:-worktree/$slug}"
worktree_dir="$(wilhalla_managed_instance_dir "$common_root" "$slug")"

mkdir -p "$common_root/$WILHALLA_MANAGED_INSTANCE_ROOT" "$common_root/runtime"

if [[ -e "$worktree_dir" ]]; then
  echo "worktree already exists: $worktree_dir" >&2
  exit 1
fi

if git -C "$common_root" show-ref --verify --quiet "refs/heads/$branch"; then
  git -C "$common_root" worktree add "$worktree_dir" "$branch"
else
  git -C "$common_root" worktree add -b "$branch" "$worktree_dir" "$start_point"
fi

"$script_dir/bootstrap-worktree.sh" "$worktree_dir"

printf 'Created worktree %s on branch %s\n' "$worktree_dir" "$branch"
