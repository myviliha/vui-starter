# @viliha/vui-ui

[![Sponsor @myviliha](https://img.shields.io/badge/Sponsor-%40myviliha-db61a2?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/myviliha)

## ❤️ Sponsoring is what keeps Vui free

Vui is an enterprise-grade admin & SaaS theme — the kind of thing that's usually
sold, not given away. We keep it free under MIT, and sponsors are what make that
possible.

The components, tokens, datatable, auth screens, and docs all take real time to
build and keep in good shape. We give them away so you don't have to build or buy
your own — so if Vui saved you time or helped you ship, the best thank-you is to
sponsor the project.

**Even $1 helps.** It goes toward new components, bug fixes, and keeping the docs
and demo current — and, honestly, it's what keeps us building in the open. If a
fraction of the people using Vui chipped in, that would be plenty.

> Sponsors get a spot on the wall — name and logo — and our genuine thanks.

### 👉 [Sponsor on GitHub →](https://github.com/sponsors/myviliha) &nbsp;·&nbsp; thank you 🙏

---

A **token-driven React component library** for admin and CRM interfaces, built on
Tailwind CSS v4, shadcn-style patterns, and Radix Icons. It ships as **TypeScript
source** rather than a prebuilt bundle, so your app's bundler compiles only the
components you actually import.

It's part of [**Vui Starter**](https://github.com/myviliha/vui-starter), a free
and open-source admin design system.

- 🌐 **Live docs & demo:** [vui.viliha.com](https://vui.viliha.com) — a full, clickable backoffice app (datatables, forms, charts, auth) so you can see every component working before you install
- 📦 **Repository:** [github.com/myviliha/vui-starter](https://github.com/myviliha/vui-starter)
- ❤️ **Sponsor:** [github.com/sponsors/myviliha](https://github.com/sponsors/myviliha)

## Install

```bash
npm install @viliha/vui-ui       # or: pnpm add / yarn add / bun add
npm install -D tailwindcss @tailwindcss/postcss
```

`react` and `react-dom` are peer dependencies.

## Setup

**1. Import the theme** in your global stylesheet. This one import brings in the
design tokens, the `@theme` mapping, the base reset, and component scanning:

```css
@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";
```

**2. Next.js only.** Transpile the source package in `next.config.ts`:

```ts
const nextConfig = { transpilePackages: ["@viliha/vui-ui"] };
export default nextConfig;
```

(Vite and most bundlers need no extra config.)

## Scaffold the full app + demo (`init`)

The package itself ships the **components**. The **app shell** (layout, sidebar,
browser-style **open tabs**, command palette, nav config, logo) and the **demo
pages** come from a one-shot scaffolder:

```bash
npx @viliha/vui-ui init
```

It's **interactive** and walks through a short decision tree:

1. **Fresh project?** (fresh vs. existing)
2. **Pre-built theme?** The full shell plus demo pages, or just the theme wiring
   for you to build on.

Everything it generates is copied into *your* repo, so you own and edit it.

| | **Pre-built** (shell + demo) | **Theme-only** (you configure) |
| --- | --- | --- |
| **Fresh** | full runnable app: config + shell + demo pages | just the theme wiring (`globals.css`, `next.config`). Build your own pages |
| **Existing** | shell + demo added; your config is **never** overwritten (prints merge steps) | nothing copied; prints the wiring steps |

Before that, it asks whether this is a standalone **Next.js** app or a
**Turborepo**; for a monorepo it scaffolds into a target app dir, such as
`apps/web`.

```
Flags (for CI / agents, skip the prompts):
  --nextjs | --turbo          standalone app, or a Turborepo (Q0)
  --dir <path>                Turborepo target app dir (default apps/web)
  --fresh | --existing        project type (Q1)
  --prebuilt | --theme-only   pre-built shell + demo, or just the theme (Q2)
  --yes, -y                   accept defaults (nextjs, fresh, prebuilt)
  --force                     overwrite existing files
  --dry-run                   preview without writing
```

`init` **installs the dependencies for you** using the package manager it detects
from your lockfile (npm, pnpm, yarn, or bun). It prompts before doing so; pass
`--yes` to skip the prompt, or `--no-install` to handle it yourself.

### Fresh + pre-built (recommended for new apps)

Start from a `create-next-app` base **without `--src-dir`** (the scaffold expects
a root `app/` with `@/*` → `./*`), then run `init`. It scaffolds the app, installs
the dependencies, and leaves you ready to run `dev`. Any package manager works:

```bash
# npm
npx create-next-app@latest my-app --ts --tailwind --app --no-src-dir --use-npm
cd my-app && npx @viliha/vui-ui init && npm run dev

# pnpm
pnpm create next-app my-app --ts --tailwind --app --no-src-dir
cd my-app && pnpm dlx @viliha/vui-ui init && pnpm dev

# yarn
yarn create next-app my-app --ts --tailwind --app --no-src-dir
cd my-app && yarn dlx @viliha/vui-ui init && yarn dev

# bun
bun create next-app my-app --ts --tailwind --app --no-src-dir
cd my-app && bunx @viliha/vui-ui init && bun dev
```

`init` writes `next.config.ts`, `tsconfig.json`, `app/globals.css`, the shell, and
the demo pages, overwriting the create-next-app boilerplate, and installs the
dependencies. The demo then runs out of the box at `/dashboard`.

### Turborepo / monorepo

Scaffold **inside the target app** (e.g. `apps/web`), never at the repo root; the
root has no `app/` and no Next.js app. Run `init` from the app, or name it
from the root with `--dir`:

```bash
# from inside the app (simplest)
cd apps/web && npx @viliha/vui-ui init

# …or from the repo root
npx @viliha/vui-ui init --turbo --dir apps/web
```

In monorepo mode `init` does **not** auto-install (installs are
workspace-specific), so add the deps to that app afterward: `cd apps/web && pnpm
add @viliha/vui-ui …`, or from the root `pnpm --filter web add @viliha/vui-ui …`.
The `transpilePackages` entry, the `theme.css` import, and the `@/*` alias all
belong to **that app**, not the root.

### ⚠️ Existing project: read this first

Adding VUI to an app you already have takes a little care. **`init --existing`
never overwrites your config.** Choose pre-built to add the shell and pages under
`app/(app)/` and `app/_components/`, or theme-only to copy nothing. Either way, it
prints the four things you need to wire up:

1. **`next.config`**: add `transpilePackages: ["@viliha/vui-ui"]`.
   (Optional, for the open-tabs *keep-alive*: `output: "export"`,
   `images: { unoptimized: true }`, `trailingSlash: true`.)
2. **`app/globals.css`**: add:
   ```css
   @import "tailwindcss";
   @import "@viliha/vui-ui/theme.css";
   ```
3. **`tsconfig.json`**: the scaffold imports via `@/*`; map it to your root:
   `"compilerOptions": { "paths": { "@/*": ["./*"] } }`.
4. **Root `app/layout.tsx`**: `import "./globals.css"` (and mount fonts to match
   the demo's look).

Run **`npx @viliha/vui-ui init --existing --prebuilt --dry-run`** first to preview
exactly what it will add. If you only want the components, choose **theme-only**
(or skip `init` entirely and follow the [Setup](#setup) above), then import from
`@viliha/vui-ui/*`.

> **A note on theming an existing app:** VUI owns its design tokens in
> `theme.css`. If your app already defines shadcn/ui or other CSS variables under
> the same names, import `theme.css` **last** and remove the duplicates so the two
> token sets don't collide. On a fresh project this never comes up.

## Usage

Every component has its own entry point, so you ship only what you use:

```tsx
import { Button } from "@viliha/vui-ui/button";
import { Badge } from "@viliha/vui-ui/badge";
import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";

export function Example() {
  return (
    <div className="p-4">
      <Badge variant="success">Active</Badge>
      <Button variant="primary">Save</Button>
    </div>
  );
}
```

### Datatables & forms

`RecordView` builds a complete admin datatable from a single `fields` array:
editable cells, sorting, filtering, pagination, row and bulk actions,
CSV / JSON / Excel / PDF import and export, and a buffered **Add / Edit / View**
form (slide-over or full-page). Required fields render a `*`, and alignment and
colors come from the tokens, so you never style a field by hand.

```tsx
import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";

const fields: RecordField<Customer>[] = [
  { key: "name", label: "Name", required: true, hideInTable: true },
  { key: "email", label: "Email", copyable: true },
  { key: "country", label: "Country" },
];

<RecordView
  title="Customers"
  singular="Customer"
  fields={fields}
  initialData={rows}
  getPrimary={(r) => ({ title: r.name, initials: r.name.slice(0, 2) })}
  makeEmptyRow={() => ({ id: Date.now(), name: "", email: "", country: "" })}
/>;
```

That same `fields` array also drives `RecordForm`, the Add/Edit/View screen, along
with its Info panel (built from `formDescription` and each field's `description`).
See the [Data table docs](https://vui.viliha.com/docs/data-table) for the details.

## Patterns

The reference app composes these primitives into the conventions documented at
[vui.viliha.com/docs/layout](https://vui.viliha.com/docs/layout):

- **Five page types**: data table, record form (Add / Edit / View), dashboard,
  settings, and kanban board.
- **Command palette**: Quick actions (`⌘K`, navigate pages) and Global search
  (`⌘⌥K`, find records), both built on the exported `CommandPalette`.
- **Open tabs**: a browser-style strip of opened pages under the top bar
  (⌘-click a nav item for a background tab), persisted across reloads.
- **Multi-step wizard**: the exported `Steps` indicator + your step state for
  guided flows (see the `/register-business` demo).
- **Breadcrumbs**: the exported `Breadcrumbs` component fed a route-derived
  trail.

Copy them from the
[backoffice demo](https://github.com/myviliha/vui-starter/tree/main/apps/backoffice)
and adapt them to your app.

## Building with an AI agent

This package ships an **AI-agent usage guide** at
`node_modules/@viliha/vui-ui/AGENT.md`. It captures the standards to follow when
generating UI with VUI: token discipline, reuse-first, page layout, RecordView,
forms, accessibility, and dark mode. The quickest way to load it is the shipped
`CLAUDE.template.md`:

```bash
cp node_modules/@viliha/vui-ui/CLAUDE.template.md ./CLAUDE.md   # Claude Code
# or ./AGENTS.md for Cursor / Copilot
```

That file is a one-line `@import` of `AGENT.md`, so the rules stay in a single
place. If you'd rather keep a verbatim copy, run
`cp node_modules/@viliha/vui-ui/AGENT.md AGENTS.md`.

## Components

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `auth-context`
(provider-agnostic `AuthProvider` / `useAuth`) · `avatar` · `badge` ·
`breadcrumb` · `breadcrumbs` · `button` · `calendar` · `card` · `chart` (themed
Recharts wrapper) · `checkbox` · `collapsible` · `combobox` (searchable
single-select, static or async `loadOptions`) · `cascading-combobox`
(fixed named levels — Region → Country → State → City) · `command` · `command-palette`
(⌘K launcher) · `dialog` · `confirm-dialog` · `dropdown-menu` · `filter-field`
(two-column `FilterGrid` / `FilterField` layout) · `form` ·
`field-grid` (two-column `Label │ control` form layout) ·
`hover-card` · `input` · `input-otp` · `kbd` (key caps + `Shortcut`) · `label` ·
`menu` · `popover` · `progress` · `radio-group` · `required-mark` ·
`scroll-area` · `select` · `separator` · `sheet` · `skeleton` · `slider` ·
`sonner` · `steps`
(multi-step wizard indicator) · `switch` · `tabs` · `textarea` · `toggle` ·
`toggle-group` · `toast` (global
notifications) · `tooltip` · `table` · `record-view` (the full datatable +
`RecordForm`) · `wizard` (multi-step wizard scaffold — `Wizard` + `WizardSection`)
· plus the `utils` (`cn`) helper and the `theme.css` design tokens.

Components ported from shadcn/ui (Radix-based) are being brought into the package
so you don't need a separate `shadcn add`. Batch 1: `accordion`, `label`,
`separator`, `skeleton`, `switch`, `tabs`. Batch 2: `alert`, `alert-dialog`,
`collapsible`, `hover-card`, `popover`, `sheet`. Batch 3: `input-otp`,
`radio-group`, `slider`, `textarea`, `toggle`, `toggle-group`. Batch 4:
`aspect-ratio`, `breadcrumb`, `calendar`, `command`, `form`, `progress`,
`scroll-area`, `sonner`. That completes the shadcn/ui set.

## Theming

Every design decision lives in `@viliha/vui-ui/theme.css` as CSS variables:
colors, radius, typography, and dark mode. Override any token **after** the import
to rebrand the entire system:

```css
@import "@viliha/vui-ui/theme.css";

:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
```

## Acknowledgments

Inspired by and a big thank-you to [**shadcn/ui**](https://ui.shadcn.com) and
[**React**](https://react.dev) — VUI builds on their ideas and components.

## License

MIT © Suman Bonakurthi

---

Made with ♥ from Vietnam by the [Viliha Team](https://viliha.com).
