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
  title: "Building with AI agents (AGENT.md + MCP server)",
  description:
    "Standards for generating UI with VUI using AI coding agents (Claude Code, Cursor, Copilot). Ships as AGENT.md inside the @viliha/vui-ui package, plus an MCP server that answers component, page, and layout questions on demand.",
};

export default function AiAgentsPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Building with AI agents"
        lead="VUI ships an agent-ready usage guide so your AI coding assistant produces consistent, token-driven, accessible UI on the first pass instead of reinventing the design system. This page covers using the theme in your own app."
      />

      <Note title="Which guide do I need?">
        Two scenarios, two homes. When you&apos;re{" "}
        <strong>using the theme in your own app</strong> (this page), your agent
        reads the package&apos;s <code>AGENT.md</code>. When you&apos;re{" "}
        <strong>contributing to the theme itself</strong>, see{" "}
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
        The full guide ships <strong>inside the npm package</strong> at{" "}
        <code>node_modules/@viliha/vui-ui/AGENT.md</code>. The fastest way to
        wire it up is the ready-made <code>CLAUDE.template.md</code> that comes
        with the package: copy it to your project root as <code>CLAUDE.md</code>{" "}
        (Claude Code) or <code>AGENTS.md</code> (Cursor, Copilot). It&apos;s a
        one-line <code>@import</code> of <code>AGENT.md</code>, so the rules stay
        in one place and you never paste them by hand.
      </P>
      <CodeBlock title="wire up the guide (recommended)">{`# after: npm install @viliha/vui-ui
cp node_modules/@viliha/vui-ui/CLAUDE.template.md ./CLAUDE.md
# or ./AGENTS.md, and your agent reads it automatically`}</CodeBlock>
      <P>
        Prefer a self-contained copy over the <code>@import</code>? Copy{" "}
        <code>AGENT.md</code> itself:
      </P>
      <CodeBlock title="or copy the guide verbatim">{`cp node_modules/@viliha/vui-ui/AGENT.md AGENTS.md`}</CodeBlock>
      <Note title="Also on GitHub">
        The repo carries two companion files:{" "}
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
        <code>AGENT.md</code> is the one you want for <em>consuming</em> VUI
        downstream.
      </Note>

      <H2>How do I connect the VUI MCP server?</H2>
      <P>
        Run <code>npx @viliha/vui-ui mcp</code> and register it with your agent.
        The package ships an MCP server so an assistant can ask VUI direct
        questions (how do I install it, what components exist, what props a
        component takes, how the organizations page is built) instead of reading
        through <code>node_modules</code> and guessing. These docs ship with it
        as markdown, so it runs over stdio, needs no API key and no network, and
        answers for whatever version of the package you installed.
      </P>
      <CodeBlock title="register the server">{`# Claude Code
claude mcp add vui -- npx -y @viliha/vui-ui mcp

# Cursor, Windsurf, or any MCP client (.mcp.json / mcp.json)
{
  "mcpServers": {
    "vui": { "command": "npx", "args": ["-y", "@viliha/vui-ui", "mcp"] }
  }
}`}</CodeBlock>
      <P>Seven tools come with it:</P>
      <Ul>
        <li>
          <code>list_guides</code> — every page of this docs site, from
          Installation to the per-component reference. It ships inside the
          package as markdown, so it works offline and matches the version you
          installed.
        </li>
        <li>
          <code>get_guide</code> — one guide in full, as markdown with its code
          samples.
        </li>
        <li>
          <code>list_components</code> — every export with its import specifier,
          straight from the package&apos;s <code>src/</code>.
        </li>
        <li>
          <code>get_component</code> — the source for one component, or its
          public API (props and exported types) when the file is large, plus the
          doc sections that describe it.
        </li>
        <li>
          <code>list_pages</code> — the reference app&apos;s pages, layouts and
          shell components with their routes.
        </li>
        <li>
          <code>get_page</code> — the full source of any of those files, so the
          agent copies a working page instead of inventing one.
        </li>
        <li>
          <code>search_docs</code> — searches all of it at once:{" "}
          <code>AGENT.md</code>, the README, and every guide. Call it with no
          query to get the outline.
        </li>
      </Ul>
      <Note title="MCP is an addition, not a replacement">
        Keep the <code>CLAUDE.md</code> pointer above. It loads the rules every
        session; the MCP server answers the follow-up questions on demand. They
        read the same files, so the two never disagree.
      </Note>

      <H2>What the guide enforces</H2>
      <Ul>
        <li>
          <strong>Reuse first.</strong> Look for an existing component, layout,
          variant, or utility before creating anything new, and extend before
          you build.
        </li>
        <li>
          <strong>Tokens only.</strong> Never hard-code colors, spacing, radius,
          shadows, or typography. Read the semantic tokens from{" "}
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
          <code>fields</code> array, never hand-rolled HTML tables. Charts use{" "}
          <code>ChartContainer</code> plus Recharts with chart tokens.
        </li>
        <li>
          <strong>Accessibility and dark mode are mandatory:</strong> keyboard
          nav, visible focus, ARIA, WCAG AA, and both light and dark driven from
          tokens (no per-component color overrides).
        </li>
        <li>
          <strong>Keep business logic out of the UI</strong>, prefer Server
          Components, and always surface loading, empty, success, and error
          states.
        </li>
      </Ul>

      <H2>Package exports vs. reference-app patterns</H2>
      <P>
        The package ships the primitives: <code>Button</code>,{" "}
        <code>Input</code>, <code>Select</code>, <code>Dialog</code>,{" "}
        <code>Menu</code>, <code>RecordView</code>, <code>ChartContainer</code>,
        and <code>theme.css</code>. The app-shell pieces the guide references{" "}(
        <code>SetPageTitle</code>, <code>Breadcrumbs</code>, the sidebar and{" "}
        <code>nav-config</code>, and the <code>AuthCard*</code> auth screens) are{" "}
        <strong>reference-app patterns to copy</strong> from the backoffice demo
        rather than package exports. The shipped <code>AGENT.md</code> makes this
        distinction explicit so your agent won&apos;t invent imports.
      </P>

      <DocPager
        prev={{ label: "Navigation & tabs", href: "/docs/navigation" }}
        next={{ label: "Using shadcn/ui", href: "/docs/shadcn-ui" }}
      />
    </article>
  );
}
