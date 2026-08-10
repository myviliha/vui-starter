import { CardGrid, CaseStudyGrid, Cta, Hero, LogoCloud, Stats, Testimonials } from "@viliha/vui-web";

import { CASE_STUDIES } from "@/lib/catalog";
import { CUSTOMERS, LOGOS, STATS, TESTIMONIALS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Customers",
  description: "What teams built with the library, what changed for them, and what they said afterwards.",
  path: "/customers/",
});

export default function CustomersPage() {
  return (
    <>
      <Hero variant="minimal" eyebrow="Customers" title="What teams shipped with it" lead="Three stories, with the numbers they measured rather than the adjectives they used." />
      <LogoCloud title="Teams using it" items={LOGOS} />
      <CaseStudyGrid items={CUSTOMERS} tone="muted" />
      <Testimonials variant="single" items={[TESTIMONIALS[0]!]} />
      <Testimonials title="More from customers" items={TESTIMONIALS} variant="columns" tone="muted" />
      <Stats items={STATS} />
      <CardGrid
        eyebrow="Case studies"
        title="The longer versions"
        lead="Each one includes what did not work, because a case study without that is a brochure."
        columns={3}
        items={CASE_STUDIES.map((c) => ({
          title: c.title,
          body: c.summary,
          meta: c.category,
          href: `/customers/${c.slug}/`,
        }))}
      />
      <Cta title="Tell us what you built" lead="We feature real stories, and we link back to you." actions={<LinkButton href="/contact/">Get in touch</LinkButton>} />
    </>
  );
}
