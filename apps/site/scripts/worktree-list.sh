#!/usr/bin/env bash
set -euo pipefail

git worktree list --porcelain | python3 -c "$(cat <<'PY'
import sys

entries = []
current = {}
for raw_line in sys.stdin:
    line = raw_line.strip()
    if not line:
        if current:
            entries.append(current)
            current = {}
        continue
    key, _, value = line.partition(' ')
    current[key] = value
if current:
    entries.append(current)

for entry in entries:
    path = entry.get('worktree', '')
    branch = entry.get('branch', '').removeprefix('refs/heads/')
    head = entry.get('HEAD', '')[:12]
    print(f"{branch or '(detached)'}\t{head}\t{path}")
PY
)"
