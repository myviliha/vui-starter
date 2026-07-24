# @viliha/vui-ui

A clean, **token-driven React admin/CRM component library** built on Tailwind
CSS v4, shadcn-style patterns, and Radix Icons. Ships as **TypeScript source**
(Just-in-Time) — your app's bundler compiles only what you import.

Part of [**Vui Starter**](https://github.com/myviliha/vui-starter) — a free,
open-source admin design system.

- 🌐 **Live docs & demo:** [vui.viliha.com](https://vui.viliha.com)
- 📦 **Repository:** [github.com/myviliha/vui-starter](https://github.com/myviliha/vui-starter)

## Install

```bash
npm install @viliha/vui-ui       # or: pnpm add / yarn add / bun add
npm install -D tailwindcss @tailwindcss/postcss
```

`react` and `react-dom` are peer dependencies.

## Setup

**1. Import the theme** in your global stylesheet (design tokens, `@theme`
mapping, base reset, and component scanning — all in one import):

```css
@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";
```

**2. Next.js only** — transpile the source package in `next.config.ts`:

```ts
const nextConfig = { transpilePackages: ["@viliha/vui-ui"] };
export default nextConfig;
```

(Vite and most bundlers need no extra config.)

## Scaffold the full app + demo (`init`)

The package ships the **components**; the **app shell** (layout, sidebar,
browser-style **open tabs**, command palette, nav config, logo) and the **demo
pages** live in a one-shot scaffolder:

```bash
npx @viliha/vui-ui init
```

It's **interactive** — a short decision tree:

1. **Fresh project?** (fresh vs existing)
2. **Pre-built theme?** — the full shell + demo pages, or just the theme wiring
   that you configure yourself.

Files are copied into *your* repo, so you own and edit them.

| | **Pre-built** (shell + demo) | **Theme-only** (you configure) |
| --- | --- | --- |
| **Fresh** | full runnable app: config + shell + demo pages | just the theme wiring (`globals.css`, `next.config`) — build your own pages |
| **Existing** | shell + demo added; your config is **never** overwritten (prints merge steps) | nothing copied; prints the wiring steps |

```
Flags (for CI / agents, skip the prompts):
  --fresh | --existing        project type (Q1)
  --prebuilt | --theme-only   pre-built shell + demo, or just the theme (Q2)
  --yes, -y                   accept defaults (fresh, prebuilt)
  --force                     overwrite existing files
  --dry-run                   preview without writing
```

After a **pre-built** run, install the peer deps it prints, then `npm run dev` →
`/dashboard`.

### Fresh + pre-built (recommended for new apps)

Start from a `create-next-app` base. This writes `next.config.mjs`,
`app/globals.css`, the shell, and the demo pages (overwriting the create-next-app
boilerplate), so the demo runs out of the box.

### ⚠️ Existing project — read this first

Adding VUI to an app you already have needs care. **`init --existing` never
overwrites your config.** Pick pre-built to add the shell + pages under
`app/(app)/` and `app/_components/`, or theme-only to copy nothing — either way it
prints the four things to wire up:

1. **`next.config`** — add `transpilePackages: ["@viliha/vui-ui"]`.
   (Optional, for the open-tabs *keep-alive*: `output: "export"`,
   `images: { unoptimized: true }`, `trailingSlash: true`.)
2. **`app/globals.css`** — add:
   ```css
   @import "tailwindcss";
   @import "@viliha/vui-ui/theme.css";
   ```
3. **`tsconfig.json`** — the scaffold imports via `@/*`; map it to your root:
   `"compilerOptions": { "paths": { "@/*": ["./*"] } }`.
4. **Root `app/layout.tsx`** — `import "./globals.css"` (and mount fonts to match
   the demo's look).

Run **`npx @viliha/vui-ui init --existing --prebuilt --dry-run`** first to see
exactly what it will add. If you only want the components, choose **theme-only**
(or skip `init` and follow the [Setup](#setup) above), then import from
`@viliha/vui-ui/*`.

> **Note on the theme in an existing app:** VUI owns its design tokens in
> `theme.css`. If your app already defines shadcn/ui or other CSS variables with
> the same names, import `theme.css` **last** and remove the duplicates, or the
> two token sets will fight. On a fresh project this never comes up.

## Usage

Each component is its own entry point, so you only ship what you use:

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

`RecordView` is a complete admin datatable from a single `fields` array —
editable cells, sorting, filtering, pagination, row actions, bulk actions,
CSV / JSON / Excel / PDF import & export, and a buffered **Add / Edit / View**
form (slide-over or full-page). Required fields render a `*`, alignment and
colors come from the tokens — you never style a field by hand.

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

The same `fields` also drive `RecordForm` — the Add/Edit/View screen — and its
Info panel (from `formDescription` + per-field `description`). See the
[Data table docs](https://vui.viliha.com/docs/data-table).

## Patterns

The reference app composes these primitives into the conventions documented at
[vui.viliha.com/docs/layout](https://vui.viliha.com/docs/layout):

- **Five page types** — data table, record form (Add / Edit / View), dashboard,
  settings, and kanban board.
- **Command palette** — Quick actions (`⌘K`, navigate pages) and Global search
  (`⌘⌥K`, find records), both built on the exported `CommandPalette`.
- **Open tabs** — a browser-style strip of opened pages under the top bar
  (⌘-click a nav item for a background tab), persisted across reloads.
- **Multi-step wizard** — the exported `Steps` indicator + your step state for
  guided flows (see the `/register-business` demo).
- **Breadcrumbs** — the exported `Breadcrumbs` component fed a route-derived
  trail.

Copy them from the
[backoffice demo](https://github.com/myviliha/vui-starter/tree/main/apps/backoffice)
and adapt.

## Building with an AI agent

This package ships an **AI-agent usage guide** at
`node_modules/@viliha/vui-ui/AGENT.md` — the standards to follow when generating
UI with VUI (token discipline, reuse-first, page layout, RecordView, forms,
a11y, dark mode). The quickest way to load it is the shipped
`CLAUDE.template.md`:

```bash
cp node_modules/@viliha/vui-ui/CLAUDE.template.md ./CLAUDE.md   # Claude Code
# or ./AGENTS.md for Cursor / Copilot
```

It's a one-line `@import` of `AGENT.md`, so the rules stay in one place. Prefer a
verbatim copy? `cp node_modules/@viliha/vui-ui/AGENT.md AGENTS.md`.

## Components

`avatar` · `badge` · `breadcrumbs` · `button` · `card` · `chart` (themed Recharts
wrapper) · `checkbox` · `command-palette` (⌘K launcher) · `dialog` ·
`confirm-dialog` · `dropdown-menu` · `input` · `kbd` (key caps + `Shortcut`) ·
`menu` · `required-mark` · `select` · `steps` (multi-step wizard indicator) ·
`table` · `record-view` (the full datatable + `RecordForm`) · plus the `utils`
(`cn`) helper and the `theme.css` design tokens.

## Theming

Every design decision lives in `@viliha/vui-ui/theme.css` as CSS variables
(colors, radius, typography, dark mode). Override any token **after** the import
to rebrand the whole system:

```css
@import "@viliha/vui-ui/theme.css";

:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
```

## License

MIT © Suman Bonakurthi

---

Made with ♥ from Vietnam by the [Viliha Team](https://viliha.com).
