# Changelog

All notable changes to `@viliha/vui-ui` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/): **patch** for fixes, **minor** for
backward-compatible features, **major** for breaking changes.

To upgrade, see [Upgrading](./AGENT.md#upgrading) in the agent guide.

## 1.13.0 — 2026-07-26

### Added

- **Server-side ("manual") mode for `RecordView`.** Set `manual` and RecordView
  stops filtering/sorting/paginating `data` — it renders it as the current page
  verbatim and reports the query via `onQueryChange({ page, pageSize, sort,
  search, filters })` so your backend does the work. Pair with `rowCount` (drives
  the footer + page count) and `loading`. Fires once on mount for the initial
  load; per-field filters fire it on the Filter panel's Search/Clear. New exported
  types: `SortState`, `ServerQuery<T>`. Default off — everything stays client-side.
- **Data Table demo page** in the scaffold (shadcn/ui section) — a full
  server-side table against a simulated backend (pagination, sort, keyword +
  per-field filter, loading shimmer, out-of-order-response guard).

### Changed

- The loading skeleton now **shimmers left → right** (a `vui-shimmer` sweep in
  `theme.css`) instead of a pulse — a clearer "records are loading" cue.

  **For agents:** for a server-backed table use `manual` + `rowCount` +
  `onQueryChange` (fetch → set `data`/`rowCount`/`loading`); guard stale
  responses with a request-id ref. Don't reimplement pagination/sort. Demo:
  the Data Table page. Docs: `/docs/data-table` (Server-side data).

## 1.12.0 — 2026-07-26

### Added

- **`RecordView` `loading` prop** — while `true`, the table body renders animated
  skeleton rows (matched to the columns) instead of an empty-state flash, for
  slow server loads (initial fetch or refetch). The toolbar stays usable; clear
  `loading` when the data arrives.

  **For agents:** wrap your fetch with `loading` (`setLoading(true)` → fetch →
  `finally(() => setLoading(false))`); don't hand-roll a spinner overlay. Demo:
  `markets` simulates a load on first visit. Docs: `/docs/data-table`.

## 1.11.1 — 2026-07-26

### Changed

- **Sort indicators are now carets, and every sortable column shows one.** A
  sortable column header shows a muted up/down caret (`CaretSort`) by default —
  so sortability is discoverable — and a solid caret for the active direction:
  `CaretUp` = ascending, `CaretDown` = descending (all Radix icons). The Sort
  dropdown matches. Non-sortable columns (`sortable: false`) show no indicator.

## 1.11.0 — 2026-07-26

### Added

- **Dependent (cascading) options in `RecordView`** — a choice field&apos;s
  options can now depend on another field&apos;s current value, in both the
  Add/Edit form and the Filter panel. Opt-in, backward compatible.
  - Form: `RecordField.options` may be a **function of the draft** —
    `((draft) => { value, label }[])` — recomputed as the draft changes.
  - Filter: `FieldFilter.options` may be a **function of the current filter
    values** — `((values) => { value, label }[])`. `FieldFilter` is now generic
    (`FieldFilter<T>`).
  - **Auto-clear:** when the parent changes and the child&apos;s value is no
    longer a valid option, RecordView clears it (form and filter). Static-array
    options are unchanged; the bulk "Set {label}" action only lists static-option
    fields (no single draft to resolve a function against).

  **For agents:** for a dependent picker (e.g. Country → State) pass a function
  to `options` / `filterable.options`; don&apos;t manually reset the child. If a
  field uses a function `options` *and* `renderInput`, guard with
  `Array.isArray(field.options)` before mapping. Demo: `system/cities`
  (Country → State) in both form and filter. Docs: `/docs/data-table`.

## 1.10.0 — 2026-07-26

### Added

- **`Combobox`** (`@viliha/vui-ui/combobox`) — a searchable single-select. Same
  API as `Select` (drop-in) but the popover leads with a type-to-filter input, so
  it scales to long option lists (an FK / country picker). Keyboard: type to
  filter, ↑/↓ to move, Enter to pick, Esc to close.
- **`RecordView` choice fields can use the Combobox.** In the Add/Edit form set
  `input: "combobox"` on an `options` field for a searchable control (default
  stays `Select`). In the Filter panel, `control: "combobox"` now renders the
  real searchable Combobox (previously it fell back to a plain Select).
- **`RecordField.renderInput`** — an escape hatch to render **any** Add/Edit
  control (checkbox, radio group, slider, date-range, a custom widget). It
  overrides the default control and receives `{ value, onChange, field, invalid }`;
  the field still owns the label, required mark, and Save validation. The
  Organizations form demonstrates it (Status as a radio group).

  **For agents:** for a long choice list use `input: "combobox"`; for a control
  the built-ins don't cover use `renderInput` — never hand-build a `<form>`.
  New demo: Organizations Status (radio via `renderInput`); Combobox is also in
  the components gallery. Docs: `/docs/components`, `/docs/data-table`.

## 1.9.0 — 2026-07-26

### Added

- **`sortable` field flag in `RecordView`** — decouples sorting from column
  visibility. By default a field is sortable iff it's a visible column
  (`!hideInTable`), unchanged. Now:
  - `sortable: true` sorts a field with **no column** (e.g. a `hideInTable` name
    shown via `getPrimary`) — it appears in the Sort dropdown.
  - `sortable: false` keeps a **visible column unsortable** (its header stops
    being a sort toggle).

  Affects both the Sort dropdown and the column-header click. Fully backward
  compatible — omit the flag for today's behavior.

  **For agents:** to make a non-column field sortable (or lock a column), set
  `sortable` on the `RecordField`; don't rewire the Sort dropdown or headers.
  Demo: `system/regions` sorts by Name (which has no column).

## 1.8.0 — 2026-07-26

### Added

- **Per-field filtering in `RecordView`** (opt-in, backward compatible). Mark a
  field `filterable` and the Filter panel switches from the single keyword box to
  a labeled control per field plus **Search / Clear**. The control is dynamic so
  the front end can compose a different filter form per request:
  - `filterable: true` → a text input.
  - `filterable: { control, label, placeholder, options }` → pick the control:
    `"text" | "number" | "date" | "select" | "combobox" | "checkbox"` (unknown or
    omitted → text). `options` falls back to the field's own `options`.
  - New exported types: `FilterControl`, `FieldFilter`, `FilterValues<T>`.
  - The panel **gathers values only** — it does not match rows in per-field mode.
    Wire matching through the new `RecordView` prop `onFilter(values)` (Search and
    Clear both call it), typically a server query or your own client filter. The
    single-keyword box (and its built-in row matching) is unchanged when no field
    is `filterable`.

  **For agents:** to add per-field filters, only set `filterable` on the relevant
  `RecordField`s and handle `onFilter` — never hand-roll a filter form. Extend
  `FilterControl` when a new control kind is needed. Demo: `system/regions`
  (Name + Code). Docs: `/docs/data-table`.

## 1.7.0 — 2026-07-25

### Added

- **Configurable favicon** via the runtime brand system. `BrandProvider` gains a
  `faviconUrl` field (alongside `logoUrl`): set `NEXT_PUBLIC_FAVICON_URL` for a
  build-time default, return `faviconUrl` from your `NEXT_PUBLIC_BRAND_URL` JSON
  (or call `useBrand().setBrand({ faviconUrl })`) to change the browser-tab icon
  live per tenant, no rebuild. The static `app/icon.*` files remain the fallback.

## 1.6.3 — 2026-07-25

### Fixed

- `RecordForm` no longer loses in-progress input when switching tabs **in dev**.
  The draft persistence (`persistKey`) used a first-write flag that React
  StrictMode's effect double-invoke defeated: the second pass wrote the empty
  initial value over the draft the restore effect was about to bring back. The
  writer now skips the untouched seed by identity, so it never clobbers a stored
  draft. (Production builds, which don't run StrictMode's double-invoke, were
  unaffected.)

## 1.6.2 — 2026-07-25

### Fixed

- The scaffolded `next.config.ts` now pins `turbopack.root` to the app dir, so
  Next.js no longer infers the workspace root from a stray lockfile higher up the
  tree (a home-dir `bun.lock`, or an outer monorepo) and emits the "inferred your
  workspace root, but it may not be correct" warning.

## 1.6.1 — 2026-07-25

### Added

- `NEXT_PUBLIC_APP_URL` sets the deploy origin (`SITE.url`), so `metadataBase`,
  canonical URLs, and Open Graph URLs resolve against your domain instead of the
  hard-coded demo host. Falls back to the demo URL when unset. Completes the
  env-driven brand set (`APP_NAME` / `APP_TAGLINE` / `APP_DESCRIPTION` / `APP_URL`).

## 1.6.0 — 2026-07-25

### Changed

- Documentation polish: package-manager commands in the docs now use tabs
  (npm / pnpm / yarn / bun), and the prose across the README, `AGENT.md`, and the
  docs site was cleaned of em-dashes for a more natural read.

### Added

- **Runtime branding via `BrandProvider` / `useBrand()`** (in the scaffold) — for
  white-label / multi-tenant apps that get their branding from an API. Env vars
  are the defaults; override them live from a `NEXT_PUBLIC_BRAND_URL` JSON
  endpoint, a `<BrandProvider initial={…}>` seed, or `useBrand().setBrand(…)`.
  The name, tagline, description, logo, and the browser-tab title all update at
  runtime — no rebuild. Also routes the last hard-coded name spots (onboarding /
  register-business headers, the signin aside) through the runtime brand.

## 1.5.4 — 2026-07-24

### Added

- `NEXT_PUBLIC_APP_NAME` renames the app — the sidebar, wordmark, auth screens,
  and browser-tab metadata read from one place (`SITE.name`) instead of a
  hard-coded "Vui Starter". `NEXT_PUBLIC_APP_TAGLINE` and
  `NEXT_PUBLIC_APP_DESCRIPTION` complete the tab-title/meta rebrand.

### Fixed

- `ChartContainer` no longer triggers Recharts' "width(0) and height(0) … should
  be greater than 0" warning when it renders inside a hidden container (e.g. a
  kept-alive inactive tab). It waits for a measured size before mounting the
  `ResponsiveContainer`.

## 1.5.3 — 2026-07-24

### Added

- The changelog and the **[Upgrading](./AGENT.md#upgrading)** guide now ship in
  the npm package. (They were authored for 1.5.2 but missed that tarball, which
  was published a moment before.)

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
