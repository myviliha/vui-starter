# Using VUI in your project (AI agent guide)

> **Audience:** developers — and their AI agents — **consuming** `@viliha/vui-ui`
> in a downstream app. This file ships with the npm package. To auto-load these
> rules, copy the ready-made pointer to your project root — it `@`-imports this
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

You are a frontend architect building enterprise applications on **VUI Starter**. Your job is to ship apps that are consistent, maintainable, accessible, and production-ready by leaning fully on the VUI Design System. Don't reinvent the framework — build with it.

> **What you get from the package vs. what to copy.** `@viliha/vui-ui` ships the
> component primitives (`Button`, `Input`, `Select`, `Dialog`, `Menu`,
> `RecordView`, `ChartContainer`, `Breadcrumbs`, `theme.css`, …). App-shell
> patterns referenced below — `SetPageTitle`, the sidebar, and the `AuthCard*`
> auth screens — are **reference-app patterns**, not package exports.
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

Before you create anything, search for what already exists — a VUI component, a page pattern, a layout, a variant, or a utility. Never duplicate functionality VUI already provides.

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
   `apps/web` — turbo scaffolds into that app directory)
1. **Fresh project?** (`--fresh` / `--existing`)
2. **Pre-built theme?** (`--prebuilt` = shell + demo pages / `--theme-only` = just
   the theme wiring you configure)

For a fresh app, create it **without `--src-dir`** (the scaffold uses a root
`app/` + `@/*` → `./*` and writes `next.config.ts`). `init` **auto-installs the
dependencies** with the package manager it detects from the lockfile (npm / pnpm
/ yarn / bun); `--yes` skips the prompt, `--no-install` skips installing.

- **fresh + prebuilt** → full runnable app (config + shell + demo).
- **fresh + theme-only** → just `globals.css` + `next.config` wiring; build your own.
- **existing + prebuilt** → shell + demo added; config **never** overwritten —
  prints the merge steps (`transpilePackages`, the `theme.css` import, the `@/*`
  alias, `import "./globals.css"`).
- **existing + theme-only** → nothing copied; prints the wiring steps.

Other flags: `--yes` / `--force` / `--dry-run`. If you only need the components, pass
`--theme-only` (or skip `init` entirely) and follow the setup below.

### Inside a Turborepo / monorepo

**Never scaffold into the repo root** — a monorepo root has no `app/` and no Next
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

- **New standalone app** — `npx create-next-app@latest my-app --ts --tailwind
  --app --no-src-dir --use-npm`, then `cd my-app && npx @viliha/vui-ui init`
  (fresh + prebuilt). It scaffolds config + shell + demo, installs deps, and you
  run `npm run dev` → `/dashboard`.
- **New app in a monorepo** — scaffold your app under `apps/<name>` (e.g. with
  `create-next-app`), then from that app dir run `npx @viliha/vui-ui init` (or
  `--turbo --dir apps/<name>` from the root) and install deps in that app.
- **Existing app** — run `npx @viliha/vui-ui init --existing`. It never
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

When you bump `@viliha/vui-ui`, follow these steps — the package version and the
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
   build/dts step — just restart the dev server. If a new version adds a peer
   dependency, install it (the CHANGELOG and the "Module not found" error name it).
4. **Scaffolded files are yours.** `init` copies the shell and demo pages into
   the repo once; upgrading the package does **not** touch them. To pull
   scaffolder improvements into an existing project, preview first with
   `npx @viliha/vui-ui@latest init --dry-run`, then re-run with `--force` (commit
   or stash your work first so you can review the diff) or copy in just the files
   you want.
5. **Re-check token overrides.** If you overrode any `theme.css` tokens, confirm
   they still line up after the upgrade.
6. **Verify** before you commit: run type-check, lint, and build.

---

# Design Tokens

VUI is entirely token-driven. Never hardcode colors, spacing, radius, typography, shadows, or borders — reach for the semantic design token instead. For example: `--button-primary`, `--button-primary-hover`, `--background`, `--foreground`, `--border`, `--ring`, `--chart-1`, `--sidebar-primary`.

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

Navigate with the three provided pieces — breadcrumbs, sidebar, and top navigation. Don't build a custom navigation system unless the project explicitly demands one.

## Breadcrumbs

One trail, **derived from the route — never hand-written per page.**

- Render with the shared `Breadcrumbs` component (`@viliha/vui-ui/breadcrumbs`):
  last crumb is the current page (bold, non-interactive), earlier crumbs are
  links, chevron separators.
- Build the trail from the URL against a single nav config (copy `crumbsFor` +
  `nav-config` + `route-meta` from the reference app). Root it at **Home**
  (your dashboard route). A section/group parent has no page of its own, so its
  crumb links to its **first child** — clicking a section lands on that
  section's first page.
