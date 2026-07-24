# AGENTS.md

Deterministic rules for AI agents working in this repo. Read this first. For the
rationale, see [`Enterprise_NextJS_React_Coding_Standards.md`](./Enterprise_NextJS_React_Coding_Standards.md).

## What this repo is

Turborepo + pnpm monorepo. One app + one published library:

- `apps/backoffice` — Admin app **and** the docs site (docs are routes under `app/docs`, served at `/docs`). Dev on **:3000**.
- `packages/ui` — `@viliha/vui-ui`, shipped as **TypeScript source** (no build).

## Where things go (do exactly this)

| Task | Location |
| --- | --- |
| New reusable component | `packages/ui/src/<name>.tsx` → auto-exported as `@viliha/vui-ui/<name>` (the `./*` export map; **no barrel edit needed**) |
| New admin page | `apps/backoffice/app/(app)/<route>/page.tsx` — copy the page template from docs `/layout`. **Pick a page type** (see "Page types" below) and state which; for a record form default to **slide-over**. |
| New auth page | `apps/backoffice/app/auth/<name>/page.tsx` |
| shadcn component | `npx shadcn@latest add <name>` (from the backoffice dir) → `components/ui/` |
| Design token / color / radius | `packages/ui/src/theme.css` — **never hard-code**, add/read a token |
| Navigation (sidebar + breadcrumbs) | `apps/backoffice/app/_components/nav-config.ts` — single source; breadcrumbs derive from it |

## Single sources of truth — never duplicate

- **Tokens/colors/typography/radius/dark-mode** → `theme.css`.
- **Navigation** → `nav-config.ts` (sidebar + breadcrumb trail both derive from it).
- **Page layout / section cards / dialogs / menus / datatable** → documented at docs `/layout` and `/data-table`. Reuse `Dialog`, `Menu`, `RecordView`, `ChartContainer` — don't re-implement.
- **`cn`** → `@viliha/vui-ui/utils`. `utils.ts` is intentional; do not "fix" it.

## Page types

There are **five** page shapes — **pick the one the requirement calls for, don't invent a sixth.** State which type you're building. Visuals + full structure at docs `/layout` ("Page types").

| # | Type | Build with | Example route | Use when |
| --- | --- | --- | --- | --- |
| 1 | **Data table** | `RecordView` + a `fields` array (thin server `page.tsx` → client `*-table.tsx`) | `organizations`, `branches`, `departments` | Any list of records |
| 2 | **Record form** (Add / Edit / View) | `RecordView`/`RecordForm` from the same `fields` | slide-over: `branches`; full-page: `organizations/new` | Create/edit/view a record |
| 3 | **Dashboard** | manual frame: `StatCard` grid + bordered-card sections | `dashboard` | An overview / landing screen |
| 4 | **Settings (single-form)** | one bordered card of `Section`s + a fixed Save footer | `settings` | "A form with a Save button," not a list |
| 5 | **Board (Kanban)** | `overflow-x-auto` row of fixed-width column sections | `crm/opportunities` | Stage/status pipelines |

