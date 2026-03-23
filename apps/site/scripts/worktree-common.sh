#!/usr/bin/env bash
set -euo pipefail

readonly WILHALLA_ROOT_INSTANCE_SLUG="root"
readonly WILHALLA_MANAGED_INSTANCE_ROOT="instances"
readonly WILHALLA_LEGACY_WORKTREE_ROOT="worktrees"
readonly WILHALLA_INSTANCE_PREFIX="wilhalla:"
readonly WILHALLA_UI_PORT_BASE=3000
readonly WILHALLA_PREVIEW_PORT_BASE=4173
readonly WILHALLA_PORT_OFFSET_SPAN=200

wilhalla_repo_root() {
  git rev-parse --show-toplevel
}

wilhalla_common_root() {
  local common_dir
  common_dir="$(git rev-parse --path-format=absolute --git-common-dir)"
  dirname "$common_dir"
}

wilhalla_detect_instance_slug() {
  local repo_root="$1"

  case "$repo_root" in
    *"/$WILHALLA_MANAGED_INSTANCE_ROOT/"*)
      local remainder="${repo_root#*"/$WILHALLA_MANAGED_INSTANCE_ROOT/"}"
      local instance_dir="${remainder%%/*}"
      printf '%s\n' "${instance_dir#"$WILHALLA_INSTANCE_PREFIX"}"
      return
      ;;
    *"/$WILHALLA_LEGACY_WORKTREE_ROOT/"*)
      local remainder="${repo_root#*"/$WILHALLA_LEGACY_WORKTREE_ROOT/"}"
      printf '%s\n' "${remainder%%/*}"
      return
      ;;
  esac

  printf '%s\n' "$WILHALLA_ROOT_INSTANCE_SLUG"
}

wilhalla_sanitize_slug() {
  local raw="$1"
  local sanitized
  sanitized="$(printf '%s' "$raw" | tr '[:upper:]/ _' '[:lower:]---' | tr -cd 'a-z0-9-\n')"
  sanitized="$(printf '%s' "$sanitized" | sed -E 's/-+/-/g; s/^-+//; s/-+$//')"
  if [[ -z "$sanitized" ]]; then
    sanitized="$WILHALLA_ROOT_INSTANCE_SLUG"
  fi
  printf '%s\n' "$sanitized"
}

wilhalla_port_offset() {
  local slug="$1"
  if [[ "$slug" == "$WILHALLA_ROOT_INSTANCE_SLUG" ]]; then
    printf '0\n'
    return
  fi

  local checksum
  checksum="$(printf '%s' "$slug" | cksum | awk '{print $1}')"
  printf '%s\n' "$(( (checksum % WILHALLA_PORT_OFFSET_SPAN) + 1 ))"
}

wilhalla_instance_dir_name() {
  local slug="$1"
  printf '%s%s\n' "$WILHALLA_INSTANCE_PREFIX" "$(wilhalla_sanitize_slug "$slug")"
}

wilhalla_managed_instance_dir() {
  local common_root="$1"
  local slug="$2"
  printf '%s/%s/%s\n' "$common_root" "$WILHALLA_MANAGED_INSTANCE_ROOT" "$(wilhalla_instance_dir_name "$slug")"
}

wilhalla_emit_env() {
  local repo_root="$1"
  local common_root="$2"
  local slug sanitized offset runtime_dir

  slug="$(wilhalla_detect_instance_slug "$repo_root")"
  sanitized="$(wilhalla_sanitize_slug "$slug")"
  offset="$(wilhalla_port_offset "$slug")"
  runtime_dir="$common_root/runtime/$sanitized"

  cat <<EOF
WILHALLA_INSTANCE_SLUG=$slug
WILHALLA_PROJECT_ROOT=$repo_root
WILHALLA_COMMON_ROOT=$common_root
WILHALLA_RUNTIME_DIR=$runtime_dir
WILHALLA_DEV_PORT=$((WILHALLA_UI_PORT_BASE + offset))
WILHALLA_PREVIEW_PORT=$((WILHALLA_PREVIEW_PORT_BASE + offset))
VITE_DEV_SERVER_PORT=$((WILHALLA_UI_PORT_BASE + offset))
VITE_PREVIEW_PORT=$((WILHALLA_PREVIEW_PORT_BASE + offset))
EOF
}

wilhalla_write_env_files() {
  local repo_root="$1"
  local common_root="$2"
  local env_file="$repo_root/.env.worktree"
  local slug sanitized runtime_dir

  slug="$(wilhalla_detect_instance_slug "$repo_root")"
  sanitized="$(wilhalla_sanitize_slug "$slug")"
  runtime_dir="$common_root/runtime/$sanitized"

  mkdir -p \
    "$runtime_dir/logs" \
    "$runtime_dir/artifacts"

  wilhalla_emit_env "$repo_root" "$common_root" > "$env_file"
}

wilhalla_load_env_file() {
  local env_file="$1"
  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
}
