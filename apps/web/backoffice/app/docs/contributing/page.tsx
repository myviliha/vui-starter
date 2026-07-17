import type { Metadata } from "next";

import { CodeBlock, DocPager, H2, P, PageTitle, Ul } from "@/components/doc";

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "Contribute to Vui Starter — local setup, useful scripts, where things live, and the pull-request workflow.",
};

export default function ContributingPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Community"
        title="Contributing"
        lead="Vui Starter is MIT-licensed and open to contributions — bug fixes, new components, docs, and demos are all welcome."
      />

      <H2>Local setup</H2>
      <P>Requires Node 18+ and pnpm 9+.</P>
      <CodeBlock title="terminal">{`git clone https://github.com/myviliha/vui-starter.git
cd vui-starter
pnpm install
pnpm dev            # backoffice :3001 · public :3000 · docs :3002`}</CodeBlock>

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
          <code>apps/web/backoffice</code> — the admin demo that dogfoods the library.
        </li>
        <li>
          <code>apps/docs/documentation</code> — this documentation site.
        </li>
      </Ul>

      <H2>Pull requests</H2>
      <Ul>
        <li>Branch off <code>main</code>, keep changes focused.</li>
        <li>
          Run <code>pnpm lint</code> and <code>pnpm check-types</code> before pushing —
          CI runs lint, types, build, and security scanning on every PR.
        </li>
        <li>
          Match the surrounding code style; the design system is token-driven, so
          prefer editing <code>theme.css</code> tokens over hard-coded values.
        </li>
        <li>
          See <code>CONTRIBUTING.md</code> and <code>CODE_OF_CONDUCT.md</code> in the repo.
        </li>
      </Ul>

      <H2>License</H2>
      <P>
        MIT © Suman Bonakurthi. Free for personal and commercial use.
      </P>

      <DocPager prev={{ label: "Charts", href: "/docs/charts" }} />
    </article>
  );
}
