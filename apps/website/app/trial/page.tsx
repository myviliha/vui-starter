import { Benefits, Cta, Faq, Hero, ProcessSteps, TrustBadges } from "@viliha/vui-web";

import { FAQS, STEPS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Start free",
  description:
    "There is no trial to start in VUI: the free plan is MIT licensed and permanent. Install it with one command and keep it.",
  path: "/trial/",
});

const NOT_A_TRIAL = [
  { title: "No clock", body: "Nothing stops working after fourteen days, because nothing was ever time-limited." },
  { title: "No card", body: "There is nothing to charge. We do not collect a card to give you free software." },
  { title: "No seat count", body: "Add the whole team. The library is in your repository, not on our server." },
  { title: "No downgrade", body: "If you never buy anything, nothing is taken away. That is the published pledge." },
];

export default function TrialPage() {
  return (
    <>
      <Hero
        variant="gradient"
        eyebrow="Get started"
        title="There is no trial, and that is the point"
        lead="The free plan is MIT licensed and permanent. Install it, keep it, and pay us only if you later want something we have not written yet."
        actions={
          <>
            <LinkButton href="/demo/">Open the demo</LinkButton>
            <LinkButton href="/pricing/" variant="secondary">See what Pro adds</LinkButton>
          </>
        }
        footnote="One command. No account, no card, no clock."
      />
      <Benefits eyebrow="What free means" title="Four things it does not do" items={NOT_A_TRIAL} />
      <ProcessSteps eyebrow="How it works" title="Four steps, one afternoon" items={STEPS} tone="muted" />
      <TrustBadges
        items={[
          { label: "MIT licensed" },
          { label: "No telemetry" },
          { label: "Runs in your repo" },
          { label: "Open source since day one" },
        ]}
      />
      <Faq eyebrow="Questions" title="Before you install" items={FAQS} defaultOpen={0} />
      <Cta
        title="Install it now"
        lead="Four minutes from an empty folder to a running admin app."
        actions={
          <>
            <LinkButton href="/demo/">Open the demo</LinkButton>
            <LinkButton href="/contact/" variant="secondary">Talk to us first</LinkButton>
          </>
        }
      />
    </>
  );
}
