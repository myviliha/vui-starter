# @viliha/vui-ui

A **token-driven React component library** for admin and CRM interfaces, built on
Tailwind CSS v4, shadcn-style patterns, and Radix Icons. It ships as **TypeScript
source** rather than a prebuilt bundle, so your app's bundler compiles only the
components you actually import.

It's part of [**Vui Starter**](https://github.com/myviliha/vui-starter), a free
and open-source admin design system.

- 🌐 **Live docs & demo:** [vui.viliha.com](https://vui.viliha.com)
- 📦 **Repository:** [github.com/myviliha/vui-starter](https://github.com/myviliha/vui-starter)

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
2. **Pre-built theme?** — the full shell plus demo pages, or just the theme wiring
   for you to build on.

Everything it generates is copied into *your* repo, so you own and edit it.

| | **Pre-built** (shell + demo) | **Theme-only** (you configure) |
| --- | --- | --- |
| **Fresh** | full runnable app: config + shell + demo pages | just the theme wiring (`globals.css`, `next.config`) — build your own pages |
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

Start from a `create-next-app` base **without `--src-dir`** — the scaffold expects
a root `app/` with `@/*` → `./*` — then run `init`. It scaffolds the app, installs
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

### ⚠️ Existing project — read this first

Adding VUI to an app you already have takes a little care. **`init --existing`
never overwrites your config.** Choose pre-built to add the shell and pages under
`app/(app)/` and `app/_components/`, or theme-only to copy nothing. Either way, it
prints the four things you need to wire up:

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

`avatar` · `badge` · `breadcrumbs` · `button` · `card` · `chart` (themed Recharts
wrapper) · `checkbox` · `command-palette` (⌘K launcher) · `dialog` ·
`confirm-dialog` · `dropdown-menu` · `input` · `kbd` (key caps + `Shortcut`) ·
`menu` · `required-mark` · `select` · `steps` (multi-step wizard indicator) ·
`table` · `record-view` (the full datatable + `RecordForm`) · plus the `utils`
(`cn`) helper and the `theme.css` design tokens.

## Theming

Every design decision lives in `@viliha/vui-ui/theme.css` as CSS variables —
colors, radius, typography, and dark mode. Override any token **after** the import
to rebrand the entire system:

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
