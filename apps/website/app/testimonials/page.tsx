import { Cta, Hero, LogoCloud, RatingBlock, Testimonials } from "@viliha/vui-web";

import { LOGOS, TESTIMONIALS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Testimonials",
  description:
    "What teams say after shipping with VUI, with ratings from G2, Capterra and GitHub and the case studies behind them.",
  path: "/testimonials/",
});

export default function TestimonialsPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="dots"
        eyebrow="Testimonials"
        title="What teams say after shipping"
        lead="Collected after launch rather than during the sales conversation, which is when people tell you the truth."
      />
      <RatingBlock
        score={4.8}
        count={312}
        sources={[
          { name: "G2", score: 4.8, count: 118 },
          { name: "Capterra", score: 4.7, count: 64 },
          { name: "GitHub", score: 4.9, count: 130 },
        ]}
      />
      <Testimonials items={TESTIMONIALS} variant="grid" tone="muted" />
      <LogoCloud title="Used by teams at" items={LOGOS} variant="marquee" />
      <Cta
        title="Read the longer versions"
        lead="Each of these has a case study behind it, including what did not go well."
        actions={
          <>
            <LinkButton href="/customers/">Read the case studies</LinkButton>
            <LinkButton href="/contact/" variant="secondary">Talk to a customer</LinkButton>
          </>
        }
      />
    </>
  );
}
