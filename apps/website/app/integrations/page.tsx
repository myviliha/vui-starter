import { CardGrid, Cta, Hero } from "@viliha/vui-web";

import { INTEGRATIONS } from "@/lib/content";
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
      <Cta variant="card" title="Missing one?" lead="Tell us what you use and we will document the wiring, or build the adapter." actions={<a href="/contact/" className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]">Request an integration</a>} />
    </>
  );
}
