# Enterprise Next.js & React Coding Standards

Standards for the **Vui Starter** monorepo. This is the human-facing rationale;
for the terse, deterministic rules an AI agent should follow, see
[`AGENTS.md`](./AGENTS.md).

## Core Principles

- Organize by **feature/domain**, not file type.
- One responsibility per component; keep components focused.
- Prefer **Server Components**; reach for `"use client"` only when required (see below).
- Strict TypeScript, no `any`.
- Separate business logic from presentation.
- One source of truth per concern (tokens, nav, patterns).
- Enforce consistency with lint, typecheck, and review.
- Readability and simplicity over cleverness and premature abstraction.

## Project Structure (this repo)

This is a **Turborepo + pnpm** monorepo. `@myviliha/vui-ui` ships as **TypeScript
source** (no build step) — the consuming app transpiles it.

```text
apps/
  web/backoffice/        # Admin app (:3000) — the design system in a real app
    app/
      (app)/             # Authenticated shell: sidebar + top bar + footer
      auth/              # /auth/* — sign-in, sign-up, forgot/reset, verify
      _components/       # App-only chrome (sidebar, top-bar, breadcrumbs, nav-config…)
      layout.tsx         # Root layout; app/(app)/layout.tsx is the shell
    components/ui/       # shadcn/ui components (added via the CLI)
    lib/                 # utils (cn re-export), mock data
  docs/documentation/    # Docs site (:3001)
packages/
  ui/                    # @myviliha/vui-ui — the published component library (source)
    src/                 # one file per component, auto-exported via "./*"
  eslint-config/         # shared ESLint
  typescript-config/     # shared tsconfig
```

**Rules**
- New reusable component → `packages/ui/src/<name>.tsx` (auto-exported as `@myviliha/vui-ui/<name>` via the `./*` export map — no manual barrel edit).
- New app page → `apps/web/backoffice/app/(app)/<route>/page.tsx`, following the page template documented at docs **`/layout`**.
- Do **not** introduce a `src/` root or move the package — the monorepo layout is intentional.

## Server vs Client Components

Default to **Server Components**. Add `"use client"` only when the file needs one of:
hooks (`useState`/`useEffect`/context), event handlers, browser APIs
(`localStorage`, `window`), or an interactive Radix/cmdk primitive.

- Necessarily client: `RecordView`, the shadcn forms, the sidebar, charts, theme toggle.
- Keep client boundaries **small**: push `"use client"` down to the leaf that needs it; keep pages/layouts server where possible.
- Never make a whole page client just to use one interactive child.

## Components

- Single responsibility; aim for **< 200 lines**.
- Split large pages into smaller components (co-locate in the route folder or `_components`).
- **Known exception:** `packages/ui/src/record-view.tsx` is a single cohesive
  widget (the datatable). It stays in one module but is internally decomposed
  (`RecordView`, `RecordDetailPanel`, cell renderers, `table-io` helpers). If a
  new concern is genuinely independent, extract it to its own file/hook rather
  than growing this one.

## TypeScript

- `strict` on; never use `any` (use `unknown` + narrowing).
- Prefer explicit `interface`/`type`; export public types alongside components
  (e.g. `RecordField`, `ChartConfig`).

## Data Fetching

- Server Components for server data; **TanStack Query** for client-side fetching.
- Keep API calls in dedicated modules (not inside components).
- This demo runs on in-memory mock data (`lib/*-data.ts`) — swap those modules for real API calls without touching the UI.

## Forms & Validation

- **React Hook Form** + **Zod** (`@hookform/resolvers/zod`), as shown on `/forms`.
- Inline errors via the shadcn `Form` primitives (`FormMessage`).

## State Management

- Local: `useState`. Shared/cross-component: React Context (see `PageChromeProvider`, `SidebarProvider`). Complex client state: Zustand (not yet needed here).

## Styling & Design System (single sources of truth)

- **Tailwind CSS v4** + **shadcn/ui**. All design tokens live in
  **`packages/ui/src/theme.css`** — change a token, the whole system follows.
  Never hard-code colors/radii; use tokens (`bg-background`, `text-foreground`, `--button-primary`, …).
- **Navigation** is defined once in `app/_components/nav-config.ts` (the sidebar
  and breadcrumbs both derive from it).
- **Layout, section, dialog, menu, and datatable patterns** are documented at
  docs **`/layout`** and **`/data-table`** — follow them so new screens inherit the design.
