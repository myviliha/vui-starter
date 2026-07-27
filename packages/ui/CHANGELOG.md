# Changelog

All notable changes to `@viliha/vui-ui` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/): **patch** for fixes, **minor** for
backward-compatible features, **major** for breaking changes.

To upgrade, see [Upgrading](./AGENT.md#upgrading) in the agent guide.

## 1.19.0 — 2026-07-27

### Added

- **Sortable identity column header.** The leading Name/Title column (driven by
  `nameLabel` + `getPrimary`) was a static header — you could only sort it from
  the Sort dropdown. It now toggles sort on click and shows the same
  CaretSort/CaretUp/CaretDown affordance as other columns. It sorts by
  `nameSortKey`, or auto-detects the first `hideInTable` field marked `sortable`
  (the one driving `getPrimary`). No opt-in beyond marking that field `sortable`;
  if none is sortable, the header stays static (unchanged).

  **For agents:** to make the identity column sortable, mark its `hideInTable`
  name/title field `sortable: true` (that also lists it in the Sort dropdown), or
  pass `nameSortKey`. Docs: `/docs/data-table` (Sorting).

## 1.18.0 — 2026-07-27

### Changed

- **`Tooltip` now matches the shadcn design** (dark `bg-primary` bubble + arrow)
  and takes a **`side`** prop: `"top" | "bottom" | "auto"` (default `"auto"`).
  Auto prefers **bottom** and flips to **top** only when there isn't room below —
  so datatable cell tooltips drop below a column but flip up for the last rows
  near the footer, never clipped. Still dependency-free (portal + fixed
  positioning). RecordView's truncated-cell tooltips get this automatically.

## 1.17.0 — 2026-07-27

### Added

- **`nameLabel` prop on `RecordView`** — the leading identity-column header was
  hardcoded to "Name". Set `nameLabel="Title"` (etc.) for tables whose identity
  is a title field (regions, countries, languages, roles, …). Default stays
  "Name", fully backward compatible.

## 1.16.0 — 2026-07-27

### Added

- **Configurable page-form breadcrumb.** `RecordForm` (page layout) takes a
  `crumbs` prop that fully replaces the default `Home › {title} › Create/Update
  {singular}` trail — add parents (e.g. an "Access" section), rename the last
  crumb ("New Role"), or reshape it per route. Each crumb is `{ label, onClick? }`;
  the last is the current page. The `Crumb` type is re-exported from
  `@viliha/vui-ui/record-view` (also in `@viliha/vui-ui/breadcrumbs`).

### Changed

- **Choice-field cells show the option label, not the raw value.** A field with
  `options` now renders its matching label in the table (e.g. `SYSTEM` →
  "System") while staying editable — no need for a read-only `render` just to map
  an enum to a friendly label. Falls back to the raw value when unmatched.

  **For agents:** use `options` labels for enum columns (not `render`), and pass
  `crumbs` to `RecordForm` to shape a route's breadcrumb. Docs: `/docs/data-table`.

## 1.15.0 — 2026-07-27

### Added

- **Cell truncation in `RecordView` — long text stays on one line.** A cell
  longer than `maxCellChars` is clipped with an ellipsis (…) and shows the full
  value in a **styled hover tooltip**, so a sentence never wraps to a second row.
  The limit defaults to `NEXT_PUBLIC_MAX_CELL_CHARS` (or 25) and is overridable
  per view (`maxCellChars` prop) or per column (a field's `maxChars`; `0` = never
  truncate). Applies to the identity/Name cell and every value column.
- **`Tooltip`** (`@viliha/vui-ui/tooltip`) — a lightweight, dependency-free themed
  tooltip (portal + fixed positioning, hover/focus, auto-flip). Used by the cell
  truncation above; reusable anywhere.

  **For agents:** rely on cell truncation instead of adding `truncate`/`title`
  to cells yourself; set `maxChars` on a field to widen/disable a specific column.
  For your own tooltips use `Tooltip`, not native `title`. Env:
  `NEXT_PUBLIC_MAX_CELL_CHARS`. Docs: `/docs/data-table`, `/docs/configuration`.

## 1.14.2 — 2026-07-26

### Changed

- **Consistent loading feedback in `fetcher` mode.** A cache hit is served from
  the in-memory cache (no server round-trip), but the loading shimmer now stays
  up for a short minimum (300ms) so a cached load looks the same as a real
  fetch — no confusing "loading but blank" flash on tab switch. Real fetches
  longer than the minimum are unaffected; background (post-mutation) refetches
  stay silent.

  Note: the `fetcher` cache (added in 1.14.0) stores each page's data in a
  module-scoped `Map` in JS memory, so switching tabs serves from memory and does
  **not** re-hit the server. If you still see a refetch, you're on a build older
  than 1.14.0 (the demo before that had no cache).

## 1.14.1 — 2026-07-26

### Fixed

- **Per-field Filter panel layout.** The header ("Filter") and the footer
  (Clear / Search) are now static — only the fields scroll — so the actions stay
  in view on a long filter form. The footer's top border spans the full panel
  width, and the action buttons are compact (`size="sm"`).

## 1.14.0 — 2026-07-26

### Added

- **Built-in server data source for `RecordView`: `fetcher` + query cache.** Pass
  `fetcher={(query, signal) => Promise<{ rows, total }>}` and RecordView owns the
  whole read path — it fetches on every query change, manages `data` / `rowCount`
  / `loading`, aborts superseded requests via the `signal`, and (with `cacheKey`)
  caches responses so returning to a tab is instant with no refetch. Combine with
  `persistKey` to restore page/sort/filters on remount and hit the cache. New
  props: `fetcher`, `cacheKey`, `cache` (`{ max, ttlMs }` LRU), `onError`.
  Mutations are optimistic → invalidate → background refetch. This replaces the
  hand-wired `data`/`onQueryChange`/`loading` + `Map` boilerplate (still supported
  as the lower-level API). The Data Table demo now uses it.
- **Changelog on the docs site** at `/docs/changelog`, rendered straight from this
  file at build time (single source, never drifts). Linked in the docs nav.

  **For agents:** for a server-backed table, prefer `fetcher` + `cacheKey` +
  `persistKey` over wiring `onQueryChange`/`data`/`loading` + a cache yourself.
  Docs: `/docs/data-table` (Server-side data → "Let RecordView own the fetch").

## 1.13.2 — 2026-07-26

### Fixed

- **Data Table demo no longer reloads on tab switch.** Keep-alive keeps a page
  mounted, but under the App Router an async (server-fetching) page can still
  remount on tab switch and re-run its fetch. The demo now caches fetched pages
  in a module-scoped `Map` keyed by the query (served synchronously, no shimmer)
  and passes `persistKey`, so returning to the tab restores the exact page/sort/
  filters and shows the data instantly — no round-trip.

  **For agents:** for a server-backed table, cache responses (module `Map` or
  your data layer) and use `persistKey`; don't rely on keep-alive alone to avoid
  refetches. Docs: `/docs/data-table` (Persisting across tab switches).

## 1.13.1 — 2026-07-26

### Fixed

- **Keep-alive tabs now truly preserve a page's live state across tab switches**
  (within `NEXT_PUBLIC_MAX_TABS`). The scaffold's `KeepAliveTabs` was overwriting
  a route's cached element with Next's fresh `children` on every re-activation,
  which remounted the page and threw away its state — so a server-backed table
  (e.g. the Data Table demo) refetched every time you returned to its tab. It now
  caches each route's element once and reuses it, so switching away and back keeps
  the loaded data, scroll, and form state with no reload. Query-param routes
  (`/organizations/edit?id=…`) still update via their own `useSearchParams`.

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
