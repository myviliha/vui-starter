import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/ai-agents/" },
  title: "Building with AI agents",
  description:
    "Standards for generating UI with VUI using AI coding agents (Claude Code, Cursor, Copilot). Ships as AGENT.md inside the @viliha/vui-ui package.",
};

export default function AiAgentsPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Building with AI agents"
        lead="VUI ships an agent-ready usage guide so an AI coding assistant produces consistent, token-driven, accessible UI on the first pass — instead of reinventing the design system. This page is for using the theme in your own app."
      />

      <Note title="Which guide do I need?">
        Two scenarios, two homes.{" "}
        <strong>Using the theme in your own app</strong> (this page) — your agent
        reads the package&apos;s <code>AGENT.md</code>.{" "}
        <strong>Contributing to the theme itself</strong> — see{" "}
        <a
          href="/docs/contributing"
          className="font-medium text-foreground underline"
        >
          Contributing
        </a>{" "}
        (humans) and its <code>AGENTS.md</code> (agents).
      </Note>

      <H2>Where the guide lives</H2>
      <P>
        The full guide is published <strong>inside the npm package</strong> at{" "}
        <code>node_modules/@viliha/vui-ui/AGENT.md</code>. Point your agent at it,
        or copy it into your repo as <code>AGENTS.md</code> — the filename that
        Claude Code, Cursor and Copilot auto-load — so every session follows the
        same standards.
      </P>
      <CodeBlock title="use the shipped guide">{`# after: npm install @viliha/vui-ui
cp node_modules/@viliha/vui-ui/AGENT.md AGENTS.md
# now your agent reads it automatically`}</CodeBlock>
      <Note title="Also on GitHub">
        The repo keeps two companion files:{" "}
        <a
          href="https://github.com/myviliha/vui-starter/blob/main/AGENTS.md"
          className="font-medium text-foreground underline"
        >
          AGENTS.md
        </a>{" "}
        (rules for agents working <em>in</em> this repo) and{" "}
        <a
          href="https://github.com/myviliha/vui-starter/blob/main/CONTRIBUTING.md"
          className="font-medium text-foreground underline"
        >
          CONTRIBUTING.md
        </a>{" "}
        (for humans contributing to the theme). The package{" "}
        <code>AGENT.md</code> is the one for <em>consuming</em> VUI downstream.
      </Note>

      <H2>What the guide enforces</H2>
      <Ul>
        <li>
          <strong>Reuse first.</strong> Search for an existing component,
          layout, variant or utility before creating anything new; extend before
          you build.
        </li>
        <li>
          <strong>Tokens only.</strong> Never hard-code colors, spacing, radius,
          shadows or typography — read the semantic tokens from{" "}
          <code>theme.css</code> (<code>--background</code>,{" "}
          <code>--foreground</code>, <code>--button-primary</code>, …).
        </li>
        <li>
          <strong>Follow the page pattern.</strong> <code>SetPageTitle</code> →
          action header with <code>&lt;Breadcrumbs /&gt;</code> → a single
          scrolling content region (<code>p-4</code>, <code>gap-4</code>).
        </li>
        <li>
          <strong>Datatables use <code>RecordView</code></strong> with a{" "}
          <code>fields</code> array — never hand-rolled HTML tables. Charts use{" "}
          <code>ChartContainer</code> + Recharts with chart tokens.
        </li>
        <li>
          <strong>Accessibility &amp; dark mode are mandatory</strong> —
          keyboard nav, visible focus, ARIA, WCAG AA, and both light/dark from
          tokens (no per-component color overrides).
        </li>
        <li>
          <strong>Keep business logic out of UI</strong>, prefer Server
          Components, and communicate loading / empty / success / error states.
        </li>
      </Ul>

      <H2>Package exports vs. reference-app patterns</H2>
      <P>
        The package ships the primitives — <code>Button</code>,{" "}
        <code>Input</code>, <code>Select</code>, <code>Dialog</code>,{" "}
        <code>Menu</code>, <code>RecordView</code>, <code>ChartContainer</code>,{" "}
        <code>theme.css</code>. App-shell pieces the guide references —{" "}
        <code>SetPageTitle</code>, <code>Breadcrumbs</code>, the sidebar /{" "}
        <code>nav-config</code>, and the <code>AuthCard*</code> auth screens — are{" "}
        <strong>reference-app patterns to copy</strong> from the backoffice demo,
        not package exports. The shipped <code>AGENT.md</code> spells this out so
        your agent won&apos;t invent imports.
      </P>

      <DocPager
        prev={{ label: "Layout & patterns", href: "/docs/layout" }}
        next={{ label: "Using shadcn/ui", href: "/docs/shadcn-ui" }}
      />
    </article>
  );
}
