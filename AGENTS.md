# AGENTS.md

Deterministic rules for AI agents working in this repo. Read this first. For the
rationale, see [`Enterprise_NextJS_React_Coding_Standards.md`](./Enterprise_NextJS_React_Coding_Standards.md).

## What this repo is

Turborepo + pnpm monorepo. Two apps + one published library:

- `apps/backoffice` — Admin app, dev on **:3000**.
- `apps/docs/documentation` — Docs site, dev on **:3001**.
- `packages/ui` — `@viliha/vui-ui`, shipped as **TypeScript source** (no build).

## Where things go (do exactly this)

| Task | Location |
| --- | --- |
| New reusable component | `packages/ui/src/<name>.tsx` → auto-exported as `@viliha/vui-ui/<name>` (the `./*` export map; **no barrel edit needed**) |
| New admin page | `apps/backoffice/app/(app)/<route>/page.tsx` — copy the page template from docs `/layout` |
| New auth page | `apps/backoffice/app/auth/<name>/page.tsx` |
| shadcn component | `npx shadcn@latest add <name>` (from the backoffice dir) → `components/ui/` |
| Design token / color / radius | `packages/ui/src/theme.css` — **never hard-code**, add/read a token |
| Navigation (sidebar + breadcrumbs) | `apps/backoffice/app/_components/nav-config.ts` — single source; breadcrumbs derive from it |

## Single sources of truth — never duplicate

- **Tokens/colors/typography/radius/dark-mode** → `theme.css`.
- **Navigation** → `nav-config.ts` (sidebar + breadcrumb trail both derive from it).
- **Page layout / section cards / dialogs / menus / datatable** → documented at docs `/layout` and `/data-table`. Reuse `Dialog`, `Menu`, `RecordView`, `ChartContainer` — don't re-implement.
- **`cn`** → `@viliha/vui-ui/utils`. `utils.ts` is intentional; do not "fix" it.

## Hard rules

1. **Server Components by default.** Add `"use client"` only for hooks, event handlers, browser APIs, or interactive Radix/cmdk. Keep the boundary on the smallest leaf.
2. **Strict TypeScript. No `any`** (use `unknown` + narrowing). Export public types with their component.
3. **No hard-coded design values** — use theme tokens / shared components.
4. **No new dependency** for what a few lines can do. Prefer stdlib/native/existing deps.
5. **Follow the page pattern:** `flex h-full flex-col` → action header with `<Breadcrumbs/>` → content `min-h-0 flex-1 overflow-y-auto` → `flex flex-col gap-4 p-4`. Content padding is always `p-4`/`gap-4`.
6. **Datatables:** use `RecordView` (`@viliha/vui-ui/record-view`) with a `fields` array; don't build tables by hand. See docs `/data-table`.
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
