import { CardGrid, Cta, Hero, LogoCloud, ProcessSteps } from "@viliha/vui-web";

import { LOGOS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { PARTNERS } from "@/lib/catalog";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Partners",
  description:
    "Agencies and consultancies that build on VUI: implementation, design and hosting partners, and how to become one.",
  path: "/partners/",
});

const BECOMING = [
  { title: "Tell us what you build", body: "A link to two projects and the kind of work you want more of." },
  { title: "Build something on it", body: "One project shipped on the library, so the listing means something." },
  { title: "Get listed", body: "Your details here, and referrals when a request matches what you do." },
];

export default function PartnersPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="dots"
        eyebrow="Partners"
        title="Teams that build on it, for other people"
        lead="We are a small team, so most implementation work goes to partners. These are the ones we send it to."
      />
      <LogoCloud title="Working with teams at" items={LOGOS} variant="marquee" />
      <CardGrid
        eyebrow="Directory"
        title="Current partners"
        columns={2}
        items={PARTNERS.map((p) => ({ title: p.name, body: p.body, meta: p.tier, href: p.href }))}
      />
      <ProcessSteps
        eyebrow="Apply"
        title="Becoming a partner"
        items={BECOMING}
        tone="muted"
      />
      <Cta
        title="Work with us"
        lead="If you already build admin platforms for clients, this is a short conversation."
        actions={
          <>
            <LinkButton href="/contact/">Apply to partner</LinkButton>
            <LinkButton href="/services/" variant="secondary">See our own services</LinkButton>
          </>
        }
      />
    </>
  );
}
