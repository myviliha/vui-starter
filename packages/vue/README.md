# @viliha/vui-vue

[VUI](https://vui.viliha.com) components for Vue 3 and Nuxt, built on
[Reka UI](https://reka-ui.com).

They look identical to the React components because they are not a lookalike:
both render the same class strings, imported from `@viliha/vui-core`. Change a
button's hover state once and both follow.

> **Status: early.** This is v0. The mechanical components are here; dialogs,
> menus, selects and the datatable are not yet. See
> [what ships where](https://vui.viliha.com/docs/frameworks/).

## Install

```bash
npm install @viliha/vui-vue
npm install -D tailwindcss @tailwindcss/vite
```

```css
/* src/style.css */
@import "tailwindcss";
@import "@viliha/vui-vue/theme.css";
```

That one import brings in the design tokens, dark mode, and a `@source` rule so
Tailwind emits the utilities these components use.

## Use

```vue
<script setup lang="ts">
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from "@viliha/vui-vue";
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Sign in</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-3">
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" placeholder="you@example.com" />
      <Button variant="primary">Continue</Button>
    </CardContent>
  </Card>
</template>
```

Import one component and a bundler drops the rest:

```ts
import Button from "@viliha/vui-vue/Button";
```

## What's here

`Button` · `Badge` · `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`,
`CardContent`, `CardFooter`) · `Input` · `Textarea` · `Label` · `Separator` ·
`Skeleton` · `Kbd` · `Code` · `Chart` · `Switch` · `Checkbox` · `Tabs` (+
`TabsList`, `TabsTrigger`, `TabsContent`) · `Accordion` (+ `AccordionItem`,
`AccordionTrigger`, `AccordionContent`) · `Collapsible` (+ `CollapsibleTrigger`,
`CollapsibleContent`)

`Chart` wraps [TanStack Charts](https://tanstack.com/charts), which is
framework-neutral, so a chart definition written for the React app renders here
unchanged. It picks up the theme palette automatically. Install
`@tanstack/charts` (an optional peer) if you use it.

Inputs use `v-model`, which is what a Vue developer expects. Every component
takes `class` and merges it, so a caller's `h-20` beats the variant's `h-9`.

## What's not here yet

Dialogs, sheets, menus, selects, comboboxes, tooltips, toasts, the command
palette, and the datatable. The calendar and the auth screens are
React-only for now. The
[frameworks page](https://vui.viliha.com/docs/frameworks/) is kept honest about
what exists.

Need one of them? [Say which](https://github.com/myviliha/vui-starter/issues).
That is what decides the order.

MIT © VILIHA PTE. LTD.
