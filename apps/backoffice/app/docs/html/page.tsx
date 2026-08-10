import type { Metadata } from "next";

import { CodeBlock, DocPager, H2, H3, Note, P, PageTitle, Ul } from "@/components/doc";
import { SNIPPETS } from "@/lib/snippets";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/html/" },
  title: "Use VUI with plain HTML (no build step)",
  description:
    "Link one stylesheet and paste the markup: buttons, cards, forms, tables, menus and dialogs in plain HTML, with no npm install, no bundler and no framework. Works with HTMX, Alpine, 11ty, Jekyll, PHP or a static file.",
};

export default function HtmlPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Plain HTML, no build step"
        lead="One stylesheet link and the markup below. No npm install, no bundler, no framework. This is the same CSS and the same class strings the React and Vue components render, so a hand-written page sits alongside them without looking like a different product."
      />

      <H2>How do I add VUI to a plain HTML page?</H2>
      <P>Link the compiled stylesheet. That is the whole setup.</P>
      <CodeBlock title="index.html">{`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/@viliha/vui-theme/dist/vui.css" />
  </head>
  <body class="bg-background text-foreground">
    <!-- paste any snippet from this page -->
  </body>
</html>`}</CodeBlock>
      <P>
        The file carries the design tokens, the base layer, the motion utilities
        and every utility class VUI&apos;s own components use, already generated.
        It is about 75 kB before compression, and it needs no Tailwind, no
        PostCSS and no build.
      </P>
      <Note title="Dark mode is a class">
        Add <code>class=&quot;dark&quot;</code> to <code>&lt;html&gt;</code> and
        everything flips, because every colour is a token. Persist the choice in{" "}
        <code>localStorage</code> and set it before first paint to avoid a flash.
      </Note>
      <CodeBlock title="theme toggle, the whole thing">{`<script>
  // Before first paint, so the page never flashes the wrong theme.
  const stored = localStorage.getItem("theme");
  const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
</script>`}</CodeBlock>

      <H2>Markup</H2>
      <P>
        Copy any of these. They are generated from the same class strings the
        components render, so they cannot drift out of date with the library.
      </P>
      {SNIPPETS.map((s) => (
        <div key={s.id}>
          <H3>{s.title}</H3>
          <P>{s.note}</P>
          <CodeBlock title={`${s.id}.html`}>{s.html}</CodeBlock>
        </div>
      ))}

      <H2>What about the interactive parts?</H2>
      <P>
        The markup is here; the behaviour is yours. A dialog needs opening,
        closing and a focus trap, and a dropdown needs positioning and outside
        clicks. Three ways to get that without a framework:
      </P>
      <Ul>
        <li>
          <strong>Alpine.js</strong> in about ten lines:{" "}
          <code>x-data</code>, <code>x-show</code>, <code>x-trap</code> and{" "}
          <code>@click.outside</code> cover most of it.
        </li>
        <li>
          <strong>Native elements.</strong> <code>&lt;dialog&gt;</code> gives you
          a modal with a focus trap and Escape for free; style it with the dialog
          classes above. <code>&lt;details&gt;</code> makes an accordion.
        </li>
        <li>
          <strong>HTMX</strong> for the server round trips, with the classes
          applied to whatever it swaps in.
        </li>
      </Ul>
      <Note title="Being straight about the limit">
        There is no component package for plain HTML, and this page is not
        pretending otherwise. You get the design system and the markup; you write
        the behaviour. If that is more than you want to do, the React package has
        all of it built.
      </Note>

      <DocPager
        prev={{ label: "Any framework", href: "/docs/frameworks" }}
        next={{ label: "Laravel", href: "/docs/laravel" }}
      />
    </article>
  );
}
