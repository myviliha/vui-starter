import { CaseStudyGrid, Cta, Hero, LogoCloud, Stats, Testimonials } from "@viliha/vui-web";

import { CUSTOMERS, LOGOS, STATS, TESTIMONIALS } from "@/lib/content";
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
      <Cta title="Tell us what you built" lead="We feature real stories, and we link back to you." actions={<a href="/contact/" className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]">Get in touch</a>} />
    </>
  );
}
