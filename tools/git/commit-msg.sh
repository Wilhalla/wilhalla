#!/bin/sh
# Conventional Commits subject check (commit-msg hook, installed through prek).
# Sveltia CMS commits through GitHub and skips this hook: keep its templates in
# apps/site/public/admin/config.yml conventional as well.

subject=$(sed -n '1p' "$1")

if printf '%s\n' "$subject" | LC_ALL=C grep -Eq '^[[:alpha:]][[:alnum:]-]*(\([[:alnum:]][[:alnum:]/._-]*\))?!?: [^[:space:]].*$'; then
  exit 0
fi
# git's own merge and revert subjects
if printf '%s\n' "$subject" | grep -Eq '^(Merge|Revert) '; then
  exit 0
fi

printf '%s\n' 'Commit subject must follow Conventional Commits: type(scope)!: summary' >&2
printf '%s\n' 'Use the app as scope, e.g. feat(site): add image captions' >&2
exit 1
