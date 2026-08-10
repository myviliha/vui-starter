# Changelog

All notable changes to `@viliha/vui-theme` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

## 1.0.0 — 2026-08-10

### Added

- **The VUI theme as a package of its own.** 129 design tokens, class-based dark
  mode, the z-scale, motion utilities and `.vui-scroll`, with no JavaScript and no
  dependencies. Two entry points: `@viliha/vui-theme/theme.css` for anyone running
  Tailwind v4, and `@viliha/vui-theme/vui.css` compiled for people with no build
  step at all.

  Both are generated from `packages/ui/src/theme.css` at publish time, so the
  React package and the standalone stylesheet cannot drift apart. The compiled
  build scans VUI's own components, which is what lets markup copied out of the
  docs render without installing anything.

- **Two opt-ins so the CSS is not React-only.** `.vui-icon` gets the bordered icon
  chip that Radix icons get for free, and `--vui-accordion-height` drives the
  accordion animation from whatever a headless library measures.
