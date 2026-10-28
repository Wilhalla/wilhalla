#!/usr/bin/env bash
# One-time import of the standalone Wilhalla repositories into this monorepo (2026-10-28).
#
# Each source is mirror-cloned into a scratch directory, rewritten there with git-filter-repo
# into its app directory, and fetched from there; the source checkouts are never modified.
#
#   main                          one merge commit per app, full history kept
#   refs/archive/<slug>/heads/*   every local branch of the source repository (rewritten)
#   refs/archive/<slug>/remotes/* every remote-tracking branch
#   tags <slug>/<tag>             every tag of the source repository
#   tag monorepo/import           main right after the import, before any restructuring
#
# Usage: tools/migration/import-repos.sh <scratch-dir>   (run from the root of a fresh `git init`)
set -euo pipefail

work="${1:?usage: $0 <scratch-dir>}"
src="$HOME/Projects/src/wilhalla_bak"
trailer=$'\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'

# slug | source checkout | destination | primary branch
apps=(
  "fruit|$src/seniorennet-fruit-archive|apps/fruit|develop"
  "site|$src/wilhalla-site|apps/site|develop"
)

mkdir -p "$work"
for entry in "${apps[@]}"; do
  IFS='|' read -r slug source dest primary <<<"$entry"
  mirror="$work/$slug.git"
  rm -rf "$mirror"
  git clone --quiet --mirror --no-local "$source" "$mirror"

  # filter-repo folds refs/remotes/* into refs/heads/*; park them elsewhere first.
  git -C "$mirror" for-each-ref --format='%(refname)' refs/remotes | while read -r ref; do
    if [[ "$ref" != */HEAD ]]; then
      git -C "$mirror" update-ref "refs/srcremotes/${ref#refs/remotes/}" "$ref"
    fi
    git -C "$mirror" update-ref -d "$ref"
  done

  (cd "$mirror" && uvx --quiet --from git-filter-repo git-filter-repo --force --quiet \
    --to-subdirectory-filter "$dest" --tag-rename ":$slug/")

  git fetch --quiet --no-tags --no-prune "$mirror" \
    "+refs/heads/*:refs/archive/$slug/heads/*" \
    "+refs/srcremotes/*:refs/archive/$slug/remotes/*" \
    "+refs/tags/*:refs/tags/*"

  git merge --quiet --allow-unrelated-histories --no-ff "refs/archive/$slug/heads/$primary" \
    -m "chore: import $slug into $dest" \
    -m "Full history imported from $(git -C "$source" remote get-url origin) ($primary).${trailer}"
done

git tag -a monorepo/import -m "State right after importing the standalone repositories"
