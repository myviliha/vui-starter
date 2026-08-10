# @viliha/vui-core

The framework-free half of [VUI](https://vui.viliha.com). Plain TypeScript, no UI
framework, so it runs in Vue, Svelte, Angular, Solid, React or plain Node.

```bash
npm install @viliha/vui-core
```

It pairs with [`@viliha/vui-theme`](https://www.npmjs.com/package/@viliha/vui-theme),
which is the same design system as CSS. Theme gives you the look; core gives you
the logic underneath it.

## Theming at runtime

The complete themeable surface as data, plus the functions that turn a theme into
CSS variables you can set on any element.

```ts
import { themeToCssVars, mergeThemes, applyTheme, THEME_FIELDS } from "@viliha/vui-core";

// An organization's theme, with one person's overrides on top.
const theme = mergeThemes(orgTheme, userTheme);
applyTheme(document.documentElement, theme);
```

`themeToCssVars` derives what it can: give it a brand colour and it works out a
readable foreground for text on top of it. `parseTheme` refuses values that could
break out of a style attribute, so a theme loaded from your API cannot inject CSS.
`THEME_FIELDS` is the full list of what can be themed, which is what you build a
theme editor from.

## Table import and export

CSV and JSON round-trip, "Excel" is an HTML table saved as `.xls` (Excel opens it),
and PDF is browser print. No dependencies, no worker, no 400 kB spreadsheet library.

```ts
import { rowsToCSV, parseCSV, downloadFile, printTable } from "@viliha/vui-core";

const csv = rowsToCSV([{ key: "name", label: "Name" }], rows);
downloadFile("people.csv", csv, "text/csv");
```

Quoting, embedded commas, quotes and newlines are handled, so a value like
`a,b"c` survives the round trip.

## Class merging

```ts
import { cn } from "@viliha/vui-core";

cn("p-2", isWide && "p-4"); // "p-4" — the later Tailwind utility wins
```

## How it stays in sync

This package is **generated** from `packages/ui/src` at publish time, not
hand-maintained. The same file that the React components use is compiled here for
everyone else, so the two can never drift, and the build refuses to ship a module
that has picked up a framework import.

MIT © VILIHA PTE. LTD.
