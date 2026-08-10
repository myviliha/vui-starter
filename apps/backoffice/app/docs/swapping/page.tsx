import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";
import { FrameworkTabs } from "@/components/framework-tabs";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/swapping/" },
  title: "Swapping the defaults: icons, CSS, fonts, charts and motion",
  description:
    "What VUI ships by default and how to replace each piece: Radix icons or any icon set, Tailwind v4 or plain compiled CSS, the font stack, Recharts or TanStack Charts, and the motion tokens. With per-framework wiring for React, Vue and everything else.",
};

/** Every default, what replaces it, and how much work the swap is. */
const DEFAULTS: {
  piece: string;
  shipped: string;
  swap: string;
  cost: "Free" | "One line" | "Some work" | "Not supported";
}[] = [
  {
    piece: "Icons",
    shipped: "Radix Icons in the React components",
    swap: "Any set: Lucide, Heroicons, Phosphor, your own SVGs",
    cost: "One line",
  },
  {
    piece: "CSS engine",
    shipped: "Tailwind v4 utilities plus CSS-variable tokens",
    swap: "A compiled stylesheet with no build, or your own framework reading the tokens",
    cost: "One line",
  },
  {
    piece: "Fonts",
    shipped: "Inter, with a type scale",
    swap: "Any family and scale, per app or per user",
    cost: "One line",
  },
  {
    piece: "Charts",
    shipped: "Recharts in React, TanStack Charts everywhere",
    swap: "Any library that can read CSS variables",
    cost: "Some work",
  },
  {
    piece: "Motion",
    shipped: "Durations and easings as tokens",
    swap: "Retune, or switch animation off entirely",
    cost: "One line",
  },
  {
    piece: "Components",
    shipped: "React and Vue, styled with Tailwind classes",
    swap: "Bootstrap or another component framework",
    cost: "Not supported",
  },
];

