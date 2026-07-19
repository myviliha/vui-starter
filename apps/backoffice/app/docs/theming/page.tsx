import type { Metadata } from "next";

import { CodeBlock, DocPager, H2, Note, P, PageTitle, Ul } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/theming/" },
  title: "Theming",
  description:
    "Customize Vui Starter with CSS-variable design tokens — colors, radius, dark mode and typography — all from one theme.css.",
};

/** Semantic colors of the theme — the ones you reach for most. */
const COLORS: {
  name: string;
  token: string;
  value: string;
  usage: string;
}[] = [
  { name: "Primary (action)", token: "--button-primary", value: "#266DF0", usage: "Primary buttons, active states, links" },
  { name: "Primary hover", token: "--button-primary-hover", value: "#215BC4", usage: "Hover state of the primary action" },
  { name: "Foreground", token: "--foreground", value: "#101112", usage: "Default text color" },
  { name: "Primary (neutral)", token: "--primary", value: "oklch(0.205 0 0)", usage: "Neutral solid button / emphasis" },
  { name: "Secondary", token: "--secondary", value: "oklch(0.97 0 0)", usage: "Secondary button / subtle fills" },
  { name: "Hover surface", token: "--accent", value: "oklch(0.97 0 0)", usage: "Hover background on rows, items, ghost buttons" },
  { name: "Muted", token: "--muted", value: "oklch(0.97 0 0)", usage: "Section header bg, muted text on -foreground" },
  { name: "Destructive", token: "--destructive", value: "oklch(0.577 0.245 27)", usage: "Delete / error states" },
  { name: "Border", token: "--border", value: "oklch(0.922 0 0)", usage: "All borders and dividers" },
  { name: "Ring", token: "--ring", value: "oklch(0.708 0 0)", usage: "Focus ring" },
  { name: "Selection", token: "--selection", value: "#266DF0", usage: "Text selection highlight" },
];

function Swatch({ token }: { token: string }) {
  return (
    <span
      className="inline-block size-4 shrink-0 rounded border border-border align-middle"
      style={{ background: `var(${token})` }}
      aria-hidden="true"
    />
  );
}

export default function ThemingPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Theming"
        lead="Every design decision lives in one stylesheet — @viliha/vui-ui/theme.css — as CSS variables. Change the tokens and the whole system follows."
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
          <code>--destructive</code>, and the brand{" "}
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

      <H2>Color system</H2>
      <P>
        The semantic colors you reach for most. Every component reads these, so
        changing one token restyles the whole system. Each has a matching{" "}
        <code>-foreground</code> where text sits on top.
      </P>
      <div className="mb-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Color</th>
              <th className="px-3 py-2 font-medium">Token</th>
              <th className="px-3 py-2 font-medium">Value</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Usage</th>
            </tr>
          </thead>
          <tbody>
            {COLORS.map((c) => (
              <tr key={c.token} className="border-b border-border last:border-b-0">
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    <Swatch token={c.token} />
                    {c.name}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-[12.5px]">{c.token}</td>
                <td className="px-3 py-2 font-mono text-[12.5px] text-muted-foreground">
                  {c.value}
                </td>
                <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                  {c.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note title="Primary: neutral vs. action">
        shadcn&apos;s <code>--primary</code> is the neutral (near-black) solid
        used by the default button. The brand action color is{" "}
        <code>--button-primary</code> (<code>#266DF0</code>) with{" "}
        <code>--button-primary-hover</code> for its hover — used by{" "}
        <code>&lt;Button variant=&quot;primary&quot;&gt;</code>, checkboxes, and
        active states. Hover surfaces (rows, items, ghost buttons) use{" "}
        <code>--accent</code>.
      </Note>

      <H2>Default tokens</H2>
      <CodeBlock title="theme.css (excerpt)">{`:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.177 0 0);   /* #101112 */
  --primary: oklch(0.205 0 0);
  --radius: 0.625rem;
  --selection: #266df0;
  --button-primary: #266df0;        /* brand primary button */
  /* …neutral palette, chart + sidebar tokens… */
}`}</CodeBlock>

      <H2>Customize</H2>
      <P>Override tokens <strong>after</strong> importing the theme:</P>
      <CodeBlock title="app/globals.css">{`@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";

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
        prev={{ label: "Installation", href: "/docs/installation" }}
        next={{ label: "Layout & patterns", href: "/docs/layout" }}
      />
    </article>
  );
}
