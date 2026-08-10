import {
  CaseStudyGrid,
  Cta,
  Faq,
  FeatureGrid,
  Hero,
  LogoCloud,
  ProcessSteps,
  Pricing,
  Stats,
  Testimonials,
} from "@viliha/vui-web";

import { CUSTOMERS, FAQS, FEATURES, LOGOS, PLANS, STATS, STEPS, TESTIMONIALS } from "@/lib/content";
import { SITE, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  path: "/",
});

/**
 * The home page, in the order section 26 of the requirements recommends:
 * hero, logos, features, stats, how it works, proof, pricing, FAQ, CTA.
 *
 * Every section here is a block with content passed in. There is no bespoke
 * markup on this page, which is the test the block library has to pass: if a
 * page needs a one-off section, the block set is missing something.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        variant="product"
        eyebrow="Now with Vue"
        title="The admin app your team will enjoy using"
        lead="Datatables, forms, charts and auth screens that already match each other. Scaffolded into your repo, MIT licensed, yours to own."
        actions={
          <>
            <a
              href="/pricing/"
              className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors hover:bg-[var(--button-primary-hover)]"
            >
              Start free
            </a>
            <a
              href="/features/"
              className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
            >
              See the features
            </a>
          </>
        }
        footnote="MIT licensed. No card, no trial clock, no seat limit."
        visual={
          <div className="grid aspect-[16/9] w-full place-items-center bg-muted/40 text-muted-foreground">
            {/* A real screenshot goes here. The frame reserves the space either
                way, so the page never jumps once it loads. */}
            <span className="text-caption">Product screenshot</span>
          </div>
        }
      />

      <LogoCloud title="Used by teams at" items={LOGOS} variant="marquee" />

      <FeatureGrid
        eyebrow="What you get"
        title="An admin app, not a box of parts"
        lead="The pieces that usually take a quarter to build well, already built and already consistent."
        items={FEATURES}
      />

      <Stats items={STATS} tone="muted" />

      <ProcessSteps
        eyebrow="How it works"
        title="Four steps, one afternoon"
        items={STEPS}
      />

      <Testimonials
        eyebrow="Customers"
        title="What teams say after shipping"
        items={TESTIMONIALS}
        tone="muted"
      />

      <CaseStudyGrid
        eyebrow="Case studies"
        title="What changed for them"
        items={CUSTOMERS}
      />

      <Pricing
        eyebrow="Pricing"
        title="Free forever, with an optional Pro"
        lead="Everything published is MIT and stays MIT. Pro is additive work that does not exist yet."
        plans={PLANS}
        showToggle
        yearlyNote="Save 20%"
        footnote="Prices in USD. Team pricing is per organization, not per seat."
        tone="muted"
      />

      <Faq eyebrow="Questions" title="Before you ask" items={FAQS} defaultOpen={0} />

      <Cta
        title="Build your admin app this week"
        lead="Install it, point it at your API, and spend your time on the parts that are actually your product."
        actions={
          <>
            <a
              href="/pricing/"
              className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors hover:bg-[var(--button-primary-hover)]"
            >
              Start free
            </a>
            <a
              href="/contact/"
              className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Talk to us
            </a>
          </>
        }
        footnote="No card required."
      />
    </>
  );
}
