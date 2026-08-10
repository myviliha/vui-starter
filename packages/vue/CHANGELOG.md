# Changelog

All notable changes to `@viliha/vui-vue` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

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

- **One import for the styling**: `@viliha/vui-vue/theme.css` pulls in
  `@viliha/vui-theme` and adds the `@source` rule Tailwind needs to emit the
  utilities inside the compiled components.

Version 0.x on purpose. Dialogs, menus, selects, toasts, the command palette and
the datatable are not here yet, and the API may still move.