Types 3–5 use the standard page frame (`flex h-full flex-col` → action header with `<Breadcrumbs/>` → scrolling `p-4` content). Client pages (3–5) put their `metadata` in a sibling `layout.tsx` (they can't `export const metadata`).

### Record form — two variants (type 2)

Both come from the same `RecordForm`; **pick one, don't invent a third:**

- **Slide-over (standard / default).** Add/edit/view open as an overlay panel from `RecordView`. Nothing to configure. Uncontrolled (`initialData`). Example: `departments`.
- **Full-page route.** `formMode="page"` + dedicated `/new` & `/edit` routes rendering `<RecordForm layout="page" columns={1|2} … />`; controlled, config shared via `*-config.tsx`. Adds a breadcrumb bar, a **dynamic Info panel** (from `formDescription` + per-field `description`), and a fixed Save/Cancel footer. Use for long forms or when the flow needs its own URL. Example: `organizations/new`.

When asked to add a page, **state which variant and default to slide-over.** Both inherit the blue Save, header/body/footer separators and token colors from the component — you never copy those styles. Same rule downstream in `packages/ui/AGENT.md`.

**From a field spec to a form — never style fields by hand.** A request like "Add Customer: Name (mandatory, text), Email (mandatory), Country" becomes a `RecordField[]`, nothing more: `{ key, label, required: true }` per field (add `description` for the Info-panel help). The component designs Add/Edit/View from that array — required renders the `*`, the label + icon + control are center-aligned on one baseline, colors come from theme tokens. Do **not** add per-field className, padding, or color; if a field looks unstyled, you built a raw input instead of feeding `fields`.

## Command palette (Quick actions & Global search)

Two ⌘K palettes, **both the same headless `CommandPalette`** (`@viliha/vui-ui/command-palette`) — never hand-roll a search dropdown:

- **Quick actions** (`⌘K` / `/`) → navigates **pages**; actions derived from `nav-config.ts`. Wiring: `app/_components/quick-actions.tsx`.
- **Global search** (`⌘⌥K`) → searches **records**; index built from the data modules. Wiring: `app/_components/global-search.tsx`.

Each is a provider (open state + a `keydown` effect, told apart by `e.altKey`) mounting `CommandPalette` with a `CommandAction[]` (`{ id, label, group?, icon?, keywords?, onSelect }`). To add a searchable source, push more actions — for real data, swap the demo record index for API results. Docs + examples at `/layout`.

## Sidebar sections & groups

The sidebar is driven by `nav-config.ts` (`NAV: NavSection[]`). **Two grouping shapes — use them, don't invent a third:** a **Section** (`NavSection`, `{ title?, items }`) is a top-level band with an optional `title` heading whose items are always visible (static, no collapse — e.g. *Records*, *System*; the first section usually has no title); a **collapsible group** (`NavGroup`, an entry with `children`) is a parent row with a chevron that **hides/unhides** its nested links and auto-opens when a child is active (e.g. *Auth*, *CRM*, *System*) — use it to keep the sidebar short. A group parent has no page of its own, so its breadcrumb points at its first child (see `SECTION_INDEX`). When adding a page, add it to `NAV` and mirror its color in `route-meta.ts`; default to an existing Section and only add a Group when nesting several related sub-pages. Full write-up at docs `/navigation`.

## Open tabs

A browser-style strip of opened pages (labelled "Tabs") lives in the shell: `OpenTabsProvider` + `<TabStrip/>` + `<KeepAliveTabs/>` in `app/_components/open-tabs.tsx`, mounted once in `(app)/layout.tsx`. **Keep-alive**: every open page stays mounted (inactive hidden) so switching is instant with no remount/flash and preserved state; new routes mount on first visit. The list persists in `sessionStorage`, capped by `NEXT_PUBLIC_MAX_TABS` (default 5, FIFO-evict oldest + warn). Tab identity is normalized via `tabKey` (trailingSlash-safe). Labels/icons/colors derive from `nav-config.ts` + `route-meta.ts` (no per-tab wiring). Tabs are **drag-reorderable** (FLIP-animated) and **right-click-taggable** with one of seven color labels (order + colors persisted). ⌘/Ctrl-click a sidebar item opens a background tab; for a custom "open in new tab" call `useOpenTabs().openTab(href, { background: true })`. Keep-alive works because the app is a static export (all client at runtime).

## Multi-step wizards

For guided flows (registration, onboarding, checkout) use the exported `Steps` indicator (`@viliha/vui-ui/steps`) + your own step index — never hand-roll a stepper. Build each step's body from `Input`/`Select`/`Field` in a section card with a Back/Next footer. Reference: `app/register-business/`. See docs `/layout` ("Multi-step wizard") and the workflow requirement template at `/docs/templates`.

## Breadcrumbs

One trail, **route-derived, never hand-written per page.** Two layers:

- **Design** → the shared `Breadcrumbs` component (`@viliha/vui-ui/breadcrumbs`). Last crumb = current page (bold, non-interactive); earlier crumbs are links; chevron separators; optional back arrow. Never build a trail from raw `<a>`/`<span>`.
- **Logic** → `crumbsFor(pathname)` in `app/_components/route-meta.ts`, driven by `nav-config.ts`. The trail is computed from the URL:
  - always rooted at **Home** (`/dashboard`);
  - one crumb per path segment; label from `SEGMENT_LABELS`, else Title-cased;
  - a section/group parent has no index page, so `SECTION_INDEX` (auto-derived from `NAV`) points its crumb at its **first child** — clicking `System` lands on the first System page. This is the standard; keep it.
  - the last segment is the current page (non-interactive).

To change the trail, edit `nav-config.ts` (structure/order) and the label/color maps in `route-meta.ts`; breadcrumbs follow automatically. A one-off page may pass an explicit `crumbs` array to the shared component (as `RecordForm` does for "Create new …"), but the default is always route-derived — never re-implement the deriver per page.

**Landing page:** ship exactly one, at `/dashboard`, labeled "Home" (sidebar first item + breadcrumb root). Do **not** add a separate `/home`. Add a "Dashboards" section only when multiple dashboards are actually needed.

## Hard rules

1. **Server Components by default.** Add `"use client"` only for hooks, event handlers, browser APIs, or interactive Radix/cmdk. Keep the boundary on the smallest leaf.
2. **Strict TypeScript. No `any`** (use `unknown` + narrowing). Export public types with their component.
3. **No hard-coded design values** — use theme tokens / shared components.
4. **No new dependency** for what a few lines can do. Prefer stdlib/native/existing deps.
5. **Follow the page pattern:** `flex h-full flex-col` → action header with `<Breadcrumbs/>` → content `min-h-0 flex-1 overflow-y-auto` → `flex flex-col gap-4 p-4`. Content padding is always `p-4`/`gap-4`.
6. **Datatables & record forms:** use `RecordView`/`RecordForm` (`@viliha/vui-ui/record-view`) with a `fields` array; never hand-roll a table **or** an add/edit form. This is what enforces the design — the blue primary `Save` (`--button-primary`), the section-header / body / footer separators, and the field-icon accent all come from the component. A hand-built `<form>` gets none of it. See docs `/layout` and `/data-table`.
7. **Lists/menus:** use `Menu`/`MenuItem` (bordered-row standard) or the shared `Dropdown`/`Select`; don't hand-roll list borders.
8. **Icons:** Radix Icons (`@radix-ui/react-icons`) for app chrome; leave shadcn's internal Lucide icons as-is.
9. **Comment deliberate no-ops** (e.g. clipboard/storage `catch`). Never silently swallow errors elsewhere.
10. **Changelog + docs on every change (mandatory — see below).** No feature or fix is "done" until the changelog and the relevant docs are updated in the same change.

## Changelog & docs — mandatory on every change (never skip)

Any change that adds, changes, removes, or fixes behaviour **must** update the docs in the **same commit/PR**. This is not optional and cannot be deferred:

1. **`packages/ui/CHANGELOG.md`** — add an entry under the target version (Added / Changed / Fixed / Removed), Keep-a-Changelog style. If the change ships in the npm package (`packages/ui/**` — components, `theme.css`, `AGENT.md`, `README.md`, `bin/`, `template/`), also **bump `packages/ui/package.json`** per semver (patch = fix, minor = feature, major = breaking).
2. **Every doc surface that describes the thing** — keep them in sync (they are single sources, don't let them drift):
   - `packages/ui/README.md` (npm-facing) and `packages/ui/AGENT.md` (consumer agent guide) for anything user/consumer-facing.
   - the docs site under `apps/backoffice/app/docs/**` (the matching page, and `components/docs-shell.tsx` nav + `DocPager` prev/next if you add a page).
   - the reference/agent docs (`README.md`, `CONTRIBUTING.md`, this `AGENTS.md`) when the workflow or rules change.
   - requirement templates in `apps/backoffice/public/templates/**` when a page/feature pattern changes.
3. **A new `init` scaffolder feature or new demo page** must also be reflected in the shipped `template/` (it regenerates from `apps/backoffice` on publish) and documented in `AGENT.md` + the docs.

If you're unsure whether a doc applies, it does — update it. A change that touches code but no docs/changelog is incomplete.

## Verify before "done" (must pass)

```bash
pnpm --filter @viliha/vui-ui check-types
pnpm --filter backoffice lint            # eslint --max-warnings 0
pnpm --filter backoffice build           # or the app you changed
pnpm --filter @viliha/vui-ui test      # if you changed testable logic
```

Plus (not optional): the **CHANGELOG + docs update** from the "Changelog & docs" rule above, and a `packages/ui` version bump if the change ships in the package.

## Git conventions

- Author is **Suman Bonakurthi**. Do **not** add a Claude/AI co-author trailer or attribution.
- Small, focused commits with imperative messages (`feat(ui): …`, `fix(backoffice): …`).
- Branch off `main`; open a PR using `.github/PULL_REQUEST_TEMPLATE.md`.

## Performance defaults

- Route-splitting is automatic — a heavy dep only loads on routes that import it.
- `next/dynamic` for heavy/client-only widgets (charts, command palette).
- Memoize only measured hot paths; keep `"use client"` small; fonts via `next/font`; images via `next/image`.
- Virtualize tables before rendering thousands of rows.