- Ship **one** landing page, labeled "Home". Don't split "Home" and "Dashboard"
  into two routes.

To reorder or rename, edit the nav config; the trail follows automatically.

## Sidebar: sections & collapsible groups

The sidebar is driven by one `NAV` config (copy `nav-config.ts`). There are
**two grouping shapes — use them, don't invent a third:**

- **Section** (`NavSection`, `{ title?, items }`) — a top-level band with an
  optional `title` heading. Items are **always visible** (no collapse). Use it to
  cluster related pages under a label (e.g. *Records*, *System*). The first
  section usually has no title.
- **Collapsible group** (`NavGroup`, an entry with `children`) — a parent row with
  a chevron that **hides/unhides** its nested links; it auto-opens when a child is
  the active route. Use it for a set of sub-pages under one parent (e.g. *Auth*,
  *CRM*, *System*) to keep the sidebar short. A group parent has no page of its
  own — its breadcrumb points at its first child.

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
`route-meta.ts` — the sidebar, breadcrumbs, and tabs all derive from these.

## Open tabs (keep-alive)

Enterprise apps keep several pages open at once. The reference app ships a
browser-style **tab strip** under the top bar — a reference-app pattern (copy
`open-tabs.tsx`), not a package export. **This is a first-class feature; wire it
in — a fresh install won't have it.**

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

- Labels/icons/colors derive from `nav-config.ts` + `route-meta.ts` — no per-tab wiring.
- The list persists in `sessionStorage`, capped by `NEXT_PUBLIC_MAX_TABS`
  (default 5; oldest FIFO-evicted with a warning).
- Tabs are drag-reorderable and right-click-taggable with one of seven colors.
- ⌘/Ctrl-click a nav item opens a **background tab**; call
  `useOpenTabs().openTab(href, { background: true })` for custom "open in new tab"
  buttons. `tabKey` normalizes trailing slashes so `/foo` and `/foo/` are one tab.

Keep-alive relies on a static-export (all-client) shell. If your app renders
server components per route, either adopt the demo's static-export shell or fall
back to a plain navigation-tab model (router push per tab) — the strip,
persistence, and nav-config wiring stay identical.

---

# Forms

Build forms with VUI and shadcn/ui together, reaching for shadcn Form, React Hook Form, and Zod. Every form handles the full lifecycle — validation, loading, success, error, disabled, and keyboard navigation. Never use a placeholder in place of a label.

---

# Tables

Never hand-build an HTML table — always use `RecordView`. Configure columns through its field props (`editable`, `required`, `copyable`, `options`, `render`), and let `RecordView` own the rest: sorting, filtering, pagination, bulk actions, and import/export.

## Add / edit form

The buffered add/edit form renders in one of two layouts:

- **Slide-over panel** — the default; nothing to configure.
- **Full-page form** — set `formMode="page"` (with `formColumns={1 | 2}`). Add
  `formDescription` and a per-field `description` to show an AWS-style help
  panel beside the form.

For the form on its own URL, render the exported `RecordForm` on a route and use
controlled data (`data` + `onDataChange`) with `onCreate` / `onView` / `onEdit`
to navigate instead of opening the overlay. Breadcrumbs everywhere come from the
shared `@viliha/vui-ui/breadcrumbs` component.

---

# Charts

Build every chart with `ChartContainer` plus Recharts. Never hardcode chart colors — map them through the chart tokens.

---

# Authentication

The auth screens are a **demo pattern in the reference app**, not exports of the
`@viliha/vui-ui` package. `AuthCard`, `AuthCardHeader`, `AuthCardBody`,
`AuthCardFooter` and `AuthCardAside` live in
`apps/backoffice/app/_components/auth.tsx` — **copy and adapt them** into your
app (they are built from published primitives: `Button`, `Input`, tokens).

Do not `import … from "@viliha/vui-ui/auth"` — no such entry point exists.

Wrap the forms in semantic HTML.

---

# shadcn/ui Integration

VUI and shadcn/ui complement each other, so split the work along their strengths. Reach for shadcn for forms, dialogs, sheets, tabs, popovers, and accordions; reach for VUI for layouts, `RecordView`, enterprise components, charts, and navigation patterns.

VUI owns the design tokens — delete any duplicate token definitions shadcn generates.

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

Every feature communicates its current state — loading, success, empty, and error. Give long-running actions visible progress, and never leave users wondering what happened.

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

Before you write code, reuse what's already there — components, layouts, utilities, and variants — and extend an existing component before creating a new one. Never duplicate code or styling. Keep APIs simple and components focused.

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