export default function SwappingPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Swapping the defaults"
        lead="VUI ships opinionated defaults so you can start without deciding anything. Every one of them is replaceable, and most swaps are a single line of CSS because the design system is tokens first. This page says exactly what is swappable, what it costs, and what is not."
      />

      <div className="mb-5 overflow-x-auto vui-scroll">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Piece</th>
              <th className="py-2 pr-4 font-semibold">Default</th>
              <th className="py-2 pr-4 font-semibold">Swap to</th>
              <th className="py-2 font-semibold">Cost</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULTS.map((d) => (
              <tr key={d.piece} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-medium whitespace-nowrap">{d.piece}</td>
                <td className="py-2 pr-4 text-muted-foreground">{d.shipped}</td>
                <td className="py-2 pr-4 text-muted-foreground">{d.swap}</td>
                <td className="py-2 whitespace-nowrap text-muted-foreground">{d.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>How do I use a different icon set?</H2>
      <P>
        Add <code>.vui-icon</code> to your icons and they get the same treatment
        VUI&apos;s own icons get: a bordered chip, sized and coloured from the
        tokens. Nothing else to configure, in any framework.
      </P>
      <P>
        The React components use Radix Icons internally, which render{" "}
        <code>width=&quot;15&quot;</code>, and the stylesheet targets that
        attribute so they are styled automatically. Your icons are not Radix, so
        they opt in with the class instead.
      </P>
      <FrameworkTabs
        snippets={{
          react: `import { Star } from "lucide-react";

<Star className="vui-icon size-4" />`,
          vue: `<script setup lang="ts">
import { Star } from "lucide-vue-next";
</script>

<template>
  <Star class="vui-icon size-4" />
</template>`,
          any: `<!-- Any framework, any icon set, even a raw file -->
<svg class="vui-icon size-4" viewBox="0 0 24 24">…</svg>`,
          cdn: `<svg class="vui-icon size-4" viewBox="0 0 24 24">…</svg>`,
        }}
      />
      <H3>Turning the chip off</H3>
      <P>
        The bordered chip is a deliberate look, not a requirement. Two tokens
        remove it, for one icon or for the whole app:
      </P>
      <CodeBlock title="globals.css">{`/* Everywhere */
:root {
  --vui-icon-chip-border: none;
  --vui-icon-chip-padding: 0;
}

/* Or just one icon: <Star className="vui-icon-plain size-4" /> */`}</CodeBlock>

      <H2>Do I have to use Tailwind?</H2>
      <P>
        For the tokens, no. For the shipped components, yes.
      </P>
      <P>
        The honest split: <strong>design tokens</strong> are 129 plain CSS
        variables that any framework can read, including Bootstrap. The{" "}
        <strong>components</strong> are styled with Tailwind utility classes, so
        they need those classes to exist. That is what the compiled stylesheet is
        for: it contains every utility VUI uses, already generated, so markup
        copied from these docs renders with no build step at all.
      </P>
      <FrameworkTabs
        snippets={{
          any: `/* Tailwind v4: utilities are generated from your source as usual */
@import "tailwindcss";
@import "@viliha/vui-theme/theme.css";`,
          cdn: `<!-- No build step: the utilities VUI uses are pre-compiled -->
<link rel="stylesheet" href="https://unpkg.com/@viliha/vui-theme/dist/vui.css" />`,
          react: `/* app/globals.css */
@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";`,
          vue: `/* src/style.css */
@import "tailwindcss";
@import "@viliha/vui-vue/theme.css";`,
        }}
      />
      <H3>Using the tokens with Bootstrap or another framework</H3>
      <P>
        Keep your framework and take VUI&apos;s palette. Map our variables onto
        theirs once and their components follow your theme, including dark mode,
        because the values change and the names do not.
      </P>
      <CodeBlock title="bridge.css">{`@import "@viliha/vui-theme/theme.css";

:root {
  --bs-body-bg: var(--background);
  --bs-body-color: var(--foreground);
  --bs-primary: var(--button-primary);
  --bs-border-color: var(--border);
  --bs-border-radius: var(--radius);
}`}</CodeBlock>
      <Note title="What this does not give you">
        A Bootstrap button styled with VUI colours is a Bootstrap button. It will
        not match the shipped components pixel for pixel, and we do not maintain
        that bridge. Take the tokens for consistency across an app you are
        migrating; do not expect the two component sets to be interchangeable.
      </Note>

      <H2>How do I change the font?</H2>
      <P>
        Set <code>--font-sans</code>. <code>--font-scale</code> multiplies the
        whole type scale, so you can make an app denser or roomier without
        touching a single component.
      </P>
      <CodeBlock title="globals.css">{`:root {
  --font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  --font-scale: 1.05; /* everything 5% larger */
}`}</CodeBlock>
      <P>
        In an app that lets people choose, use the theming engine rather than
        hand-written CSS. <code>THEME_FIELDS</code> in{" "}
        <code>@viliha/vui-core</code> lists every themeable value, fonts included,
        and <code>applyTheme</code> writes them as variables on any element.
      </P>
      <CodeBlock title="any framework">{`import { applyTheme, mergeThemes, FONT_FAMILIES } from "@viliha/vui-core";

applyTheme(document.documentElement, mergeThemes(orgTheme, { fontSans: "geist" }));`}</CodeBlock>

      <H2>Can I use a different chart library?</H2>
      <P>
        Yes, and two are supported out of the box. <strong>Recharts</strong> is
        the default in React through <code>ChartContainer</code>.{" "}
        <strong>TanStack Charts</strong> works in React, Vue, Svelte, Solid and
        Angular from one definition, which is how non-React frameworks get charts
        at all. Both are covered on the{" "}
        <a href="/docs/charts" className="font-medium text-foreground underline">
          charts page
        </a>
        .
      </P>
      <P>
        For anything else, the contract is small: read the chart tokens and
        inherit <code>currentColor</code>. Any library that accepts a colour
        string can do it.
      </P>
      <CodeBlock title="bring your own">{`// Chart.js, ECharts, uPlot, D3 — read the same tokens the rest of the theme uses
const styles = getComputedStyle(document.documentElement);
const palette = [1, 2, 3, 4, 5].map((i) => styles.getPropertyValue(\`--chart-\${i}\`));

// Or in CSS, for a library that paints with currentColor:
// .my-chart { color: var(--foreground); }`}</CodeBlock>
      <Note title="Why this stays consistent">
        Charts are the usual place a design system leaks, because chart colours
        get hard-coded per chart. Reading the tokens means a tenant&apos;s brand
        and dark mode reach the charts without anyone remembering to update them.
      </Note>

      <H2>How do I change or disable animations?</H2>
      <P>
        Motion is tokens too. Retune the feel, or switch it off in one line.
      </P>
      <CodeBlock title="globals.css">{`:root {
  --vui-duration-fast: 0.14s;  /* menus, popovers */
  --vui-duration-base: 0.2s;   /* overlays, toasts */
  --vui-duration-slow: 0.3s;   /* panels, slide-overs */
  --vui-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --vui-ease-panel: cubic-bezier(0.32, 0.72, 0, 1);
}

/* Off entirely */
:root { --vui-duration-fast: 0ms; --vui-duration-base: 0ms; --vui-duration-slow: 0ms; }`}</CodeBlock>
      <P>
        This is a product choice, separate from accessibility. VUI already honours{" "}
        <code>prefers-reduced-motion</code> and clamps every animation for people
        who ask their system for less motion, whatever these tokens say.
      </P>

      <H2>What is not swappable?</H2>
      <Ul>
        <li>
          <strong>The component styling engine.</strong> Buttons, dialogs, tables
          and the rest are Tailwind class strings. Swapping in Bootstrap classes
          would mean rewriting every component, so we do not claim it works.
        </li>
        <li>
          <strong>The headless layer, per framework.</strong> React components use
          Radix, Vue uses Reka UI. Both are Radix-shaped, which is why the two
          look identical, but you cannot mix one into the other.
        </li>
        <li>
          <strong>Tokens as the source of colour.</strong> You can change every
          token; you should not bypass them with a hard-coded hex. That is the one
          rule that keeps dark mode and per-tenant branding working.
        </li>
      </Ul>

      <DocPager
        prev={{ label: "Theming", href: "/docs/theming" }}
        next={{ label: "Layouts", href: "/docs/layout" }}
      />
    </article>
  );
}
