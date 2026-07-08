# Contributing to VUI Starter

Thanks for your interest! This project is open source (MIT) and welcomes issues
and pull requests from everyone.

## Ways to contribute

- **Report a bug** — open a [Bug report](https://github.com/myviliha/vui-starter/issues/new/choose).
- **Request a feature** — open a Feature request issue.
- **Fix / improve** — send a Pull Request (see below). Merged PRs make you a contributor. 🎉
- **Ask / discuss** — use [Discussions](https://github.com/myviliha/vui-starter/discussions).

## Development setup

Requirements: **Node.js ≥ 20** and **pnpm 9** (`corepack enable`).

```bash
# 1. Fork on GitHub, then clone YOUR fork
git clone https://github.com/<your-username>/vui-starter.git
cd vui-starter

# 2. Keep your fork in sync
git remote add upstream https://github.com/myviliha/vui-starter.git

# 3. Install + run the checks (Turborepo runs them across the workspace)
pnpm install
pnpm lint          # eslint, zero warnings
pnpm check-types   # tsc --noEmit
pnpm build         # must pass

# 4. Run the apps
pnpm dev
```

## Pull Request workflow

External contributors work from a **fork** — no write access needed.

1. Sync your fork: `git fetch upstream && git rebase upstream/main`.
2. Branch off `main`: `feat/<name>`, `fix/<name>`, `docs/<name>`, `chore/<name>`.
3. Make the change and keep `pnpm lint`, `pnpm check-types`, `pnpm build` green.
4. Use [Conventional Commits](https://www.conventionalcommits.org/): `feat: …`, `fix: …`, `docs: …`.
5. Push to your fork and open a PR against `myviliha/vui-starter:main`.
6. Fill in the PR template. CI (lint · types · build on Node 20/22) runs automatically and must pass.
7. A maintainer reviews; address feedback by pushing more commits to the same branch.

> `main` is protected: changes land only via reviewed PRs with green CI. No direct pushes.

## Coding standards

- TypeScript, strict; ESLint runs with `--max-warnings 0` — keep it clean.
- Shared UI lives in `packages/ui`; app-specific code stays in its app.
- Run `pnpm format` (Prettier) before committing.
- Keep changes focused; one logical change per PR.

## Reporting security issues

Please do **not** open a public issue for vulnerabilities. See [SECURITY.md](./SECURITY.md).

## Code of Conduct

By participating you agree to our [Code of Conduct](./CODE_OF_CONDUCT.md).
