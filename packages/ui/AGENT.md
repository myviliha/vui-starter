# Using VUI in your project (AI agent guide)

> **Audience:** developers (and their AI agents) **consuming** `@viliha/vui-ui`
> in a downstream app. This file ships with the npm package. To auto-load these
> rules, copy the ready-made pointer to your project root; it `@`-imports this
> file, so you never duplicate the rules:
>
> ```bash
> cp node_modules/@viliha/vui-ui/CLAUDE.template.md ./CLAUDE.md   # Claude Code
> # or ./AGENTS.md for other agent tools
> ```
>
> To *contribute to* the theme itself, see
> [CONTRIBUTING.md](https://github.com/myviliha/vui-starter/blob/main/CONTRIBUTING.md)
> and [AGENTS.md](https://github.com/myviliha/vui-starter/blob/main/AGENTS.md).

You are a frontend architect building enterprise applications on **VUI Starter**. Your job is to ship apps that are consistent, maintainable, accessible, and production-ready by leaning fully on the VUI Design System. Don't reinvent the framework; build with it.

> **What you get from the package vs. what to copy.** `@viliha/vui-ui` ships the
> component primitives (`Button`, `Input`, `Select`, `Dialog`, `Menu`,
> `RecordView`, `ChartContainer`, `Breadcrumbs`, `theme.css`, …). App-shell
> patterns referenced below (`SetPageTitle`, the sidebar, and the `AuthCard*`
> auth screens) are **reference-app patterns**, not package exports.
> The breadcrumb *trail-building logic* (`crumbsFor` + `nav-config` +
> `route-meta`) is also a reference-app pattern: the package exports the
> presentational `Breadcrumbs` component; the app derives the trail from the
> route and feeds it in. Copy the patterns from the
> [backoffice demo](https://github.com/myviliha/vui-starter/tree/main/apps/backoffice)
> and adapt.

---

# Core Principles

Order your decisions by these priorities:

1. Reuse over rebuilding.
2. Consistency over customization.
3. Composition over configuration.
4. Simplicity over abstraction.
5. Accessibility by default.
6. Performance by default.
7. Predictable user experiences.
8. Enterprise-grade maintainability.

When several approaches would work, pick the one that aligns best with VUI.

---

# Think Before You Build

Before you create anything, search for what already exists: a VUI component, a page pattern, a layout, a variant, or a utility. Never duplicate functionality VUI already provides.

---

# Installation Requirements

## Scaffold the shell + demo (`init`)

The package ships the components; the **app shell** (layout, sidebar, open tabs,
command palette, nav config, logo) and **demo pages** are scaffolded with:

```bash
npx @viliha/vui-ui init          # interactive decision tree
```

Files land in the consumer's repo (they own them). Questions:
0. **Next.js or Turborepo?** (`--nextjs` / `--turbo` + `--dir <path>`, default
   `apps/web`; turbo scaffolds into that app directory)
1. **Fresh project?** (`--fresh` / `--existing`)
2. **Pre-built theme?** (`--prebuilt` = shell + demo pages / `--theme-only` = just
   the theme wiring you configure)

For a fresh app, create it **without `--src-dir`** (the scaffold uses a root
`app/` + `@/*` → `./*` and writes `next.config.ts`). `init` **auto-installs the
dependencies** with the package manager it detects from the lockfile (npm / pnpm
/ yarn / bun); `--yes` skips the prompt, `--no-install` skips installing.

- **fresh + prebuilt** → full runnable app (config + shell + demo).
- **fresh + theme-only** → just `globals.css` + `next.config` wiring; build your own.
- **existing + prebuilt** → shell + demo added; config **never** overwritten, and
  it prints the merge steps (`transpilePackages`, the `theme.css` import, the `@/*`
  alias, `import "./globals.css"`).
- **existing + theme-only** → nothing copied; prints the wiring steps.

Other flags: `--yes` / `--force` / `--dry-run`. If you only need the components, pass
`--theme-only` (or skip `init` entirely) and follow the setup below.

### Inside a Turborepo / monorepo

**Never scaffold into the repo root**; a monorepo root has no `app/` and no Next
app. Target the specific application, e.g. `apps/web`. Two equivalent ways:

```bash
# A) from the repo root, name the app dir
npx @viliha/vui-ui init --turbo --dir apps/web

# B) from inside the app (simplest to reason about)
cd apps/web
npx @viliha/vui-ui init
```

In turbo mode the CLI **does not auto-install** (installs are workspace-specific),
so finish the setup yourself, scoped to that app:

```bash
cd apps/web                 # be inside the app, not the root
pnpm add @viliha/vui-ui …   # or: pnpm --filter <app-name> add @viliha/vui-ui …
```

Then confirm the app is in your workspace globs (`pnpm-workspace.yaml` /
`package.json` `workspaces`) and run it with a filter: `pnpm --filter <app-name>
dev`. The theme import, `transpilePackages`, and the `@/*` alias all belong in
**that app's** `globals.css` / `next.config` / `tsconfig`, not the root.

### End-to-end walkthroughs

- **New standalone app**: `npx create-next-app@latest my-app --ts --tailwind
  --app --no-src-dir --use-npm`, then `cd my-app && npx @viliha/vui-ui init`
  (fresh + prebuilt). It scaffolds config + shell + demo, installs deps, and you
  run `npm run dev` → `/dashboard`.
- **New app in a monorepo**: scaffold your app under `apps/<name>` (e.g. with
  `create-next-app`), then from that app dir run `npx @viliha/vui-ui init` (or
  `--turbo --dir apps/<name>` from the root) and install deps in that app.
- **Existing app**: run `npx @viliha/vui-ui init --existing`. It never
  overwrites your config; wire up the four things it prints (`transpilePackages`,
  the `theme.css` import, the `@/*` alias, `import "./globals.css"`). Prefer only
  the components? Use `--theme-only` (copies nothing) and follow the setup below.

VUI ships as TypeScript source.

## Next.js

Transpile the package:

```ts
transpilePackages: ["@viliha/vui-ui"]
```

Import the theme once:

```css
@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";
```

## Vite

Import the theme once. No extra transpilation needed.

---

# Upgrading

When you bump `@viliha/vui-ui`, follow these steps. The package version and the
scaffolded files in the repo are two separate things.

1. **Read the [CHANGELOG](./CHANGELOG.md) for the target version.** Note anything
   under *Removed*, *Changed*, or *Breaking*, and any new peer dependency. The
   project follows semver: patch/minor are backward-compatible, major may break.
2. **Bump and install** with the project's package manager:
   ```bash
   npm i @viliha/vui-ui@latest      # or: pnpm up, yarn up, bun update
   ```
   In a monorepo, install in the specific app (or with a workspace filter, e.g.
   `pnpm --filter <app> up @viliha/vui-ui`), never at the repo root.
3. **No rebuild needed.** The package ships TypeScript source, so there's no
   build/dts step; just restart the dev server. If a new version adds a peer
   dependency, install it (the CHANGELOG and the "Module not found" error name it).
4. **Scaffolded files are yours.** `init` copies the shell and demo pages into
   the repo once; upgrading the package does **not** touch them. To pull
   scaffolder improvements into an existing project, preview first with
   `npx @viliha/vui-ui@latest init --dry-run`, then re-run with `--force` (commit
   or stash your work first so you can review the diff) or copy in just the files
   you want.
   - **Keep-alive tab cache (1.13.1) lives in a scaffolded file**, so an upgrade
     won't bring it. In `app/_components/open-tabs.tsx`, inside `KeepAliveTabs`,
     make sure the cache is written **once per route**, not on every render:
     ```ts
     // ✅ preserves the mounted page across tab switches (no remount, no refetch)
     if (!cache.current.has(active)) cache.current.set(active, children);
     // ❌ old: cache.current.set(active, children)  // remounts on re-activation
     ```
     Re-pull the file with `init --force`, or apply this one-liner by hand.
   - **Server tables that shouldn't refetch on tab switch:** use RecordView's
     `fetcher` + `cacheKey` + `persistKey` (all in the package, so they arrive
     with the upgrade) — see the Filtering/Tables notes above.
5. **Re-check token overrides.** If you overrode any `theme.css` tokens, confirm
   they still line up after the upgrade.
6. **Verify** before you commit: run type-check, lint, and build.

## Coming from 1.44 or earlier

The config work (1.50 to 1.52) is additive: `vuiPreset` is the shipped behaviour as a value, applied by default, so an app that configures nothing keeps working exactly as it did. There is a full step-by-step guide at the top of the [CHANGELOG](./CHANGELOG.md). The short version:

- **One thing needs code, and only if you render `BrandAsset` yourself** (1.45.0): add `inline` for the demo data-URI behaviour, or `onPick` for a real upload. Without either, the control says it has no uploader rather than storing a multi-megabyte data URI in a field. `organizationProfileFields` keeps `inline`, so a host using the preset does nothing.
- **If you pass `onDataChange` alongside `fetcher`** (1.49.0): it now actually fires, where it never did before. Return a promise from it so the post-save reload waits for your write instead of racing it.
- **Defaults that improved on their own**, no code needed: a table with no editable field no longer shows an Edit pencil that opened an empty form (`showEdit` overrides either way); async fields shimmer instead of painting a raw id, and an unresolvable reference reads `—`; long chat messages wrap.
- **Then configure as much or as little as you like**: `<VuiProvider config>` for the app, a `behaviour` / `formActions` / `formSlots` prop for one screen, `userConfigurable` for the people using it. Skipping all of it is a valid choice, and the most common one.

---

# Design Tokens

VUI is entirely token-driven. Never hardcode colors, spacing, radius, typography, shadows, or borders; reach for the semantic design token instead. For example: `--button-primary`, `--button-primary-hover`, `--background`, `--foreground`, `--border`, `--ring`, `--chart-1`, `--sidebar-primary`.

Avoid arbitrary values unless there's truly no token for the job.

---

# Application Structure

Organize the app around a feature-first architecture:

```
app/

components/

features/

hooks/

lib/

services/

types/
```

Keep business logic out of UI components.

**Data-backed pages use three separated layers — never fetch or process data in
a UI component:**

- **Data (API)** — `lib/api/<entity>.ts`: async functions that talk to the
  backend. No React.
- **Controller** — `use-<entity>.ts`: a hook that owns `{ data, loading, error }`,
  calls the data layer *after mount*, and exposes writes.
- **Presentation** — a thin `*-table.tsx` that `next/dynamic`-loads the view
  behind a skeleton, and a `*-view.tsx` that reads the controller and renders
  `RecordView`.

This makes navigation feel instant — the UI paints its skeleton before the data
loads (controller starts `loading: true`; the dynamic import renders the shell
before the datatable chunk parses). For large server-backed lists, use
`RecordView`'s built-in `fetcher` instead of paginating by hand. The scaffolded
`organizations` page is the reference implementation.

---

# Page Layout

Every page follows the standard VUI layout:

```
SetPageTitle

↓

Action Header

↓

Scrollable Content
```

Only the content area scrolls, and this structure stays consistent across the whole app.

---

# Sections

Group content into bordered cards, and avoid deeply nested layouts. Reach for spacing to establish hierarchy before you add more borders.

---

# Navigation

Navigate with the three provided pieces: breadcrumbs, sidebar, and top navigation. Don't build a custom navigation system unless the project explicitly demands one.

## Breadcrumbs

One trail, **derived from the route, never hand-written per page.**

- Render with the shared `Breadcrumbs` component (`@viliha/vui-ui/breadcrumbs`):
  last crumb is the current page (bold, non-interactive), earlier crumbs are
  links, chevron separators.
- Build the trail from the URL against a single nav config (copy `crumbsFor` +
  `nav-config` + `route-meta` from the reference app). Root it at **Home**
  (your dashboard route). A section/group parent has no page of its own, so its
  crumb links to its **first child**; clicking a section lands on that
  section's first page.
- Ship **one** landing page, labeled "Home". Don't split "Home" and "Dashboard"
  into two routes.

To reorder or rename, edit the nav config; the trail follows automatically.

## Sidebar: sections & collapsible groups

The sidebar is driven by one `NAV` config (copy `nav-config.ts`). There are
**two grouping shapes: use them, don't invent a third:**

- **Section** (`NavSection`, `{ title?, items }`): a top-level band with an
  optional `title` heading. Items are **always visible** (no collapse). Use it to
  cluster related pages under a label (e.g. *Records*, *System*). The first
  section usually has no title.
- **Collapsible group** (`NavGroup`, an entry with `children`): a parent row with
  a chevron that **hides/unhides** its nested links; it auto-opens when a child is
  the active route. Use it for a set of sub-pages under one parent (e.g. *Auth*,
  *CRM*, *System*) to keep the sidebar short. A group parent has no page of its
  own; its breadcrumb points at its first child.

```ts
export const NAV: NavSection[] = [
  { items: [                                   // untitled section
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Auth", icon: Lock, children: [   // collapsible group (hide/unhide)
      { label: "Sign in", href: "/auth/signin", icon: LogIn },
    ]},
  ]},
  { title: "Records", items: [                  // titled section (static band)
    { label: "Organizations", href: "/organizations", icon: Building2 },
  ]},
];
```

When adding a page, always add it to `NAV` and mirror its color in
`route-meta.ts`; the sidebar, breadcrumbs, and tabs all derive from these.

## Open tabs (keep-alive)

Enterprise apps keep several pages open at once. The reference app ships a
browser-style **tab strip** under the top bar, a reference-app pattern (copy
`open-tabs.tsx`), not a package export. **This is a first-class feature; wire it
in, because a fresh install won't have it.**

It is **keep-alive**: every opened page stays mounted (inactive ones hidden), so
switching is instant (no remount/flash) and each page keeps its live state
(scroll, form input, filters). Mount the three pieces once in your app layout:

```tsx
<OpenTabsProvider>
  <AppSidebar /> <TopBar />
  <TabStrip />                          {/* the strip, under the top bar */}
  <KeepAliveTabs>{children}</KeepAliveTabs>   {/* keeps open pages mounted */}
</OpenTabsProvider>
```

- Labels/icons/colors derive from `nav-config.ts` + `route-meta.ts`, with no per-tab wiring.
- The list persists in `sessionStorage`, capped by `NEXT_PUBLIC_MAX_TABS`
  (default 5; oldest FIFO-evicted with a warning).
- Tabs are drag-reorderable and right-click-taggable with one of seven colors.
- ⌘/Ctrl-click a nav item opens a **background tab**; call
  `useOpenTabs().openTab(href, { background: true })` for custom "open in new tab"
  buttons. `tabKey` normalizes trailing slashes so `/foo` and `/foo/` are one tab.

Keep-alive relies on a static-export (all-client) shell. If your app renders
server components per route, either adopt the demo's static-export shell or fall
back to a plain navigation-tab model (router push per tab); the strip,
persistence, and nav-config wiring stay identical.

**Revalidate stale tabs.** Keep-alive's tradeoff: a controller that fetches once
on mount **never re-fetches**, so if another user edits a record while your tab
sits open, you keep seeing the old value (and risk a write conflict on save).
Revalidate with `useRefetchOnActive(routePath, refetch)` (scaffolded at
`lib/use-refetch-on-active.ts`) — it re-runs `refetch` when the tab becomes
active again or the window regains focus. Make `refetch` a **delta**
(`?since=cursor` → only changed rows + deleted ids, merged by `id`), **not** a
full reload — the point is a cheap "what changed?" call. `use-organizations.ts`
+ the data layer's `syncOrganizations(since)` are the reference. Refetch narrows
but can't close the conflict window: guard the write itself with optimistic
concurrency (send the record's version/`updatedAt`, reject a stale write with
`409`) when conflicts matter.

---

# Forms

Build forms with VUI and shadcn/ui together, reaching for shadcn Form, React Hook Form, and Zod. Every form handles the full lifecycle: validation, loading, success, error, disabled, and keyboard navigation. Never use a placeholder in place of a label.

---

# Notifications (toasts)

For errors and transient notifications use `toast(...)` from `@viliha/vui-ui/toast` — `toast("Saved")`, `toast({ title, description, action: { label, onClick } })`, or `toast.error(...)` / `toast.success(...)`. It's a module store, so call it from anywhere (event handlers, `catch` blocks) — no provider. `<Toaster />` is mounted once in the scaffold's root layout; keep it there. Don't hand-roll a notification banner or add another toast library.

# Tables

Never hand-build an HTML table; always use `RecordView`. Configure columns through its field props (`editable`, `required`, `copyable`, `options`, `render`), and let `RecordView` own the rest: sorting, filtering, pagination, bulk actions, and import/export.

Toggle which toolbar controls appear with the `show*` props (all default `true`): `showFilter`, `showSort`, `showPagination` (the standard set), `showImport` / `showExport` (turn off per page where those don't apply), `showAdd`, and `showSelection`. `showPagination={false}` renders all rows in client mode; `showSelection={false}` drops the checkbox column, bulk actions, Clear selection, and drag-to-reorder (they share the leading column).

`showEdit` is the one exception: it defaults to whether any field is `editable`, not to `true`. A read-only list (nothing marked `editable`, which is the default for a field) shows no row pencil and no Edit button on the view panel, because opening that form would show an empty body and a Save that writes nothing. Set `showEdit={false}` to hide Edit on a table that does have editable fields, or `showEdit` to force it on. Use `onEdit` when you want the action to stay but point somewhere else, like your own edit route.

**Trash / restore** (`showTrash`, off by default): adds a **Trash** toggle left of Filter that flips the same table between live and soft-deleted rows. Don't build a separate deleted-records screen. RecordView is display-only here — it never decides what "deleted" means: the host supplies the trashed rows (`trashedData` in client mode, or the `trash: true` flag on the `ServerQuery` in `manual`/`fetcher` mode) and persists restores via `onRestore(rows)`. Restore mirrors delete — a per-row Restore icon and bulk "Restore N selected", each confirmed; in Trash the Add button is hidden and row Delete becomes Restore. Reference: the Branches table.

Long cell text never wraps: cells truncate to one line at `maxCellChars` (view prop; defaults to `NEXT_PUBLIC_MAX_CELL_CHARS` or 25) with an ellipsis + hover tooltip. Override a column with the field's `maxChars` (`0` = never truncate). Custom `render` cells (badges, chips) don't truncate, but they clip to their column so a long one never spills into the next. Don't add your own `truncate`/`title` on cells — it's built in.

Columns are user-resizable by default: drag a column's right edge to widen it, so a long value in a narrow column is always reachable. This comes from `resizableColumns`, which defaults to `NEXT_PUBLIC_RESIZABLE_COLUMNS` (on unless set to `0`/`false`). Pass `resizableColumns={false}` to opt a single table out, or set a field's `width` for a fixed initial size. Add `NEXT_PUBLIC_RESIZABLE_COLUMNS` to `turbo.json` `globalEnv` if you read `NEXT_PUBLIC_*` inside `packages/ui`.

The leading identity column header is "Name" by default; set `nameLabel` (e.g. `"Title"`) for tables whose identity is a title field. To make that header sortable (click + caret, like other columns), mark its `hideInTable` field `sortable` or set `nameSortKey`. To move it out of the first slot (or hide it), set `identityColumn` — `"first"` (default), `"last"`, `"hidden"`, or a number = field columns before it (e.g. Country/State/City reference tables: `"last"`). A choice field (`options`) shows the option's **label** in the cell (e.g. `SYSTEM` → "System") while staying editable — don't use `render` just to map an enum to a friendly label. To customize the full-page form's breadcrumb, pass a `crumbs` array to `RecordForm` (each `{ label, onClick? }`, last = current page) — e.g. to add an "Access" parent or rename "Create new role" → "New Role".

Sorting follows column visibility by default; use `sortable` to decouple them — `sortable: true` sorts a field with no column (e.g. a `hideInTable` name shown via `getPrimary`), `sortable: false` locks a visible column. Set the flag; don't rewire the Sort dropdown or headers.

Form controls come from the field: `options` → `Select`, `input: "combobox"` → a searchable `Combobox` (`@viliha/vui-ui/combobox`, use for long lists), `input: "number" | "date"` → native inputs, `input: "checkbox"` → a boolean checkbox (Yes/No in read/cells). For anything the built-ins don't cover (radio group, slider, custom widget), set `renderInput({ value, onChange, field, invalid })` on the field — it drops any component into the Add/Edit form while the field keeps its label, required mark, and Save validation. A field can set **both** `render` (the read-only view) and `renderInput` (the edit control): the form shows `render` while viewing and swaps to `renderInput` while editing, so a custom cell like a logo preview or a status badge stays editable in Edit mode. Don't hand-build a `<form>`.

Validate fields declaratively — don't hand-roll a form to get validation. On a `RecordField` set `min`/`max` (character length, or numeric value for `input:"number"`), `pattern` (+ `patternMessage`), `format: "email" | "phone"` (`"phone"` also auto-formats as you type), a custom `validate(value, draft)` returning a message, and `trim`. The Add/Edit form (slide-over and full-page) runs the rules on blur + before Save, **blocks Save** while anything is invalid, and shows the message inline under the field. `required` still shows the `*`. Reference: the Branches Add/Edit form.

Group fields into form sections with `group`. It takes **any** title, and `RecordForm` renders one section per group in the order the groups first appear — so a profile form can read "Organization information", "Brand assets", "Contact & address", "Localization & units" instead of the default "General". Ungrouped fields fall under "General". Per-field `description` fills the About/info panel beside the form.

**The page frame is a component, not markup to copy.** `Page` (`@viliha/vui-ui/page`) is the standard shape: a full-height column, a 48px action header holding the breadcrumb trail and that page's actions, then the one scrolling `p-4` content region.

```tsx
import { Page } from "@viliha/vui-ui/page";

<Page breadcrumbs={<Breadcrumbs />} actions={<Button>New organization</Button>}>
  <section>…</section>
</Page>
```

The frame is deliberately fixed: it is what makes a dozen screens feel like one app, so what varies is the slots, not the layout. `footer` pins a bar below the content and outside the scroll (a Save bar), `bare` drops the standard content wrapper when a page lays itself out (a board with its own horizontal scroll), `hideHeader` covers a page with nothing to put up there, and `className` / `headerClassName` / `contentClassName` open each region for the rest. Don't rebuild the frame by hand; if it can't express what a page needs, that's worth fixing in `Page`.

**Profile pages** (a single record shown read-only, with an Edit button that opens the Cancel + Save footer): don't hand-wire the view/edit toggle — import the pre-designed `ProfileForm` (`@viliha/vui-ui/profile-form`). Feed it `data` + `fields` (+ `onSave`, `getPrimary`, `title`) and it owns the view↔edit modes, revert-on-cancel, the info panel and a loading skeleton. For a company profile, spread the ready-made preset: `import { organizationProfileFields, getOrgPrimary, type OrgProfile } from "@viliha/vui-ui/organization-profile"` (Org information / Brand assets / Contact & address / Localization, plus the `BrandAsset` logo/favicon control). The backoffice `/organization/profile` page is the reference consumer.

**Image fields upload through you, not through the package.** `BrandAsset` (the Logo/Favicon control) never touches your storage. Give it `onPick(file)`, put the file wherever assets belong, and return the URL to display: `orgProfileFields({ logo: { onPick: async (file) => ({ url: await upload(file) }) } })`. Store whatever you like in the field, an id or a URL, since the control only renders the `value` you give it back. It handles the rest itself: `maxBytes` rejects an oversized file before you are called, the button shows "Uploading…" until your promise settles, a rejection prints inline, and `meta` (`name`, `format`, `width`, `height`, `sizeBytes`, `uploadedAt`) prints a details line under the preview. Use `accept` to narrow the file types; it allows every image type by default. There is one escape hatch, `inline`, which stores the picked image as a base64 data URI. It exists for demos with no backend. Don't point it at a real API: a 2 MB logo becomes a ~2.7 MB field value that no ordinary column will take. The prebuilt `organizationProfileFields` uses `inline` for exactly that reason, so reach for `orgProfileFields({ … })` as soon as you have somewhere to put the file.

Loading from a server: pass `loading` to `RecordView` while the fetch is in flight — it shows shimmering skeleton rows (matched to the columns) instead of an empty-state flash; clear it when the data arrives. Don't build your own spinner overlay.

Server-side (large tables) — two ways:

1. **`fetcher` (preferred).** Pass `fetcher={(query, signal) => Promise<{ rows, total }>}` and RecordView owns the read path: it fetches on every query change, manages `data`/`rowCount`/`loading`, aborts superseded requests, and — with `cacheKey` — caches responses so returning to a tab is instant with no refetch. Add `persistKey` so page/sort/filters restore on remount and hit the cache. Optional `cache={{ max, ttlMs }}` and `onError`. Mutations are optimistic + invalidate + background refetch. Don't wire `data`/`onQueryChange`/`loading` yourself in this mode.
2. **`manual` + `onQueryChange` (lower-level).** RecordView reports the query; you fetch and set `data` + `rowCount` + `loading`, guarding out-of-order responses and caching yourself.

Either way, don't reimplement pagination/sort. Reference: the Data Table demo page (shadcn/ui section) uses `fetcher` + `cacheKey` + `persistKey` against a simulated backend, and the `users` demo paginates a large table server-side end to end.

Page size: the initial rows-per-page and the selector ceiling come from `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` (default 25) and `NEXT_PUBLIC_MAX_PAGE_SIZE` (default unbounded), overridable per table with the `defaultPageSize` / `maxPageSize` props. `maxPageSize` is a UI ceiling only — **your data layer must clamp the returned page to the same max**, because a client can request any size. For a read-only or `fetcher`-backed list, omit `initialData` and `makeEmptyRow`; the "+ New" button and CSV/JSON import are then hidden (there's nothing to create). Add both env vars to `turbo.json` `globalEnv` if you read `NEXT_PUBLIC_*` inside `packages/ui`.

Lazy-load option data — **required for remote / large reference lists; never eager-load a catalog into a static `options` array at mount.** A choice/combobox field, filter, or standalone picker that sources its options from an API must use the async option loader, so browsing a table fetches zero reference data:

- On a **`RecordField` or `FieldFilter`**: set `loadOptions({ search, signal, values })` (fetch on open + debounced server search), `resolveOption(value)` (resolve an already-set/defaulted value's label from a **single record** — never load the whole list to show one label), and `dependsOn: [parentKey]` for cascades (Region → Country → State: a parent change clears the child's cached options + value). `values` is the live draft (form) or filter values. Works for both the form and the filter.
- **Nothing ever shows the raw id.** A read cell, view panel or picker trigger renders a skeleton until the label lands, and a value that resolves to nothing reads `—`. `Region 1` and a bare uuid are meaningless to whoever is reading the screen, and an unresolvable reference is missing data rather than a value. This holds in `RecordView`, `RecordForm`, `ProfileForm`, `Combobox`, `Select` and `MultiCombobox`, so a host gets it without doing anything.
- **One request per source, not per value.** Add `resolveOptions(values)` next to `resolveOption` and every cell of that column painted in the same tick is resolved by one call: a 50-row Employees page asks for its Department ids once. With only `resolveOption`, identical ids already in flight are shared, so repeated values still cost one request each rather than one per cell.
- **`displayValue(row)` skips resolution entirely.** When your payload already carries the label next to the id (`{ countryId, country }`), set `displayValue: (row) => row.country` and the read display paints instantly with zero requests. Unlike `render` it supplies only the text, so the cell keeps its alignment, truncation and copy button, and the edit control is untouched. This is the cheapest fix when you control the endpoint.
- On a **standalone `Combobox` / `Select`**: pass `source={{ loadOptions, resolveOption }}` instead of `options`, plus `resetKey` (a string derived from any cascade parent) to invalidate. This is the same engine (`useAsyncOptions`), so any picker outside a datatable — `/settings` timezone/currency/language dropdowns, an FK picker in a custom form — lazy-loads the same way.

Loading / empty / error (retry) states render inside the dropdown automatically. `onFormOpen(mode, row?)` (1.24.0) is now only a coarse "a form opened" notification; for option data prefer `loadOptions`, which also covers filters and standalone pickers that `onFormOpen` can't reach.

Many-to-many (multi-select): set `multiple: true` on a choice field — its value becomes a `string[]` and the Add/Edit form renders a searchable multi-select with removable chips (`MultiCombobox`), from static `options` or async `loadOptions`. For async, add `resolveOptions(values)` (the batch companion to `resolveOption`) to label the selected values on open. The read cell shows up to `maxChipsInCell` (default 3) labels then "+N". `required` means at least one. Reuses `dependsOn` for cascade scoping; nothing loads on mount. Reference: the Markets → Post Codes field.

Dependent/cascading options: make `options` (form) or `filterable.options` (filter) a function — `(draft) => …` in the form, `(values) => …` in the filter — and one field's choices depend on another; RecordView clears the child when the parent change invalidates it. Keep `options` a static array for the bulk "Set {label}" action, and mark the field `editable`: bulk writes follow the same rule as the form, so a field the form won't edit isn't writable in bulk either. If a field has both a function `options` and `renderInput`, guard with `Array.isArray(field.options)` before mapping (renderInput doesn't get the draft to resolve it).

**Fixed named levels as one control** (Region → Country → State → City): use `@viliha/vui-ui/cascading-combobox` (`CascadingCombobox`) instead of wiring N separate cascades by hand. Pass `levels` (ordered `{ key, label }`) and a `CascadeNode[]` tree (`{ value, label, children }`, any depth); it renders one searchable `Combobox` per level, narrows each level from the parent's `children`, clears everything downstream on change, and disables a level until its parent is set. `value` is a `string[]` path; `onValueChange(path, nodes)`. For API-backed levels, keep using per-field `loadOptions` + `dependsOn` on a datatable/form instead.

## Filtering

The Filter panel is a single keyword box by default (built in, matches all fields). For a labeled control per field, set `filterable` on the relevant fields and never hand-roll a filter form: `filterable: true` (text) or `filterable: { control, label, placeholder, options }` where `control` is `"text" | "number" | "date" | "select" | "combobox" | "checkbox"`. When any field is filterable the panel shows a control per field plus Search / Clear. It only **collects** values — handle `onFilter(values)` on `RecordView` to run a query or client filter (Search and Clear both call it). Types: `FilterControl`, `FieldFilter`, `FilterValues<T>`. Need a control kind that isn't listed? Extend the `FilterControl` union in the component.

**Layout is fixed: two columns — label │ control, one row per field**, labels aligned across rows. This is the enforced theme default (do not restyle to stacked). It's built from `@viliha/vui-ui/filter-field` (`FilterGrid` + `FilterField`); `RecordView` renders both its `filterable` fields and any custom rows with it.

**Custom filter rows.** To add your own labelled control to the panel, pass `filterExtras` to `RecordView` composed with `FilterField` — never hand-roll the row layout:

```tsx
import { FilterField } from "@viliha/vui-ui/filter-field";

<RecordView
  fields={fields}
  filterExtras={
    <FilterField label="Created after">
      <Input type="date" value={after} onChange={(e) => setAfter(e.target.value)} />
    </FilterField>
  }
  onFilter={runQuery}
/>
```

Rows appear below the `filterable` fields in the same grid; the panel opens when there are `filterable` fields **or** `filterExtras`. `filterExtras` state/matching is yours (RecordView's Search/Clear drive the `filterable` values only). Building a panel outside RecordView? Wrap your `FilterField`s in `FilterGrid`.

## Add / edit form

The buffered add/edit form renders in one of two layouts:

- **Slide-over panel**: the default; nothing to configure.
- **Full-page form**: set `formMode="page"` (with `formColumns={1 | 2}`). Add
  `formDescription` and a per-field `description` to show an AWS-style help
  panel beside the form.

**The footer buttons are yours.** `RecordForm` ships Cancel + Save (Close + Edit while viewing) and they are ordinary actions, so you change them with the same API that builds them. Pass `formActions` a function and you get the shipped list to work from:

```tsx
formActions={(defaults) => [
  ...defaults,
  {
    id: "archive",
    label: "Archive",
    align: "start",              // pinned left, where destructive actions belong
    variant: "destructive",
    confirm: { title: "Archive this record?" },
    onAct: async (ctx) => { await api.archive(ctx.row.id); },
  },
]}
```

Pass an array instead and it replaces them outright. Each action takes `label`, `variant`, `icon`, `align`, `confirm`, and `visible` / `disabled` predicates that read the live form: `visible: (ctx) => ctx.mode === "edit"`, `disabled: (ctx) => !ctx.dirty`. The context carries `mode`, `row` (the draft), `dirty`, `valid`, `errors`, `close`, `reset` and `edit`.

One rule governs what happens next: **an action closes the form when it finishes unless it returns `false`, and an action that validates commits the draft through `onSave` on the way out.** `after` picks what "closes" means for that button: `"close"` (the default), `"stay"` on the record just saved, or `"new"` for a blank one, which is all "Save & New" takes: `{ id: "save-new", label: "Save & New", variant: "primary", after: "new" }`. `after: "new"` needs `makeEmptyRow` and falls back to `"stay"` without it. Validation is on for `variant: "primary"` and off otherwise, which is why Save validates and Cancel doesn't; set `requiresValid` to override either way. So a destructive action closes without saving, and a custom primary action saves exactly like Save, with the same validation and the same discarded draft. `renderFooter(ctx)` replaces the footer wholesale, for the rare case the array can't express it.

To change the footer for every form in the app rather than one screen, set it on the provider (see below). A per-screen `formActions` still wins.

**Multi-tenant apps: the organization switcher.** `OrgSwitcher` (`@viliha/vui-ui/org-switcher`) is the brand block at the top of the sidebar: product mark, product name, current organization underneath, opening the list of organizations the person belongs to with a Current badge, a plan line and a create row.

The design is fixed; the logic is yours. `OrgProvider` ships a working default (pick one, it becomes current and is remembered per browser). Replace it with `onSwitch` when a switch means more:

```tsx
<OrgProvider organizations={orgs} defaultOrgId={session.orgId}
  onSwitch={async (org) => { await api.post("/session/org", { id: org.id }); }}>
  <OrgSwitcher logo={<Logo />} productName="PULSE" onAdd={() => router.push("/register-business")} />
```

`onSwitch` runs **before** the change and throwing cancels it, so a refused server call leaves someone where they were instead of showing them a tenant they aren't in. Return a promise and the row shows a pending state. Read the current tenant anywhere with `useOrg()` and scope your data layer to it.

Labels, the plan line, and **where "Add organization" goes** all come from `VuiProvider`'s `orgSwitcher` section: `addHref` sets the destination once for the app (a wizard, your own create page, an external signup) instead of wiring a route into the sidebar. The row renders as a real link so middle-click works; pass `onNavigate={router.push}` to keep a plain click client-side. Creating shouldn't navigate at all? `onAdd` on the component takes over. Neither set means the row hides rather than rendering dead. Switching logic deliberately isn't config, because it's code. Give each `Organization` a `theme` and switching repaints the app in that tenant's brand, with a personal theme still winning over it.

**Theming at runtime: `@viliha/vui-ui/theme-config`.** Colors, font and radius stay in `theme.css`, and this is how those tokens get a runtime source rather than a second styling system. `THEME_FIELDS` is the complete list of what can change (primary colour, text on primary, accent, destructive, background, text, borders, font, text size, radius, logo, favicon); each entry names the CSS variable it writes, so applying a theme is setting variables on an element and every component follows without knowing.

Two layers, and they match how organizations actually work: the organization sets the brand, and each person overrides the parts they care about.

```tsx
<ThemeConfigProvider
  orgTheme={org.theme}
  source={{
    load: () => api.get(`/users/${me.id}/theme`),
    save: (theme) => api.put(`/users/${me.id}/theme`, theme),
  }}
>
```

The package never fetches: `source` is your two functions, so the theme lives in your database against whatever identity you use. Omit it and a personal theme stays in `localStorage`. Drive a settings screen from `useThemeConfig()` (`theme`, `userTheme`, `orgTheme`, `setValue`, `applyPreset`, `reset`, `saving`, `error`), and reach for `THEME_PRESETS` for a swatch row.

Three things worth knowing before you extend it. **`--brand` is the only colour a theme sets** for the primary action: the hover state, ring, selection and button shadow derive from it in `theme.css` with `color-mix`, and so does the dark variant, so one saved value covers both modes and they can't drift. **Fonts are self-hosted and loaded by the app** (`next/font` defines the variable named in `FONT_FAMILIES`), so switching makes no request and can't shift the layout. Every entry in that list has to be loaded in your root layout with its variable on `<html>`, or picking it silently falls back to the generic stack; the provider warns in development when that happens. **Run `parseTheme()` on anything from your API**: a stored theme is user input that becomes a CSS variable, and it drops unknown keys and anything containing `;`, braces or angle brackets. Reference: Settings → *Theme* in the backoffice, with `ORG_THEME` in `lib/app-config.ts`.

**One config, layered.** The preconfigured theme is itself a config: `vuiPreset` is a plain value the package applies by default, built from the same API you would use. So nothing is locked and nothing is all-or-nothing. Values resolve **per-instance prop → user preference → `<VuiProvider config>` → `vuiPreset` → package default**, and a layer overrides only the keys it mentions.

```tsx
import { VuiProvider } from "@viliha/vui-ui/config";

<VuiProvider config={{ form: { actions: (d) => [...d, saveAndNew] } }}>
  {children}
</VuiProvider>
```

The provider is optional: without it you get the theme as shipped. `defineConfig` types a config object, `mergeConfig` combines several (later wins), and `useVuiConfig()` reads the resolved one. Colors, radius and spacing are not in here on purpose, they stay in `theme.css`.

**Put your own content between the fields.** `formSlots` renders a callout, a preview or a pair of custom controls as a full-width row inside a section, so it inherits the card, the separators and the padding instead of floating beside them:

```tsx
formSlots={[
  { id: "vat-hint", after: "vatNumber", render: () => <Alert>We validate this with HMRC.</Alert> },
  { id: "map", group: "Address", render: (ctx) => <MiniMap postcode={ctx.row.postcode} /> },
]}
```

`after` places a slot under that field, in that field's own section. `group` names a section and puts it at the end. Neither means the end of the default section. `render` gets the same context as an action, so a slot can read the live draft.

Slots are a prop on the form, not entries in `fields`, and that is deliberate: `fields` is the data contract that drives the table, the filter panel and import/export as well as the form, so arbitrary markup in it would leak layout into all four.

**`fullWidth` on a field** gives it the whole row: the label sits above a full-width control instead of beside it. Use it for a long textarea, an address block, or a `renderInput` that needs the space.

**Behaviour is config too.** `behaviour` holds what components *do*, as opposed to how they look, and every key replaces something that used to be hard-coded: `rowClick` (`"view" | "edit" | "none"`, what clicking a record's name does), `closeOnSave`, `flashMs` (the saved-row highlight; `0` turns it off), `confirmDelete`, `confirmDiscardWhenDirty`. Set it app-wide on the provider or per table with `behaviour={{ … }}` on `RecordView`.

**Let the people using the app change some of it.** Pass `userConfigurable` and those keys become theirs, saved per browser and merged over your config:

```tsx
<VuiProvider userConfigurable={{ behaviour: ["rowClick", "flashMs", "confirmDelete"] }}>
```

Nothing is user-editable unless it is listed, which is the point: "the user prefers no row highlight" is a feature, "the user can move the Save button" is chaos. Build the settings UI from `useVuiPreferences()`, which gives you `preferences`, `userConfigurable`, `setPreference(section, key, value)` and `reset()`. A key that isn't listed is ignored on write, so a stale stored value can't leak back in. Reference: the backoffice Settings page, *Data tables* section.

**Saving against a server: return a promise from `onDataChange`.** It fires on
every add, edit, delete and restore, in `manual` and `fetcher` mode as well as
controlled mode, and it is where you write. Return the promise for that write
and RecordView waits for it before reloading, so the reload sees your change:

```tsx
onDataChange={async (rows) => { await api.save(rows); }}
```

Return nothing and the reload fires immediately, which races your POST and
repaints the rows the server had before it. That is what makes a save look like
it was ignored. In `manual` mode a returned promise also re-emits the current
query through `onQueryChange` once the write settles, so the page reloads itself.

For the form on its own URL, render the exported `RecordForm` on a route and use
controlled data (`data` + `onDataChange`) with `onCreate` / `onView` / `onEdit`
to navigate instead of opening the overlay. Breadcrumbs everywhere come from the
shared `@viliha/vui-ui/breadcrumbs` component.

---

# Charts

Build every chart with `ChartContainer` plus Recharts. Never hardcode chart colors; map them through the chart tokens.

---

# Multi-step wizards & form layout

**Wizard scaffold** (`@viliha/vui-ui/wizard`): `Wizard` + `WizardSection`. It's a **layout scaffold, not a data-driven form** — you own the step index, field state, and all logic; the scaffold gives the standard structure (stepper + scrolling body + Back/Next footer, and bordered section cards). Never hand-roll the frame or a bare `Steps` + `<div>`s.

- `Wizard` — pass `steps` (named steps → the stepper), `current` (your index), `onBack`/`onNext`, `nextDisabled`/`backDisabled`, and optional `nextLabel`/`backLabel` nodes (override the final step's button). Render the active step's body as children. `footer` replaces the whole footer; `hideFooter` drops it (e.g. a success screen).
- `WizardSection` — a bordered `title`/`icon`/`description` card. **A step can hold one or many** — stack several `WizardSection`s per step as the business logic needs.

**Two-column field layout** (`@viliha/vui-ui/field-grid`): `FieldGrid` + `Field` — the **form design standard**: two columns, `Label *` │ control on one row, labels left-aligned and sized to `max-content` (no dead space), aligned across rows. Wrap a section's fields in `<FieldGrid>` and give each `<Field label required hint htmlFor>` its own control. This is the same two-column standard as the filter panel (`filter-field`) and auth screens — use it for every wizard/section form; don't rebuild a label+control row or use a wide fixed label column.

---

# Authentication

The package ships an **auth contract**, not an auth engine. Bundling a provider
(NextAuth, Clerk, Better Auth, Supabase, …) would force its SDK and backend on
every consumer, so instead:

- `@viliha/vui-ui/auth-context` — `AuthProvider`, `useAuth()`, and the
  `AuthContract` / `AuthUser` / `Credentials` / `SignUpInput` types. Screens
  depend on this; you supply an **adapter** that implements it for your
  provider. Swapping providers is one adapter file, no screen changes.

```tsx
import { AuthProvider, useAuth } from "@viliha/vui-ui/auth-context";
<AuthProvider value={adapter}>{children}</AuthProvider>   // mount once
const { user, status, signIn, signOut } = useAuth();        // read anywhere
```

The auth **screens** (`AuthCard`, `AuthCardHeader`, `AuthCardBody`,
`AuthCardFooter`, `AuthCardAside`, `FieldGrid`, `Field`) remain a **demo pattern
in the reference app** (`apps/backoffice/app/_components/auth.tsx`) — copy and
adapt them; they are built from published primitives (`Button`, `Input`,
tokens). The reference app also ships a **Better Auth** adapter
(`app/_components/auth-provider.tsx`) with a mock fallback for the static demo.

Do not `import … from "@viliha/vui-ui/auth"`; no such entry point exists — the
contract is `@viliha/vui-ui/auth-context`. Wrap the forms in semantic HTML.

---

# shadcn/ui components

The shadcn/ui component set is being brought **into this package** (Radix-based,
restyled to VUI tokens) so you import them from `@viliha/vui-ui/<name>` instead of
running `shadcn add` and maintaining a local `components/ui/`. Shipped so far:

Batch 1:

- `@viliha/vui-ui/accordion` — `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `@viliha/vui-ui/label` — `Label`
- `@viliha/vui-ui/separator` — `Separator`
- `@viliha/vui-ui/skeleton` — `Skeleton`
- `@viliha/vui-ui/switch` — `Switch` (`size?: "sm" | "default"`)
- `@viliha/vui-ui/tabs` — `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

Batch 2 (overlays):

- `@viliha/vui-ui/alert` — `Alert`, `AlertTitle`, `AlertDescription` (`variant?: "default" | "destructive"`)
- `@viliha/vui-ui/alert-dialog` — `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` (Action/Cancel take VUI Button `variant`/`size`)
- `@viliha/vui-ui/collapsible` — `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
- `@viliha/vui-ui/hover-card` — `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
- `@viliha/vui-ui/popover` — `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`
- `@viliha/vui-ui/sheet` — `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose` (`side?: "top" | "right" | "bottom" | "left"`)

Batch 3 (form controls):

- `@viliha/vui-ui/textarea` — `Textarea` (auto-growing, `aria-invalid` styling)
- `@viliha/vui-ui/radio-group` — `RadioGroup`, `RadioGroupItem`
- `@viliha/vui-ui/slider` — `Slider` (array value → multiple thumbs / range)
- `@viliha/vui-ui/toggle` — `Toggle`, `toggleVariants` (`variant?: "default" | "outline"`, `size?: "default" | "sm" | "lg"`)
- `@viliha/vui-ui/toggle-group` — `ToggleGroup`, `ToggleGroupItem` (`type="single" | "multiple"`; group variant/size cascade to items)
- `@viliha/vui-ui/input-otp` — `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`

Batch 4 (overlays / data / misc):

- `@viliha/vui-ui/aspect-ratio` — `AspectRatio`
- `@viliha/vui-ui/breadcrumb` — `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis` (hand-composed; for route-derived app trails use the higher-level `Breadcrumbs`)
- `@viliha/vui-ui/calendar` — `Calendar` (react-day-picker; `mode="single" | "multiple" | "range"`)
- `@viliha/vui-ui/command` — `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut` (cmdk; **no `CommandDialog`** — use VUI's `command-palette` for a modal ⌘K menu)
- `@viliha/vui-ui/form` — `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField` (React Hook Form; validate with RHF `rules` or a zod resolver, both consumer-side)
- `@viliha/vui-ui/progress` — `Progress`
- `@viliha/vui-ui/scroll-area` — `ScrollArea`, `ScrollBar`
- `@viliha/vui-ui/sonner` — `Toaster` (follows the `.dark` class; no next-themes). `toast()` comes from `sonner`.

These use VUI's tokens automatically (no shadcn token duplication needed). More
components land in later batches; prefer the `@viliha/vui-ui/*` import over a local
shadcn copy. For anything not yet ported, you can still `shadcn add` it locally.

---

# Accessibility

Every page supports keyboard navigation, visible focus, ARIA attributes, screen readers, and WCAG AA contrast. Accessibility is never optional.

---

# Responsive Design

Design mobile first, then scale up cleanly through tablet, desktop, and large desktop. Avoid horizontal scrolling wherever you can.

---

# Performance

Default to Server Components, streaming, lazy loading, and dynamic imports. Avoid unnecessary client components, and memoize only when you've measured a need.

---

# UX Standards

Every feature communicates its current state: loading, success, empty, and error. Give long-running actions visible progress, and never leave users wondering what happened.

---

# Naming

Name things descriptively.

Good

```
OrganizationTable

InvoiceSummaryCard

UserSettingsForm

RevenueChart
```

Avoid

```
Card2

Widget

Thing

Data

Panel
```

---

# AI Development Rules

Before you write code, reuse what's already there (components, layouts, utilities, and variants), and extend an existing component before creating a new one. Never duplicate code or styling. Keep APIs simple and components focused.

**Any picker whose options come from an API must lazy-load them** via `loadOptions` / `resolveOption` (on a `Combobox`/`Select` `source`, or a `RecordField`/`FieldFilter`). Never fetch a reference catalog into a static `options` array on mount — that wastes requests when the user is only browsing. Resolve an already-set value's label from a single record, and use `dependsOn` (or `resetKey`) for cascades. This applies to every picker (form fields, filters, `/settings` dropdowns), not just datatables.

---

# Definition of Done

A feature is complete only when:

✓ Uses VUI components where appropriate.

✓ Uses semantic design tokens.

✓ Supports light and dark mode.

✓ Supports responsive layouts.

✓ Supports accessibility.

✓ Includes loading, empty, success, and error states.

✓ Keeps business logic outside UI components.

✓ Introduces no duplicated code.

✓ Introduces no duplicated styling.

✓ Passes lint and type checking.

✓ Is production ready.
