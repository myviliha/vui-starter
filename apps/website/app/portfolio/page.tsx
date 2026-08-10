import { CardGrid, Cta, Hero, Stats } from "@viliha/vui-web";

import { LinkButton } from "@/app/_components/link-button";
import { PORTFOLIO } from "@/lib/catalog";
import { STATS } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Portfolio",
  description:
    "Selected work built on VUI: fleet operations, merchandising, plant maintenance and subscription admin.",
  path: "/portfolio/",
});

export default function PortfolioPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="grid"
        eyebrow="Portfolio"
        title="Work shipped on it"
        lead="Four platforms, four industries, the same components underneath. Each links to the story behind it."
      />
      <CardGrid columns={2} items={PORTFOLIO} />
      <Stats items={STATS} tone="muted" />
      <Cta
        title="Yours could be next"
        lead="Tell us what you are building and we will say honestly whether this is the right base for it."
        actions={
          <>
            <LinkButton href="/contact/">Talk to us</LinkButton>
            <LinkButton href="/customers/" variant="secondary">Read the case studies</LinkButton>
          </>
        }
      />
    </>
  );
}
