# Backoffice

Internal admin Next.js app for Vui Starter. Runs on port 3001.

## Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- shadcn/ui
- TanStack Table

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start dev server on port 3001        |
| `pnpm build`      | Production build                     |
| `pnpm start`      | Start production server on port 3001 |
| `pnpm lint`       | Lint sources                         |
| `pnpm check-types`| Type check                           |

## Routes

- `/` – landing page
- `/users` – TanStack Table demo

## Environment

Footer identity is configurable — copy `.env.example` to `.env.local` and edit.
All vars are optional (defaults keep the current notice) and read at build time:

| Variable                     | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_COMPANY_NAME`   | Company shown in the footer               |
| `NEXT_PUBLIC_COPYRIGHT_YEAR` | Copyright year                            |
| `NEXT_PUBLIC_LICENSE`        | License text                              |
| `NEXT_PUBLIC_FOOTER_NOTICE`  | Override the entire footer line (wins)    |

Wiring lives in `lib/seo.ts` (`FOOTER_NOTICE`), used by both app and auth layouts.
