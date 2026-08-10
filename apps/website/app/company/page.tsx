import { Benefits, Cta, Hero, Stats, TeamGrid, Timeline } from "@viliha/vui-web";

import { LEADERSHIP } from "@/lib/catalog";
import { LinkButton } from "@/app/_components/link-button";
import { MILESTONES, STATS, VALUES } from "@/lib/content";
import { SITE, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Company",
  description: `${SITE.company} at a glance: what we do, how we are structured, the numbers, and who is accountable for what.`,
  path: "/company/",
});

export default function CompanyPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="grid"
        eyebrow="Company"
        title={SITE.company}
        lead="A small software company that maintains an open-source component library and sells the work around it."
      />
      <Stats items={STATS} />
      <Benefits eyebrow="How we operate" title="Four rules we actually follow" items={VALUES} tone="muted" />
      <Timeline eyebrow="History" title="How it got here" items={MILESTONES} />
      <TeamGrid eyebrow="Leadership" title="Who is accountable" items={LEADERSHIP} columns={2} tone="muted" />
      <Cta
        title="Work with us, or for us"
        lead="Both start the same way: tell us what you are trying to build."
        actions={
          <>
            <LinkButton href="/contact/">Get in touch</LinkButton>
            <LinkButton href="/careers/" variant="secondary">See open roles</LinkButton>
          </>
        }
      />
    </>
  );
}