- **Naming exception:** `utils.ts` exists on purpose — it re-exports `cn` and is
  the public `@myviliha/vui-ui/utils` entry. Do not "fix" it. (The general
  "avoid `utils.ts`/`helpers.ts` dumping grounds" rule still applies elsewhere.)

## Imports

- Absolute imports (`@/…`); no deep `../../..` chains.
- Import library components from their entry point: `@myviliha/vui-ui/<name>`.

## Error Handling

- Always handle loading and error states in data-driven UI.
- Never silently swallow exceptions. Deliberate no-ops (e.g. clipboard/storage in
  a private-mode `catch`) must carry a comment explaining why.

## Performance

Next's App Router already **route-splits** bundles, so a heavy dependency only
loads on the routes that import it (recharts is only in `/charts`; cmdk only in
`/components` + `/forms`). Beyond that:

- **`next/dynamic`** for heavy, below-the-fold, or client-only widgets (charts,
  command palette) to defer their JS within a route. Use a lightweight fallback.
- **Virtualize** large lists/tables. `RecordView` renders all rows today — add
  windowing (e.g. `@tanstack/react-virtual`) before shipping thousands of rows.
- **Memoize deliberately, not reflexively:** `useMemo`/`useCallback`/`React.memo`
  only where profiling shows a hot path (e.g. `RecordView`'s `processed` and
  `columnAligns` are memoized). Don't wrap everything.
- **Keep `"use client"` boundaries small** — every client component ships JS.
- Fonts via **`next/font`** (already wired: Inter + JetBrains Mono, no layout shift).
- Images via **`next/image`** (sizing, lazy-loading, formats).
- Route-level **`loading.tsx`** + `Suspense` for streaming; the top-bar route
  progress bar already gives navigation feedback.
- Measure before optimizing: `@next/bundle-analyzer` for bundle size; React
  DevTools Profiler for renders. Optimize the measured hot path, nothing else.

## Accessibility

- Labels tied to controls (`htmlFor`/`id`), `aria-*` on custom widgets, keyboard
  operability (Escape/arrow keys on menus/dialogs). The `jsx-a11y` lint rules run
  in CI with `--max-warnings 0`.

## Testing

- Unit/logic: **Vitest**. Components: **React Testing Library**. E2E: **Playwright**.
- Start with pure logic (formatters, resolvers, io helpers) and critical widgets.
- `packages/ui` has a Vitest setup (`pnpm --filter @myviliha/vui-ui test`).

## Tooling

- **pnpm** workspaces + **Turborepo**. **ESLint** (shared config, `--max-warnings 0`).
  Prettier/Biome for formatting. Husky + lint-staged for pre-commit (optional).

## Verify gate (run before "done")

```bash
pnpm --filter @myviliha/vui-ui check-types
pnpm --filter backoffice lint
pnpm --filter backoffice build          # or the app you touched
pnpm --filter @myviliha/vui-ui test     # if you changed testable logic
```

## Recommended Stack

| Area          | Recommendation             |
| ------------- | -------------------------- |
| Framework     | Next.js App Router         |
| Language      | TypeScript (strict)        |
| UI            | React 19 + Tailwind CSS v4 |
| Components    | shadcn/ui + `@myviliha/vui-ui` |
| Charts        | Recharts                   |
| Data Fetching | TanStack Query             |
| Validation    | Zod                        |
| Forms         | React Hook Form            |
| State         | Zustand (when needed)      |
| ORM / DB      | Prisma or Drizzle / PostgreSQL |
| Testing       | Vitest + RTL + Playwright  |

## Pull Request Checklist

- [ ] Matches the monorepo structure and page/section patterns
- [ ] Single responsibility; strong typing (no `any`)
- [ ] No duplicated logic; reuses tokens + shared components
- [ ] Business logic separated from UI
- [ ] Validation + error/loading states
- [ ] Accessibility (labels, aria, keyboard)
- [ ] `"use client"` only where required, boundaries kept small
- [ ] Tests added/updated for non-trivial logic
- [ ] Lint, typecheck, and build pass

## Guiding Principles

1. Readability over cleverness.
2. Consistency over personal preference.
3. Simplicity over abstraction (YAGNI).
4. Composition over inheritance.
5. Performance through measurement.
6. Build for maintainability.
