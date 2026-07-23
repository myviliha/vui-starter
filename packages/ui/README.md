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
`menu` · `required-mark` · `select` · `table` · `record-view` (the full datatable
+ `RecordForm`) · plus the `utils` (`cn`) helper and the `theme.css` design
tokens.

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
