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
  alternates: { canonical: "/docs/contributing/" },
  title: "Contributing",
  description:
    "Contribute to Vui Starter — local setup, the agent-assisted workflow (AGENTS.md), where things live, and the pull-request workflow.",
};

export default function ContributingPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Community"
        title="Contributing"
        lead="Vui Starter is MIT-licensed and open to contributions — bug fixes, new components, docs, and demos are all welcome. This page covers changing the theme itself; to build your own app with VUI, see Building with AI agents instead."
      />

      <Note title="Which guide do I need?">
        Two scenarios, two homes for the rules.{" "}
        <strong>Contributing to the theme</strong> (this page) — humans follow{" "}
        <code>CONTRIBUTING.md</code>, agents follow <code>AGENTS.md</code>.{" "}
        <strong>Using the theme in your own app</strong> — see{" "}
        <a
          href="/docs/ai-agents"
          className="font-medium text-foreground underline"
        >
          Building with AI agents
        </a>
        .
      </Note>

      <H2>Local setup</H2>
      <P>Requires Node 18+ and pnpm 9+.</P>
      <CodeBlock title="terminal">{`git clone https://github.com/myviliha/vui-starter.git
cd vui-starter
pnpm install
pnpm dev            # backoffice + docs on :3000`}</CodeBlock>

      <H2>Contributing with an AI agent</H2>
      <P>
        The repo ships deterministic, machine-checkable rules for coding agents
        in <code>AGENTS.md</code> — the filename Claude Code, Cursor, and Copilot
        auto-load. It spells out where new components, pages, tokens, and
        navigation go, the hard rules (Server Components first, no <code>any</code>,
        no hard-coded design values, reuse before you create), and the commands a
        change must pass before it&apos;s &quot;done&quot;. Point your agent at
        the repo and it holds to the same standards a human reviewer expects.
      </P>
      <CodeBlock title="verify before a PR">{`pnpm --filter @viliha/vui-ui check-types
pnpm --filter backoffice lint     # eslint --max-warnings 0
pnpm --filter backoffice build`}</CodeBlock>

      <H2>Useful scripts</H2>
      <CodeBlock title="terminal">{`pnpm dev            # run all apps
pnpm build          # build everything (Turborepo)
pnpm lint           # zero-warning lint
pnpm check-types    # type-check`}</CodeBlock>

      <H2>Where things live</H2>
      <Ul>
        <li>
          <code>packages/ui</code> — the <code>@viliha/vui-ui</code> library
          (edit components + <code>theme.css</code> here).
        </li>
        <li>
          <code>apps/backoffice</code> — the admin demo that dogfoods the
          library and hosts this documentation site under{" "}
          <code>app/docs</code>.
        </li>
      </Ul>

      <H2>Changelog &amp; docs (required)</H2>
      <Note variant="warning" title="Every change updates the changelog and docs">
        This is mandatory for everyone — humans and AI agents. In the same PR, add
        an entry to <code>packages/ui/CHANGELOG.md</code> (and bump{" "}
        <code>packages/ui/package.json</code> per semver if it ships in the
        package), and update every doc that describes the change —{" "}
        <code>README.md</code>, <code>AGENT.md</code>, the relevant{" "}
        <code>/docs</code> page, and the requirement templates. A change with no
        changelog or docs update is incomplete.
      </Note>

      <H2>Pull requests</H2>
      <Ul>
        <li>Branch off <code>main</code>, keep changes focused.</li>
        <li>
          Run <code>pnpm lint</code> and <code>pnpm check-types</code> before pushing —
          CI runs lint, types, build, and security scanning on every PR.
        </li>
        <li>
          Match the surrounding code style. The design system is token-driven, so
          reach for a <code>theme.css</code> token before any hard-coded value.
        </li>
        <li>
          See <code>CONTRIBUTING.md</code> and <code>CODE_OF_CONDUCT.md</code> in the repo.
        </li>
      </Ul>

      <H2>License</H2>
      <P>
        MIT © Suman Bonakurthi. Free for personal and commercial use.
      </P>

      <DocPager prev={{ label: "Calendar", href: "/docs/calendar" }} />
    </article>
  );
}
