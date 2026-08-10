# Changelog

All notable changes to `@viliha/vui-theme` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

## 1.2.0 — 2026-08-10

### Added

- **Motion is tokens now.** `--vui-duration-fast`, `--vui-duration-base`,
  `--vui-duration-slow`, `--vui-ease` and `--vui-ease-panel` drive every shipped
  animation, so the feel can be retuned without forking a keyframe and motion can
  be switched off in one line: `:root { --vui-duration-base: 0ms }`. That is a
  product choice and separate from accessibility; `prefers-reduced-motion` is
  still honoured whatever these say.

- **The icon chip is opt-out.** `--vui-icon-chip-border` and
  `--vui-icon-chip-padding` remove the border and padding app-wide, and
  `.vui-icon-plain` does it for one icon. Useful when you bring an icon set that
  already has its own weight.

## 1.1.0 — 2026-08-10

### Added

- **`.vui-chart`, so charts inherit the theme in any framework.** TanStack Charts
  paints with `currentColor` and reads six `--ts-chart-*` variables. This class
  maps the theme's own chart tokens onto them, which is all it takes for a chart
  to follow light mode, dark mode and a per-tenant brand. Pure CSS, so it works
  the same in Vue, Svelte, Solid, Angular or a hand-written page.

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
