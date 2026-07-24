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
        The app shell renders a slim footer, shared by the app and auth layouts,
        and its copyright line is env-driven. Both layouts resolve it from a
        single <code>FOOTER_NOTICE</code> in <code>lib/seo.ts</code>, so they
        never drift out of sync. Set any of these and rebuild:
      </P>
      <CodeBlock title=".env.local">{`# All optional; unset falls back to the defaults.
NEXT_PUBLIC_COMPANY_NAME="Acme Inc."
NEXT_PUBLIC_COMPANY_URL="https://acme.com"   # links the company name in the footer
NEXT_PUBLIC_LICENSE="All rights reserved"
# The copyright year is automatic (current/build year) — no env needed.

NEXT_PUBLIC_LOGO_URL="/logo.svg"             # your logo from /public; else built-in mark

# …or override the whole footer line at once (wins over the vars above):
NEXT_PUBLIC_FOOTER_NOTICE="© 2026 Acme Inc. · All rights reserved"

# Max pages kept open in the tab strip (default 5, min 1):
NEXT_PUBLIC_MAX_TABS="5"

# How a collapsed sidebar rail reveals a group's sub-items — inline,
# flyout-click, or flyout-hover (default flyout-hover):
NEXT_PUBLIC_SIDEBAR_GROUP_MODE="flyout-hover"`}</CodeBlock>
      <Ul>
        <li>
          <code>NEXT_PUBLIC_COMPANY_NAME</code> — company shown in the footer.
        </li>
        <li>
          <code>NEXT_PUBLIC_COMPANY_URL</code> — optional; links the company name.
        </li>
        <li>
          <code>NEXT_PUBLIC_LICENSE</code> — the license/rights text.
        </li>
        <li>
          <strong>Copyright year</strong> — automatic (always the current /
          build year); there is no env var for it.
        </li>
        <li>
          <code>NEXT_PUBLIC_LOGO_URL</code> — your logo image from{" "}
          <code>/public</code> (e.g. <code>/logo.svg</code>); falls back to the
          built-in mark.
        </li>
        <li>
          <code>NEXT_PUBLIC_FOOTER_NOTICE</code> — replaces the entire footer
          line, taking precedence over the vars above.
        </li>
        <li>
          <code>NEXT_PUBLIC_MAX_TABS</code> — how many pages the tab strip keeps
          open before evicting the oldest (default 5).
        </li>
        <li>
          <code>NEXT_PUBLIC_SIDEBAR_GROUP_MODE</code> — how a collapsed sidebar
          rail reveals a group&apos;s sub-items: <code>inline</code> (expands
          in the rail), <code>flyout-click</code> (click opens a floating
          panel), or <code>flyout-hover</code> (hover opens it; default).
        </li>
      </Ul>
      <P>
        Leave everything unset and the footer keeps its default:{" "}
        <code>© 2026 VILIHA PTE. LTD. · MIT Licensed</code>.
      </P>

      <H2>Logo &amp; branding</H2>
      <P>
        Rename the app with one env var — <code>NEXT_PUBLIC_APP_NAME</code> sets
        the brand name shown in the sidebar, the wordmark, the auth screens, and
        page titles (it defaults to <code>Vui Starter</code>):
      </P>
      <CodeBlock title=".env.local">{`NEXT_PUBLIC_APP_NAME="Acme Console"`}</CodeBlock>
      <P>
        There are two ways to set your logo, and the common case needs no
        component code at all:
      </P>
      <Ul>
        <li>
          <strong>Drop an image + one env var.</strong> Put your file in{" "}
          <code>public/</code> (e.g. <code>public/logo.svg</code>) and set{" "}
          <code>NEXT_PUBLIC_LOGO_URL=&quot;/logo.svg&quot;</code>, then rebuild. It
          renders in the sidebar header (and anywhere <code>&lt;Logo /&gt;</code>{" "}
          is used).
        </li>
        <li>
          <strong>Leave it unset</strong> → the built-in rounded badge with a
          stylised &ldquo;V&rdquo; shows instead. Its color is the{" "}
          <code>--brand-indigo</code> token — change it in{" "}
          <a href="/docs/theming" className="font-medium text-foreground underline">theme.css</a>{" "}
          to recolor the fallback.
        </li>
      </Ul>
      <P>
        For more control — a separate wordmark, a dark-mode variant, or custom
        sizing — edit <code>app/_components/logo.tsx</code> directly (it takes a{" "}
        <code>variant</code> and <code>className</code>).
      </P>

      <H2>Open tabs</H2>
      <P>
        <code>NEXT_PUBLIC_MAX_TABS</code> (above) caps how many pages the tab strip
        keeps open. The strip itself is an app-shell pattern you wire in — see{" "}
        <a href="/docs/navigation" className="font-medium text-foreground underline">
          Navigation &amp; tabs
        </a>{" "}
        for the setup.
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
