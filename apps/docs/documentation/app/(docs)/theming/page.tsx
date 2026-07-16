import type { Metadata } from "next";

import { CodeBlock, DocPager, H2, Note, P, PageTitle, Ul } from "@/components/doc";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "Customize Vui Starter with CSS-variable design tokens — colors, radius, dark mode and typography — all from one theme.css.",
};

export default function ThemingPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Theming"
        lead="Every design decision lives in one stylesheet — @myviliha/vui-ui/theme.css — as CSS variables. Change the tokens and the whole system follows."
      />

      <H2>Token groups</H2>
      <Ul>
        <li>
          <strong>Surfaces &amp; text</strong> — <code>--background</code>,{" "}
          <code>--foreground</code>, <code>--card</code>, <code>--popover</code>,{" "}
          <code>--muted</code>, <code>--accent</code>.
        </li>
        <li>
          <strong>Actions</strong> — <code>--primary</code>,{" "}
          <code>--destructive</code>, and the Attio-style{" "}
          <code>--button-primary</code> / <code>--button-primary-hover</code> /{" "}
          <code>--button-shadow</code>.
        </li>
        <li>
          <strong>Lines &amp; focus</strong> — <code>--border</code>,{" "}
          <code>--input</code>, <code>--ring</code>.
        </li>
        <li>
          <strong>Sidebar, charts, radius, selection</strong> —{" "}
          <code>--sidebar-*</code>, <code>--chart-1..5</code>,{" "}
          <code>--radius</code>, <code>--selection</code>.
        </li>
      </Ul>

      <H2>Default tokens</H2>
      <CodeBlock title="theme.css (excerpt)">{`:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.177 0 0);   /* #101112 */
  --primary: oklch(0.205 0 0);
  --radius: 0.625rem;
  --selection: #266df0;
  --button-primary: #266df0;        /* Attio-style primary button */
  /* …neutral palette, chart + sidebar tokens… */
}`}</CodeBlock>

      <H2>Customize</H2>
      <P>Override tokens <strong>after</strong> importing the theme:</P>
      <CodeBlock title="app/globals.css">{`@import "tailwindcss";
@import "@myviliha/vui-ui/theme.css";

:root {
  --primary: oklch(0.55 0.2 260);  /* your brand */
  --radius: 0.5rem;
}`}</CodeBlock>

      <H2>Dark mode</H2>
      <P>
        The tokens ship a <code>.dark</code> block. Toggle by adding the{" "}
        <code>dark</code> class to <code>&lt;html&gt;</code> (wire it to a theme
        switch or the OS preference).
      </P>
      <CodeBlock>{`<html class="dark">`}</CodeBlock>

      <Note title="Typography">
        The baseline is Inter at 14px / medium with <code>#101112</code> text.
        Provide the <code>--font-inter</code> and <code>--font-jetbrains-mono</code>{" "}
        CSS variables (e.g. via <code>next/font</code>) to match the demo.
      </Note>

      <DocPager
        prev={{ label: "Installation", href: "/installation" }}
        next={{ label: "Components", href: "/components" }}
      />
    </article>
  );
}
