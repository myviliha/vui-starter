# Changelog

All notable changes to `@viliha/vui-ui` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/): **patch** for fixes, **minor** for
backward-compatible features, **major** for breaking changes.

To upgrade, see [Upgrading](./AGENT.md#upgrading) in the agent guide.

## 1.5.3 — 2026-07-24

### Added

- The changelog and the **[Upgrading](./AGENT.md#upgrading)** guide now ship in
  the npm package. (They were authored for 1.5.2 but missed that tarball, which
  was published a moment before.)
- `NEXT_PUBLIC_APP_NAME` env var (in the scaffold) renames the app — the sidebar,
  wordmark, auth screens, and page titles now read from one place (`SITE.name`)
  instead of a hard-coded "Vui Starter".

### Fixed

- `ChartContainer` no longer triggers Recharts' "width(0) and height(0) … should
  be greater than 0" warning when it renders inside a hidden container (e.g. a
  kept-alive inactive tab). It waits for a measured size before mounting the
  `ResponsiveContainer`.

## 1.5.2 — 2026-07-24

### Changed

- **Turborepo guidance throughout.** `init`'s monorepo note now walks you through
  `cd`-ing into the target app (e.g. `apps/web`), installing deps in that app (or
  via a workspace filter), checking workspace globs, and running with a filter —
  and states clearly that turbo mode does not auto-install.
- **Fuller `AGENT.md`.** Added an "Inside a Turborepo / monorepo" section and
  end-to-end walkthroughs for new-standalone, new-in-monorepo, and existing apps.

## 1.5.1 — 2026-07-24

### Changed

- Rewrote the README and `AGENT.md` prose to a clearer, more natural voice. No
  API changes.

## 1.5.0 — 2026-07-24

### Added

- **`init` installs dependencies for you**, using the package manager it detects
  from your lockfile (npm, pnpm, yarn, or bun). It prompts first; `--yes` skips
  the prompt and `--no-install` opts out. This ends the "Module not found"
  cascade from running `dev` before installing peers.

## 1.4.3 — 2026-07-24

### Fixed

- The scaffolded `globals.css` no longer imports `tw-animate-css`, so the theme
  is self-contained and needs no extra CSS dependency (VUI's own animations live
  in `theme.css`).

## 1.4.1 — 2026-07-24

### Added

- **Turborepo support in `init`** (`--turbo` + `--dir`) — scaffolds into a target
  app directory.
- A `tsconfig.json` in the scaffold (`@/*` → `./*`) so the shell's imports
  resolve, and a TypeScript `next.config.ts` (so a fresh scaffold overwrites
  create-next-app's config instead of leaving two).

### Fixed

- Scaffolding into a fresh Next.js app now works end to end.
- Pinned a patched `postcss` (`^8.5.12`) via pnpm overrides to clear a
  high-severity advisory (GHSA-6g55-p6wh-862q).

> 1.4.1 shipped `next.config.mjs` and 1.4.2 was an interim republish; use **1.4.3
> or later**, which ship `next.config.ts` and the self-contained theme.

## 1.4.0 — 2026-07-24

### Added

- **`init` decision tree**: fresh vs. existing project, and pre-built (shell +
  demo) vs. theme-only (`--fresh`/`--existing`, `--prebuilt`/`--theme-only`).

## 1.3.0 — 2026-07-24

### Added

- **`RecordFormPanel`** — the standard Add/Edit/View slide-over as a standalone
  export, for use outside a table (e.g. a Kanban board).
- `RecordField` gains an `input` type (`number`/`date`) and renders a `Select`
  for `options` fields in the Add/Edit form.

## 1.2.0 — 2026-07-23

### Added

- **`npx @viliha/vui-ui init`** — a scaffolder that copies the app shell (layout,
  sidebar, open tabs, command palette, nav config, logo) and demo pages into your
  repo. Ships a `bin` and a bundled `template/` regenerated from the reference app
  on publish.
- Navigation & open-tabs documentation.

## 1.1.8 — 2026-07-23

### Fixed

- The slide-over record form auto-sizes its width to the content, so long field
  labels no longer wrap or overflow.

## 1.1.7 — 2026-07-23

Baseline release.
