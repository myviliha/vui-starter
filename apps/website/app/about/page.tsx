import { Benefits, Cta, Hero, QuoteBlock, Stats, TeamGrid, Timeline } from "@viliha/vui-web";

import { LinkButton } from "@/app/_components/link-button";
import { MILESTONES, STATS, TEAM, VALUES } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "About",
  description:
    "Why this design system exists, what it stands for, the milestones so far, and the people building it.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="About"
        title="We got tired of rebuilding the same admin app"
        lead="Every product needs tables, forms and a settings screen. Nobody should spend a quarter on them, and nobody should pay per seat for a component library."
      />
      <QuoteBlock
        quote="The best code is the code you never write. The second best is the code someone already wrote well, gave away, and still maintains."
        author="Suman Bonakurthi"
        authorRole="Founder"
      />
      <Benefits eyebrow="What we stand for" title="Four rules we actually follow" items={VALUES} tone="muted" />
      <Stats items={STATS} />
      <Timeline eyebrow="History" title="How it got here" items={MILESTONES} tone="muted" />
      <TeamGrid eyebrow="Team" title="Who builds it" items={TEAM} columns={2} />
      <Cta
        title="Come and build with us"
        lead="The library is open, the issues are public, and the roadmap is decided by what people actually ask for."
        actions={
          <>
            <LinkButton href="/careers/">See open roles</LinkButton>
            <LinkButton href="https://github.com/myviliha/vui-starter" variant="secondary">Browse the code</LinkButton>
          </>
        }
      />
    </>
  );
}
