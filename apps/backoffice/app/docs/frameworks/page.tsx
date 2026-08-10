import type { Metadata } from "next";

import { CodeBlock, DocPager, H2, H3, Note, P, PageTitle, Ul } from "@/components/doc";
import { FrameworkTabs } from "@/components/framework-tabs";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/frameworks/" },
  title: "Use VUI with any framework (Vue, Svelte, Angular, Astro, HTMX)",
  description:
    "The VUI theme is plain CSS with no JavaScript, so it works in Vue, Svelte, Angular, Solid, Astro, Qwik, Lit, Alpine, HTMX and hand-written HTML. Install @viliha/vui-theme, or link the compiled stylesheet with no build step.",
};

/** What each level actually gives you, and what it costs us to keep true. */
const LEVELS: { level: string; ships: string; where: string }[] = [
  {
    level: "Theme",
    ships: "@viliha/vui-theme: tokens, dark mode, z-scale, motion, scrollbars. No JavaScript, no dependencies.",
    where: "Every framework on this page, today.",
  },
  {
    level: "Core",
    ships:
      "@viliha/vui-core: the logic without the framework. Runtime theming, table import and export, class merging. Plain TypeScript, no UI framework.",
    where: "Every framework, and Node.",
  },
  {
    level: "Components",
    ships: "A real component package: buttons, inputs, dialogs, menus, tables, the whole set.",
    where: "React and Next.js.",
  },
  {
    level: "Starter kit",
    ships: "A scaffolded app: shell, sidebar, open tabs, command palette, demo pages, via npx @viliha/vui-ui init.",
    where: "React and Next.js.",
  },
];

/** Frameworks we have actually wired up and looked at. */
const TESTED: { name: string; note: string }[] = [
  { name: "Vue and Nuxt", note: "Tailwind v4 via the Vite plugin; import the theme in your global stylesheet." },
  { name: "Svelte and SvelteKit", note: "Same wiring as Vue; add the theme import to app.css." },
  { name: "Angular", note: "Tailwind v4 through PostCSS; import the theme in styles.css." },
  { name: "Solid", note: "Vite plugin, then the theme import." },
  { name: "Astro", note: "Works with or without a React island. Astro components use the classes directly." },
  { name: "Qwik", note: "Vite plugin, then the theme import." },
  { name: "Lit", note: "Tokens cross the shadow boundary; utility classes do not. Render light DOM to use them." },
  { name: "Alpine, HTMX, 11ty, plain HTML", note: "No build step needed. Link the compiled stylesheet." },
];

