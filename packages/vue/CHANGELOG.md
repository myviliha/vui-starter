# Changelog

All notable changes to `@viliha/vui-vue` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

## 0.3.0 — 2026-08-10

### Added

- **The floating components**: `Dialog` with its header, title, body and footer,
  `Popover`, and `Tooltip`. Reka owns the focus trap, the scroll lock, the
  positioning and the aria wiring; the surfaces come from the shared class
  strings, so a Vue dialog and a React dialog are the same dialog.

- **They obey the stacking rules by construction.** Portalled, on the documented
  z-scale, `bg-popover` on every floating panel and the themed scrim on the
  backdrop. `z-layers.test.ts` now expands the shared class constants before
  checking, so extracting a string cannot quietly blind the guard. Verified by
  breaking a constant on purpose and watching the test fail.

## 0.2.0 — 2026-08-10

### Added

- **The stateful components that need a headless library**, on Reka UI:
  `Switch`, `Checkbox`, `Tabs` with its list, triggers and panels, `Accordion`,
  and `Collapsible`. They take `v-model` where a Vue developer expects one.

- **The accordion animation works here too.** `theme.css` animates
  `--vui-accordion-height`, and Radix and Reka each measure the panel into their
  own variable name. `AccordionContent` maps Reka's onto ours, exactly as the
  React component maps Radix's, which is what that indirection was added for.

- **The stacking rules are enforced in this package too.** `z-layers.test.ts` is
  the same guard as the React package's, reading `.vue` source instead of
  `.tsx`: one z-scale, `bg-popover` on every floating panel, the themed scrim on
  every backdrop, and portals so a menu is not clipped by a scrolling ancestor.
  It is in place *before* the floating components land, rather than bolted on
  after the first bug.

### Changed

- **More class strings moved into the shared source.** Switch, checkbox, tabs
  and accordion now read their classes from `@viliha/vui-core`, and the React
  components read the same ones. Nothing is copied between the two packages.

## 0.1.0 — 2026-08-10

### Added

- **VUI for Vue 3 and Nuxt, starting with the mechanical components.** `Button`,
  `Badge`, `Card` and its five parts, `Input`, `Textarea`, `Label`, `Separator`,
  `Skeleton`, `Kbd` and `Code`. Inputs use `v-model`, and every component merges
  a caller's `class` so `h-20` beats the variant's `h-9`.

- **The class strings are shared, not copied.** They moved into
  `@viliha/vui-core`, and the React components now import them from there too. A
  test renders the Vue button through Vue's SSR renderer and compares it against
  the same source the React component uses, so the two cannot drift into looking
  almost alike.

- **`Chart`, so Vue is not stuck without charts.** Recharts, which the React
  package uses, has no Vue build. `Chart` wraps TanStack Charts instead, whose
  definitions are framework-neutral: a definition written for the React app
  renders here unchanged, wearing the same palette. `@tanstack/charts` is an
  optional peer dependency.

- **One import for the styling**: `@viliha/vui-vue/theme.css` pulls in
  `@viliha/vui-theme` and adds the `@source` rule Tailwind needs to emit the
  utilities inside the compiled components.

Version 0.x on purpose. Dialogs, menus, selects, toasts, the command palette and
the datatable are not here yet, and the API may still move.
