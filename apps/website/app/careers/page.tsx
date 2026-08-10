import { Benefits, CardGrid, Cta, EmptyState, Hero, ProcessSteps, TeamGrid } from "@viliha/vui-web";

import { JOBS } from "@/lib/catalog";
import { LinkButton } from "@/app/_components/link-button";
import { TEAM } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Careers",
  description: "How we work, what we offer, and the roles that are open. Small team, open source, remote.",
  path: "/careers/",
});

const ROLES = JOBS.map((job) => ({
  title: job.title,
  meta: job.meta,
  body: job.summary,
  href: `/careers/${job.slug}/`,
  tags: job.tags,
}));


const PERKS = [
  { title: "Remote, genuinely", body: "No core hours beyond a couple that overlap. We write things down instead of meeting about them." },
  { title: "Open source by default", body: "Your work is public, which means it is portfolio you keep when you leave." },
  { title: "Small on purpose", body: "Few people, little process, and no layer between you and the decision." },
  { title: "Time to do it properly", body: "We would rather ship one component that holds up than five that need rewriting." },
];

const HIRING = [
  { title: "A short reply", body: "Tell us what you have built. A link beats a cover letter." },
  { title: "A conversation", body: "45 minutes on what you like working on and what you avoid." },
  { title: "Paid work sample", body: "A real, small task. Paid at our contractor rate, yours to keep either way." },
  { title: "Offer", body: "Within a week of the sample. We tell you either way." },
];

export default function CareersPage() {
  return (
    <>
      <Hero variant="minimal" eyebrow="Careers" title="Build the thing other teams build on" lead="A small, open-source team. The work is public, the decisions are written down, and the roadmap comes from real requests." />
      <Benefits eyebrow="How we work" title="What you get, beyond the salary" items={PERKS} tone="muted" />
      <TeamGrid eyebrow="Team" title="Who you would work with" items={TEAM} columns={2} />
      <ProcessSteps eyebrow="Hiring" title="Four steps, about two weeks" items={HIRING} tone="muted" />
      {ROLES.length > 0 ? (
        <CardGrid eyebrow="Open roles" title="Roles we are hiring for" items={ROLES} columns={2} />
      ) : (
        <EmptyState title="No open roles right now" body="We hire slowly and rarely. Send a note anyway if the work looks like yours." action={<a href="/contact/" className="text-sm font-medium text-[var(--button-primary)] underline underline-offset-4">Introduce yourself</a>} />
      )}
      <Cta title="Not seeing your role?" lead="Tell us what you would want to work on. We have hired from cold emails before." actions={<LinkButton href="/contact/">Write to us</LinkButton>} />
    </>
  );
}
