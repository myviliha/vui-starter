import type { Metadata } from "next";

import { DocPager, H2, Note, P, PageTitle, Ul } from "@/components/doc";
import { PlanMatrix } from "@/components/plan-matrix";
import { planCounts } from "@/lib/plans";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/free-and-pro/" },
  title: "What is free and what is Pro",
  description:
    "Everything VUI ships today is MIT and free: the theme, the layout and app shell, every component including the datatable, the CLI and the docs. VUI Pro is optional, additive and not built yet. This page lists both, area by area.",
};

const counts = planCounts();

export default function FreeAndProPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="What is free and what is Pro"
        lead="Short answer: everything you can install today is free and MIT, including the datatable most libraries hold back. Pro is a small list of things that do not exist yet. This page is the full breakdown so you never have to guess."
      />

      <Note title="The one-line version" variant="tip">
        {counts.free} things are free and always will be. {counts.pro} are
        planned for Pro, and none of them are built yet, so nothing you see in
        the demo is behind a paywall.
      </Note>

      <H2>The full list</H2>
      <PlanMatrix />

      <H2>Why is the datatable free?</H2>
      <P>
        Because it already is. <code>RecordView</code> has been MIT since the
        first release, and every published version stays MIT permanently. We
        could stop shipping it tomorrow and you could still install 1.64 forever,
        so pretending otherwise would be theatre. It is also the best argument
        for the library, and an argument you cannot make from behind a paywall.
      </P>

      <H2>Then what is Pro?</H2>
      <P>Work that does not exist yet, and would not exist without funding it:</P>
      <Ul>
        <li>
          <strong>Premium blocks</strong> the free demo deliberately does not
          include: billing and subscriptions, roles and permissions, an audit
          log, an inbox.
        </li>
        <li>
          <strong>The datatable and record forms for Vue and Svelte.</strong> The
          React one is free and stays free; porting it to another framework is
          months of new work per framework.
        </li>
        <li>
          <strong>Priority support and a commercial licence</strong>, for teams
          whose procurement wants an invoice and a named counterparty. MIT
          already permits commercial use, so what you would buy is our time and a
          signature, not permission.
        </li>
      </Ul>

      <Note title="Nothing free moves to Pro">
        This is the part worth being blunt about, because plenty of projects have
        done the opposite. Everything on the free list above stays free. Pro can
        only ever be additive, and if that ever changes you will be able to keep
        using the version you have, under the licence it shipped with.
      </Note>

      <H2>Where to look next</H2>
      <Ul>
        <li>
          <a href="/pricing" className="font-medium text-foreground underline">
            Pricing
          </a>{" "}
          for the tiers and what Pro would cost.
        </li>
        <li>
          <a
            href="/docs/frameworks"
            className="font-medium text-foreground underline"
          >
            Frameworks
          </a>{" "}
          for what exists in React, Vue and everywhere else.
        </li>
        <li>
          <a
            href="/docs/swapping"
            className="font-medium text-foreground underline"
          >
            Swapping defaults
          </a>{" "}
          for icons, CSS, fonts, charts and motion.
        </li>
      </Ul>

      <DocPager
        prev={{ label: "Installation", href: "/docs/installation" }}
        next={{ label: "Any framework", href: "/docs/frameworks" }}
      />
    </article>
  );
}
