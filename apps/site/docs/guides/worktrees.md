# Worktree Harness

Wilhalla now treats Git worktrees as first-class development instances.

## Layout

- The repo root is the shared Git checkout for active development.
- `instances/wilhalla:<name>/` contains managed Git worktrees.
- `runtime/<slug>/` is reserved for generated instance state such as logs and local artifacts.
- Each checkout gets a generated `.env.worktree` with deterministic frontend ports derived from the worktree slug.

The older `worktrees/` location is still reserved for compatibility, but new worktrees should be created under `instances/`.

## Basic Workflow

From the repo root:

```bash
just bootstrap
just dev
```

Create a feature worktree:

```bash
just worktree-add map-refresh
cd instances/wilhalla:map-refresh
just bootstrap
just dev
```

Useful commands:

- `just env` prints the generated worktree environment
- `just port-map` prints the derived port layout for the current checkout
- `just worktree-add <name>` creates a managed worktree under `instances/`
- `just worktree-list` shows all worktrees
- `just worktree-rm <name>` removes a managed worktree and its runtime state
- `just dev` starts the Vite dev server on the worktree-specific port
- `just preview` runs `vite preview` on the worktree-specific port
