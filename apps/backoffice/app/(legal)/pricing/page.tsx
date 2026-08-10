import type { Metadata } from "next";

import { TierCard } from "@/components/tier-card";
import { PRO } from "@/lib/app-config";
import { canonicalFor } from "@/lib/seo";
import { LegalSection } from "../_components/legal";

const title = "Pricing: VUI is free and MIT, Pro is optional";
const description =
  "The VUI component library, CLI, demo app, templates and docs are MIT and free forever. VUI Pro is an optional paid add-on of net-new premium blocks, framework components and support.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalFor("/pricing") },
  openGraph: { title, description, url: canonicalFor("/pricing") },
  twitter: { title, description },
};

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is the free version going away?",
    a: (
      <>
        No. The library, the CLI, the demo app, the templates and the docs are MIT
        and stay MIT. Every version already published is MIT permanently, so nothing
        that is free today can be taken away later, by us or by anyone else. Pro is
        additional work sold alongside it, not a fence around what exists.
      </>
    ),
  },
  {
    q: "What license is Pro?",
    a: (
      <>
        A commercial license, per developer, perpetual for the version you buy. You
        get the source and can use it in unlimited projects, including client work.
        You cannot resell or republish it. The full terms ship with the package.
      </>
    ),
  },
  {
    q: "Do I need Pro to use VUI commercially?",
    a: (
      <>
        No. MIT already lets you ship VUI in commercial products with no payment and
        no attribution requirement. Pro buys extra components and our time, not
        permission.
      </>
    ),
  },
  {
    q: "What about refunds?",
    a: <>Fourteen days, no questions. Email us and we refund it.</>,
  },
];

export default function PricingPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Pricing
      </h1>
      <p className="mt-2 mb-8 text-sm leading-relaxed text-muted-foreground">
        VUI is free and MIT licensed. It stays that way. Pro is an optional add-on
        for teams that want the parts we have not given away, plus someone to ask.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <TierCard
          amount="Free"
          perk="Everything published today, MIT licensed, forever."
          href="/docs/installation"
          cta="Get started"
          bullets={[
            "The full React component library",
            "Datatable, record forms, charts, auth screens",
            "28 demo pages and the init scaffolder",
            "The theme as plain CSS for any framework",
            "Docs, requirement templates and the MCP server",
          ]}
        />
        <TierCard
          amount={PRO.available ? PRO.price : "Pro"}
          cadence={PRO.available ? PRO.cadence : "in development"}
          perk={
            PRO.available
              ? "Premium blocks and components we build on top of the free core."
              : "Not built yet. Tell us what you need and it goes to the front of the queue."
          }
          href={PRO.checkoutUrl}
          cta={PRO.available ? "Buy Pro" : "Register interest"}
          featured
          bullets={[
            "Premium blocks: billing, roles and permissions, audit log, inbox",
            "Datatable and record forms for Vue and Svelte",
            "Priority on bug reports",
            "Commercial license and an invoice",
          ]}
        />
        <TierCard
          amount="Team"
          cadence="talk to us"
          perk="Bigger teams, procurement, or work you want built."
          href={`mailto:${PRO.contactEmail}?subject=VUI%20for%20teams`}
          cta="Get in touch"
          bullets={[
            "Site license for the whole team",
            "A named counterparty for your legal review",
            "Custom blocks and framework ports, quoted",
          ]}
        />
      </div>

      <p className="mt-6 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">
          Pro is not on sale yet.
        </strong>{" "}
        We would rather build the blocks people actually ask for than guess and ship
        a list nobody wanted. Tell us which ones matter and you set the order.
      </p>

      <LegalSection id="questions" title="Questions">
        <dl className="space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </LegalSection>

      <p className="mt-8 text-sm text-muted-foreground">
        Not buying anything and just want to help?{" "}
        <a
          href="/docs/sponsor"
          className="font-medium text-foreground underline"
        >
          Sponsorship
        </a>{" "}
        keeps the free core maintained.
      </p>
    </>
  );
}
