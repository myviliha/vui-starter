import { Cta, Hero, QuoteBlock, Stats, TeamGrid } from "@viliha/vui-web";

import { LEADERSHIP } from "@/lib/catalog";
import { LinkButton } from "@/app/_components/link-button";
import { STATS, TEAM } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Team",
  description:
    "Who builds VUI: a small, remote team that writes its decisions down and keeps the library open source.",
  path: "/team/",
});

export default function TeamPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="dots"
        eyebrow="Team"
        title="A small team, on purpose"
        lead="Few people, little process, and no layer between whoever notices a problem and whoever fixes it."
      />
      <TeamGrid eyebrow="Leadership" title="Who is accountable" items={LEADERSHIP} columns={2} />
      <TeamGrid eyebrow="Team" title="Who builds it" items={TEAM} columns={4} tone="muted" />
      <Stats items={STATS} />
      <QuoteBlock
        quote="The best code is the code you never write. The second best is the code someone already wrote well, gave away, and still maintains."
        author="Suman Bonakurthi"
        authorRole="Founder"
        tone="muted"
      />
      <Cta
        title="Come and build with us"
        lead="We hire slowly and rarely. Send a note anyway if the work looks like yours."
        actions={
          <>
            <LinkButton href="/careers/">See open roles</LinkButton>
            <LinkButton href="/contact/" variant="secondary">Introduce yourself</LinkButton>
          </>
        }
      />
    </>
  );
}
