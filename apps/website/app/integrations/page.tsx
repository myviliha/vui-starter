import { CardGrid, Cta, Hero } from "@viliha/vui-web";

import { INTEGRATIONS } from "@/lib/content";
import { INTEGRATION_PAGES } from "@/lib/catalog";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Integrations",
  description: "What the library plugs into: authentication, billing, charts, and the frameworks it renders in.",
  path: "/integrations/",
});

export default function IntegrationsPage() {
  return (
    <>
      <Hero variant="minimal" eyebrow="Integrations" title="It plugs into what you already use" lead="No runtime service of our own. Authentication, billing and charts are yours to choose; we ship the screens on top." />
      <CardGrid items={INTEGRATIONS} columns={3} />
      <CardGrid
        eyebrow="Guides"
        title="How to wire the common ones"
        columns={3}
        items={INTEGRATION_PAGES.map((i) => ({
          title: i.title,
          body: i.summary,
          meta: i.category,
          href: `/integrations/${i.slug}/`,
        }))}
      />
      <Cta variant="card" title="Missing one?" lead="Tell us what you use and we will document the wiring, or build the adapter." actions={<LinkButton href="/contact/">Request an integration</LinkButton>} />
    </>
  );
}
