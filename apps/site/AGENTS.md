# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

<!-- BEGIN ROAM INTEGRATION -->

## Codebase navigation

This project uses `roam` for codebase comprehension. Always prefer roam over Glob/Grep/Read exploration.

Before modifying any code:

1. First time in the repo: `roam understand` then `roam tour`
2. Find a symbol: `roam search <pattern>`
3. Before changing a symbol: `roam preflight <name>` (blast radius + tests + fitness)
4. Need files to read: `roam context <name>` (files + line ranges, prioritized)
5. Debugging a failure: `roam diagnose <name>` (root cause ranking)
6. After making changes: `roam diff` (blast radius of uncommitted changes)

Additional: `roam health` (0-100 score), `roam impact <name>` (what breaks),
`roam pr-risk` (PR risk), `roam file <path>` (file skeleton).

Run `roam --help` for all commands. Use `roam --json <cmd>` for structured output.

<!-- END BEADS INTEGRATION -->

<!-- BEGIN BEADS INTEGRATION -->

## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Auto-syncs to JSONL for version control
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
bd create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update bd-42 --status in_progress --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`

### Auto-Sync

bd automatically syncs with git:

- Exports to `.beads/issues.jsonl` after changes (5s debounce)
- Imports from JSONL when newer (e.g., after `git pull`)
- No manual export/import needed!

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

For more details, see README.md and docs/QUICKSTART.md.

<!-- END BEADS INTEGRATION -->

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails; resolve and retry until it succeeds

## Git Worktrees

This project uses git worktrees for parallel development.

### Worktree Setup

| Worktree | Branch | Purpose |
|----------|--------|---------|
| `wilhalla/` | develop | Active development |
| `wilhalla-main/` | main | Production-ready code |

### Creating Worktrees

**For large features, always create a dedicated worktree:**

```bash
# Create new feature worktree (from wilhalla/ directory)
git worktree add ../wilhalla-<feature-name> -b feature/<feature-name>

# Example: blog rewrite
git worktree add ../wilhalla-blog -b feature/blog-rewrite
```

**List all worktrees:**

```bash
git worktree list
```

**Remove a worktree when done:**

```bash
git worktree remove ../wilhalla-<feature-name>
git branch -d feature/<feature-name>
```

### Best Practices

- Use worktrees for any feature taking more than 1 session
- Keep `develop` clean - only merge tested, complete work
- Sync worktrees with `git pull` before starting work
- Prune stale worktrees: `git worktree prune`

# Project Architecture

## Project Overview

- **Files:** 52
- **Symbols:** 42
- **Edges:** 12
- **Languages:** json (11), tsx (8), markdown (6), typescript (3), yaml (2), html (2), css (2)

## Directory Structure

| Directory         | Files | Primary Language |
| ----------------- | ----- | ---------------- |
| `src/`            | 12    | tsx              |
| `beads_wilhalla/` | 12    | json             |
| `./`              | 11    | json             |
| `.beads/`         | 10    | yaml             |
| `docs/`           | 3     | markdown         |
| `public/`         | 2     | json             |
| `.vscode/`        | 1     | json             |
| `.dolt/`          | 1     |                  |

## Entry Points

No conventional entry points detected.

## Key Abstractions

Top symbols by importance (PageRank):

| Symbol | Kind | Location |
| ------ | ---- | -------- |

| `Button function Button({
  className,
  variant = "def...` | function | `src/components/ui/button.tsx:41` |
| `cn function cn(...inputs: ClassValue[])` | function | `src/lib/utils.ts:4` |
| `Footer function Footer()` | function | `src/components/footer.tsx:1` |
| `MobileMenu function MobileMenu({ open, onClose, links }: M...` | function | `src/components/mobile-menu.tsx:9` |
| `Navbar function Navbar()` | function | `src/components/navbar.tsx:14` |
| `getRouter function getRouter()` | function | `src/router.tsx:4` |
| `RootComponent function RootComponent()` | function | `src/routes/__root.tsx:11` |
| `App function App()` | function | `src/routes/index.tsx:5` |
| `Register interface Register` | interface | `src/main.tsx:12` |
| `FileRoutesByFullPath interface FileRoutesByFullPath` | interface | `src/routeTree.gen.ts:20` |
| `FileRoutesByTo interface FileRoutesByTo` | interface | `src/routeTree.gen.ts:23` |
| `FileRoutesById interface FileRoutesById` | interface | `src/routeTree.gen.ts:26` |
| `FileRouteTypes interface FileRouteTypes` | interface | `src/routeTree.gen.ts:30` |
| `RootRouteChildren interface RootRouteChildren` | interface | `src/routeTree.gen.ts:38` |
| `FileRoutesByPath interface FileRoutesByPath` | interface | `src/routeTree.gen.ts:43` |

## Architecture

- **Dependency layers:** 3
- **Cycles (SCCs):** 0
- **Layer distribution:** L0: 34 symbols, L1: 7 symbols, L2: 1 symbols

## Testing

- **Test files:** 0
- **Source files:** 52
- **Test-to-source ratio:** 0.00

## Coding Conventions

Follow these conventions when writing code in this project:

- **Imports:** Prefer absolute imports (100% are cross-directory)

## Complexity Hotspots

Average function complexity: 0.4 (22 functions analyzed)

## Domain Keywords

- **Top domain terms:** routes, file, register, route, root, children, mobile, navbar, router, types, app, full

## Core Modules

Most-imported modules (everything depends on these):

| Module                           | Imported By | Symbols Used |
| -------------------------------- | ----------- | ------------ |
| `src/routeTree.gen.ts`           | 2 files     | 4            |
| `src/components/footer.tsx`      | 1 files     | 1            |
| `src/components/mobile-menu.tsx` | 1 files     | 1            |
| `src/components/navbar.tsx`      | 1 files     | 1            |
| `src/lib/utils.ts`               | 1 files     | 2            |
| `src/routes/index.tsx`           | 1 files     | 1            |

Project: wilhalla (52 files, 42 symbols, json, tsx, markdown, typescript, yaml)
Stack: src
Conventions: functions=PascalCase
Structure: src/ (12), beads_wilhalla/ (12), ./ (11), .beads/ (10), docs/ (3), public/ (2), .vscode/ (1), .dolt/ (1)
Key abstractions:

- Button (function, src/components/ui/button.tsx)
- cn (function, src/lib/utils.ts)
- Footer (function, src/components/footer.tsx)
- MobileMenu (function, src/components/mobile-menu.tsx)
- Navbar (function, src/components/navbar.tsx)
  Health: 100/100, 0 cycles
