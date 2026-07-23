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
| New admin page | `apps/backoffice/app/(app)/<route>/page.tsx` — copy the page template from docs `/layout`. **Ask which add/edit layout** (see "Adding a record page" below); default to **slide-over**. |
| New auth page | `apps/backoffice/app/auth/<name>/page.tsx` |
| shadcn component | `npx shadcn@latest add <name>` (from the backoffice dir) → `components/ui/` |
| Design token / color / radius | `packages/ui/src/theme.css` — **never hard-code**, add/read a token |
| Navigation (sidebar + breadcrumbs) | `apps/backoffice/app/_components/nav-config.ts` — single source; breadcrumbs derive from it |

## Single sources of truth — never duplicate

- **Tokens/colors/typography/radius/dark-mode** → `theme.css`.
- **Navigation** → `nav-config.ts` (sidebar + breadcrumb trail both derive from it).
- **Page layout / section cards / dialogs / menus / datatable** → documented at docs `/layout` and `/data-table`. Reuse `Dialog`, `Menu`, `RecordView`, `ChartContainer` — don't re-implement.
- **`cn`** → `@viliha/vui-ui/utils`. `utils.ts` is intentional; do not "fix" it.

## Adding a record page

Two add/edit layouts, both from the same `RecordForm` — **pick one, don't invent a third:**

- **Slide-over (standard / default).** Add/edit opens as an overlay panel from `RecordView`. Nothing to configure — this is what you get by default. Use it unless asked otherwise. Example: `departments`.
- **Full-page route.** A dedicated `/new` (or `/edit`) route rendering `<RecordForm layout="page" columns={1|2} … />`. Use for long forms or when the add flow needs its own URL. Example: `organizations/new`.

Rule: when asked to add a page, **state which layout you're using and default to slide-over.** Both inherit the blue Save, the header/body/footer separators, and token colors from `RecordForm` — you never copy those styles, you get them by using the component. See the consumer guide `packages/ui/AGENT.md` ("Add / edit form") for the same rule downstream.

**From a field spec to a form — never style fields by hand.** A request like "Add Customer: Name (mandatory, text), Email (mandatory), Country" becomes a `RecordField[]` config, nothing more: `{ key, label, required: true }` per field. The component designs Add/Edit/View from that array — required renders the `*`, the label + icon + control are center-aligned on one baseline, and colors come from theme tokens. Do **not** add per-field className, padding, or color; if a field looks unstyled, you built a raw input instead of feeding `fields`.

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

## Verify before "done" (must pass)

```bash
pnpm --filter @viliha/vui-ui check-types
pnpm --filter backoffice lint            # eslint --max-warnings 0
pnpm --filter backoffice build           # or the app you changed
pnpm --filter @viliha/vui-ui test      # if you changed testable logic
```

## Git conventions

- Author is **Suman Bonakurthi**. Do **not** add a Claude/AI co-author trailer or attribution.
- Small, focused commits with imperative messages (`feat(ui): …`, `fix(backoffice): …`).
- Branch off `main`; open a PR using `.github/PULL_REQUEST_TEMPLATE.md`.

## Performance defaults

- Route-splitting is automatic — a heavy dep only loads on routes that import it.
- `next/dynamic` for heavy/client-only widgets (charts, command palette).
- Memoize only measured hot paths; keep `"use client"` small; fonts via `next/font`; images via `next/image`.
- Virtualize tables before rendering thousands of rows.
