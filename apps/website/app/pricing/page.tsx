import { ComparisonTable, Cta, Faq, Hero, Pricing } from "@viliha/vui-web";

import { FAQS, PLANS } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Pricing",
  description:
    "Free forever and MIT licensed, including the datatable. Pro adds premium blocks, framework components and support. Compare every plan feature by feature.",
  path: "/pricing/",
});

const ROWS = [
  { group: "Components", label: "React component library", values: [true, true, true] },
  { group: "Components", label: "Website blocks", values: [true, true, true] },
  { group: "Components", label: "Datatable and record forms", values: ["React", "React, Vue, Svelte", "React, Vue, Svelte"] },
  { group: "Components", label: "Premium blocks", values: [false, true, true] },
  { group: "Tooling", label: "CLI scaffolder", values: [true, true, true] },
  { group: "Tooling", label: "MCP server for agents", values: [true, true, true] },
  { group: "Licence", label: "Commercial use", values: [true, true, true] },
  { group: "Licence", label: "Invoice and named counterparty", values: [false, true, true] },
  { group: "Support", label: "Issues and discussions", values: [true, true, true] },
  { group: "Support", label: "Priority on bug reports", values: [false, true, true] },
  { group: "Support", label: "Site licence", values: [false, false, true] },
];

export default function PricingPage() {
  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="Pricing"
        title="Free forever, with an optional Pro"
        lead="Everything published is MIT and stays MIT, including the datatable most libraries hold back. Pro is net-new work, and it is honest about not existing yet."
      />
      <Pricing plans={PLANS} showToggle yearlyNote="Save 20%" footnote="Prices in USD, excluding tax." />
      <ComparisonTable
        title="Every difference, in one table"
        plans={["Free", "Pro", "Team"]}
        rows={ROWS}
        tone="muted"
      />
      <Faq title="Pricing questions" items={FAQS.filter((f) => f.category === "Pricing")} />
      <Cta
        variant="card"
        title="Still deciding?"
        lead="Start on Free. Nothing expires, and nothing you build has to be rewritten if you upgrade."
        actions={
          <a href="/contact/" className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]">
            Talk to us
          </a>
        }
      />
    </>
  );
}
