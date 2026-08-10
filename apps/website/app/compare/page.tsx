import { ComparisonTable, Cta, Faq, Hero, Pricing } from "@viliha/vui-web";

import { COMPARISON, FAQS, PLANS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Compare plans",
  description:
    "A row-by-row comparison of the Free and Pro plans in VUI: what each includes, what it costs, and what stays MIT.",
  path: "/compare/",
});

export default function ComparePage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="grid"
        eyebrow="Compare"
        title="Free against Pro, row by row"
        lead="The short version: everything published today is MIT and stays MIT. Pro is additive work on top of it."
      />
      <ComparisonTable
        title="Every row, both plans"
        lead="A blank cell means it is not there. We would rather say so than leave it ambiguous."
        plans={PLANS.map((p) => p.name)}
        rows={COMPARISON}
      />
      <Pricing plans={PLANS} showToggle yearlyNote="Save 20%" tone="muted" />
      <Faq eyebrow="Questions" title="About the plans" items={FAQS} defaultOpen={0} />
      <Cta
        title="Start on the free plan"
        lead="There is no trial to expire, because the free plan is not a trial."
        actions={
          <>
            <LinkButton href="/pricing/">See pricing</LinkButton>
            <LinkButton href="/contact/" variant="secondary">Ask about Pro</LinkButton>
          </>
        }
      />
    </>
  );
}
