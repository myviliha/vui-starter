# VUI Starter

A frontend monorepo starter built around a reusable **CRM-style design system**.
It ships an admin **backoffice** app with a full record UI (editable tables,
resizable columns, kanban board, detail panels, command menus), a small
**public** app, and a **documentation** app — all sharing one component library
(`@repo/ui`).

Everything runs on in-memory **mock data**, so you can clone and run it with zero
backend setup. Swap the mock data in `apps/web/backoffice/lib/*` for a real API
when you're ready.

## Tech stack

- **Next.js 16** (App Router) · **React 19**
- **Tailwind CSS v4** · shadcn-style components · **lucide-react** icons
- **TanStack Table v8**
- **pnpm 9** workspaces · **Turborepo**
- **TypeScript 5.9** · ESLint 9 (zero-warning)

## Workspace layout

```
apps/
  web/
    backoffice/        # Admin app — the CRM design system demo (port 3002)
    public/            # Public marketing/demo app (port 3001)
  docs/
    documentation/     # Docs app (port 5000)
packages/
  ui/                  # @repo/ui — shared component library (RecordView, etc.)
  eslint-config/       # @repo/eslint-config
  typescript-config/   # @repo/typescript-config
```

## Getting started

Prerequisites: **Node ≥ 18** and **pnpm 9** (`corepack enable` will provide it).

```bash
# 1. Install dependencies for every workspace
pnpm install

# 2. Start all apps in dev mode
pnpm dev
```

Then open:

| App           | URL                     |
| ------------- | ----------------------- |
| Backoffice    | http://localhost:3002   |
| Public        | http://localhost:3001   |
| Documentation | http://localhost:5000   |

### Run a single app

```bash
pnpm dev --filter=backoffice      # or: public, documentation
```

## Useful scripts

Run from the repo root (Turborepo orchestrates every workspace):

```bash
pnpm dev            # start all apps
pnpm build          # production build
pnpm lint           # eslint (max-warnings 0)
pnpm check-types    # next typegen + tsc --noEmit
pnpm format         # prettier
```

Scope any script to one app with `--filter=<name>` (e.g. `pnpm build --filter=backoffice`).

## What's inside the backoffice

The backoffice app showcases the shared design system:

- **Record tables** with inline edit, add / delete / duplicate rows, drag-to-reorder,
  resizable columns, per-column sort/filter/visibility, pagination, and hover
  row actions (open / copy / edit).
- **Record detail** side panels (full-screen on mobile).
- **Opportunities kanban board** with drag-and-drop between stages.
- **Collapsible, resizable sidebar** with nested nav sections; on mobile it
  becomes a bottom bar + full-width drawer.
- Light/dark themes, a shared 12px type scale, and a trust-blue brand palette.

All of it is driven by `RecordView` in `@repo/ui`, configured per entity in each
page's `*-table.tsx`.

## License

MIT — see [LICENSE](./LICENSE).
