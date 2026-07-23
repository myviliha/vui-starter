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
  alternates: { canonical: "/docs/configuration/" },
  title: "Configuration",
  description:
    "Configure the Vui Starter app per deployment with environment variables — rebrand the footer (company, year, license) with no code changes.",
};

export default function ConfigurationPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Configuration"
        lead="Per-deployment settings live in environment variables, so you can rebrand a clone without editing code. Copy apps/backoffice/.env.example to .env.local and set what you need — everything is optional and falls back to sensible defaults."
      />

      <H2>Footer identity</H2>
      <P>
        The app shell renders a slim footer (the app and auth layouts both use
        it) whose copyright line is env-driven. It resolves from a single{" "}
        <code>FOOTER_NOTICE</code> in <code>lib/seo.ts</code>, so both layouts
        stay in sync — set any of these and rebuild:
      </P>
      <CodeBlock title=".env.local">{`# All optional; unset falls back to the default notice.
NEXT_PUBLIC_COMPANY_NAME="Acme Inc."
NEXT_PUBLIC_COPYRIGHT_YEAR="2026"
NEXT_PUBLIC_LICENSE="All rights reserved"

# …or override the whole line at once (wins over the three above):
NEXT_PUBLIC_FOOTER_NOTICE="© 2026 Acme Inc. · All rights reserved"

# Max pages kept open in the tab strip (default 5, min 1):
NEXT_PUBLIC_MAX_TABS="5"`}</CodeBlock>
      <Ul>
        <li>
          <code>NEXT_PUBLIC_COMPANY_NAME</code> — company shown in the footer.
        </li>
        <li>
          <code>NEXT_PUBLIC_COPYRIGHT_YEAR</code> — the copyright year.
        </li>
        <li>
          <code>NEXT_PUBLIC_LICENSE</code> — the license/rights text.
        </li>
        <li>
          <code>NEXT_PUBLIC_FOOTER_NOTICE</code> — replaces the entire line,
          taking precedence over the three above.
        </li>
        <li>
          <code>NEXT_PUBLIC_MAX_TABS</code> — how many pages the tab strip keeps
          open before evicting the oldest (default 5).
        </li>
      </Ul>
      <P>
        Leave everything unset and the footer keeps its default:{" "}
        <code>© 2026 VILIHA PTE. LTD. · MIT Licensed</code>.
      </P>

      <Note title="Build-time values">
        <code>NEXT_PUBLIC_</code> vars are inlined at <strong>build time</strong>{" "}
        into the static export — set them where your deploy runs{" "}
        <code>pnpm build</code>, not just at runtime. Changing one means a
        rebuild, not a restart.
      </Note>

      <DocPager
        prev={{ label: "Installation", href: "/docs/installation" }}
        next={{ label: "Theming", href: "/docs/theming" }}
      />
    </article>
  );
}
