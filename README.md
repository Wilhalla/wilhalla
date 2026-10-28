# Wilhalla

Digital tooling for [Wilhalla](https://www.wilhalla.be): the public website (`apps/site`) and
the Seniorennet fruit blog archive (`apps/fruit`).

```sh
just setup        # install dependencies (pnpm workspace) and git hooks
just dev site     # or: just dev fruit
just check        # what CI runs, for every app
```

See `AGENTS.md` for the conventions and `docs/monorepo.md` for how the repository works.
