#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "usage: $0 <name-or-path> [force]" >&2
  exit 1
fi

target="$1"
force="${2:-false}"

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$script_dir/worktree-common.sh"

common_root="$(wilhalla_common_root)"

if [[ -d "$target" ]]; then
  worktree_dir="$(cd "$target" && pwd)"
else
  worktree_dir="$(wilhalla_managed_instance_dir "$common_root" "$target")"
  if [[ ! -d "$worktree_dir" ]]; then
    worktree_dir="$common_root/$WILHALLA_LEGACY_WORKTREE_ROOT/$(wilhalla_sanitize_slug "$target")"
  fi
fi

if [[ ! -d "$worktree_dir" ]]; then
  echo "worktree not found: $worktree_dir" >&2
  exit 1
fi

basename_slug="$(basename "$worktree_dir")"
slug="${basename_slug#"$WILHALLA_INSTANCE_PREFIX"}"
slug="$(wilhalla_sanitize_slug "$slug")"
if [[ "$slug" == "$WILHALLA_ROOT_INSTANCE_SLUG" ]]; then
  echo "refusing to remove root checkout" >&2
  exit 1
fi

args=(worktree remove)
if [[ "$force" == "true" ]]; then
  args+=(--force)
fi
args+=("$worktree_dir")

git -C "$common_root" "${args[@]}"
rm -rf "$common_root/runtime/$slug"
git -C "$common_root" worktree prune

printf 'Removed worktree %s and runtime/%s\n' "$worktree_dir" "$slug"