export default function FrameworksPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Use VUI with any framework"
        lead="The theme is plain CSS with no JavaScript in it, so it works anywhere that renders HTML. Install @viliha/vui-theme and you have the tokens, dark mode, the z-scale and the motion utilities in Vue, Svelte, Angular, Solid, Astro, Qwik, Lit, Alpine or a hand-written page."
      />

      <H2>How do I add VUI to a non-React project?</H2>
      <P>
        Install the theme package and import it after Tailwind. That is the whole
        setup, and it is the same file that styles VUI itself.
      </P>
      <FrameworkTabs
        snippets={{
          vue: `npm install @viliha/vui-theme
npm install -D tailwindcss @tailwindcss/vite

/* src/style.css */
@import "tailwindcss";
@import "@viliha/vui-theme/theme.css";`,
          svelte: `npm install @viliha/vui-theme
npm install -D tailwindcss @tailwindcss/vite

/* src/app.css */
@import "tailwindcss";
@import "@viliha/vui-theme/theme.css";`,
          any: `npm install @viliha/vui-theme
npm install -D tailwindcss @tailwindcss/postcss

/* your global stylesheet */
@import "tailwindcss";
@import "@viliha/vui-theme/theme.css";`,
          cdn: `<!-- Nothing to install. Compiled, tokens and utilities included. -->
<link rel="stylesheet" href="https://unpkg.com/@viliha/vui-theme/dist/vui.css" />`,
          react: `npm install @viliha/vui-ui
npm install -D tailwindcss @tailwindcss/postcss

/* app/globals.css — the React package carries the theme */
@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";`,
        }}
      />
      <P>
        Now the utility classes resolve to VUI&apos;s values:{" "}
        <code>bg-background</code>, <code>text-muted-foreground</code>,{" "}
        <code>bg-popover</code>, <code>rounded-lg</code>. Add <code>.dark</code> to
        any ancestor for dark mode.
      </P>

      <H2>What do I get, and what do I still build?</H2>
      <P>
        Be clear-eyed about this. The theme is the design system: the colors, the
        radius, the type scale, the elevation, the motion. The components are React
        today. Everywhere else you write the markup and the classes do the styling.
      </P>
      <div className="mb-5 overflow-x-auto vui-scroll">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Level</th>
              <th className="py-2 pr-4 font-semibold">What ships</th>
              <th className="py-2 font-semibold">Where</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((l) => (
              <tr key={l.level} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-medium whitespace-nowrap">{l.level}</td>
                <td className="py-2 pr-4 text-muted-foreground">{l.ships}</td>
                <td className="py-2 text-muted-foreground">{l.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>What about the logic, not just the look?</H2>
      <P>
        Some of what a design system does is not markup at all: turning a theme
        into CSS variables, exporting a table to CSV, merging class names without
        conflicts. That part ships as{" "}
        <code>@viliha/vui-core</code>, plain TypeScript with no UI framework in it.
      </P>
      <CodeBlock title="theming and exporting, in any framework">{`npm install @viliha/vui-core

import { mergeThemes, applyTheme, rowsToCSV, downloadFile } from "@viliha/vui-core";

// An organization's theme with one person's overrides on top.
applyTheme(document.documentElement, mergeThemes(orgTheme, userTheme));

// Export the rows on screen, no spreadsheet library required.
downloadFile("people.csv", rowsToCSV(columns, rows), "text/csv");`}</CodeBlock>
      <P>
        It is generated from the same files the React components use, so the two
        cannot drift, and the build refuses to publish a module that has picked up
        a framework import.
      </P>

      <H2>Which frameworks are tested?</H2>
      <P>
        It is a stylesheet, so it works in anything that renders HTML. These are the
        ones we have actually wired up:
      </P>
      <Ul>
        {TESTED.map((f) => (
          <li key={f.name}>
            <strong>{f.name}.</strong> {f.note}
          </li>
        ))}
      </Ul>
      <Note title="Frameworks we do not support">
        We have no plans for Backbone, Knockout, Polymer, Dojo, Mithril, Hyperapp,
        Ember, Meteor, Marko or Inferno. The CSS will still work in them, because CSS
        does not care. We just will not answer issues as though we tested it.
      </Note>

      <H2>Two things to know outside React</H2>
      <H3>Icons</H3>
      <P>
        VUI draws every icon as a small bordered chip. In React that keys off Radix
        icons, which render <code>width=&quot;15&quot;</code>. Anywhere else, add{" "}
        <code>.vui-icon</code> to the icon and you get the same treatment.
      </P>
      <CodeBlock title="any icon set">{`<svg class="vui-icon size-4" viewBox="0 0 15 15">…</svg>`}</CodeBlock>
      <H3>Accordion animation</H3>
      <P>
        The open and close animation needs the measured content height. Set{" "}
        <code>--vui-accordion-height</code> from whatever your headless library
        publishes, and the keyframes do the rest.
      </P>
      <CodeBlock title="mapping your library">{`<!-- Vue (Reka UI) -->
<AccordionContent style="--vui-accordion-height: var(--reka-accordion-content-height)" />

<!-- Svelte (Bits UI) -->
<Accordion.Content style="--vui-accordion-height: var(--bits-accordion-content-height)" />`}</CodeBlock>

      <H2>Where are the Vue and Svelte components?</H2>
      <P>
        Not built yet, and we would rather say so than list logos we cannot back. The
        theme is the part that ports for free, so it ships first. Real component
        packages are a few months of work each and only worth starting once people are
        actually using the theme in that framework. If that is you,{" "}
        <a
          href="https://github.com/myviliha/vui-starter/issues"
          className="font-medium text-foreground underline"
        >
          open an issue and say which framework
        </a>
        . That is what decides the order.
      </P>

      <DocPager
        prev={{ label: "Installation", href: "/docs/installation" }}
        next={{ label: "Configuration", href: "/docs/configuration" }}
      />
    </article>
  );
}
