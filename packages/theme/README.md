# @viliha/vui-theme

The VUI design system as plain CSS. No JavaScript, no dependencies, no framework.

One stylesheet carries 129 design tokens in `oklch`, class-based dark mode, the
documented z-scale, motion utilities, and `.vui-scroll` for always-visible
scrollbars. It is the same file that styles [VUI](https://vui.viliha.com) itself,
generated from the source rather than copied, so the two can never drift.

Use it in React, Vue, Svelte, Angular, Solid, Astro, Qwik, Lit, Alpine, HTMX, or
hand-written HTML.

## With Tailwind v4

```bash
npm install @viliha/vui-theme
npm install -D tailwindcss @tailwindcss/postcss
```

```css
@import "tailwindcss";
@import "@viliha/vui-theme/theme.css";
```

That gives you the tokens plus the `@theme` mapping, so Tailwind utilities such as
`bg-background`, `text-muted-foreground`, `rounded-lg` and `bg-popover` resolve to
VUI's values.

## With no build step

```html
<link rel="stylesheet" href="https://unpkg.com/@viliha/vui-theme/dist/vui.css" />
```

`dist/vui.css` is compiled: it carries the tokens, the base layer, the motion
utilities, and every utility class VUI's own components use. Markup copied out of
the docs renders correctly without installing anything.

## What you get

| | |
| --- | --- |
| Tokens | `--background`, `--foreground`, `--brand`, `--button-primary`, `--border`, `--ring`, chart 1 to 5, sidebar 1 to 8 |
| Dark mode | `.dark` on any ancestor. One `--brand` drives both modes through `color-mix()` |
| Radius and type | `--radius`, `--font-sans`, `--font-scale` |
| z-scale | 60 slide-over, 70 dialog, 80 confirm, 100 palette, 200 pickers, 210 hover card, 220 tooltip, 250 toast |
| Motion | `.vui-fade-in`, `.vui-pop-in`, `.vui-panel-in`, `.vui-toast-in`, `.vui-shimmer` |
| Scrollbars | `.vui-scroll` keeps both bars visible whenever there is somewhere to scroll |
| Motion | `--vui-duration-fast/base/slow`, `--vui-ease`, `--vui-ease-panel`. Set a duration to `0ms` to switch animation off |
| Icon chip | `--vui-icon-chip-border`, `--vui-icon-chip-padding`, or `.vui-icon-plain` for one icon |

Two opt-ins for non-React icon sets and accordions:

- add `.vui-icon` to an icon to get the bordered chip treatment (Radix icons get it
  automatically, since they render `width="15"`), and remove it again with
  `--vui-icon-chip-border: none`;
- set `--vui-accordion-height` on your accordion content to drive the open and
  close animation, mapping whatever your headless library measures.

## Components

This package is the theme only. For React components (datatable, forms, charts,
command palette, auth screens) install
[`@viliha/vui-ui`](https://www.npmjs.com/package/@viliha/vui-ui). Other frameworks
are covered at [vui.viliha.com/docs](https://vui.viliha.com/docs).

MIT © VILIHA PTE. LTD.
