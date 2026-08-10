import { Cta, Faq, Hero } from "@viliha/vui-web";

import { FAQS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Frequently asked questions",
  description:
    "Answers about licensing, pricing, framework support, hosting and what stays free in VUI, grouped by topic.",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="dots"
        eyebrow="FAQ"
        title="Questions people actually ask"
        lead="Licensing, pricing and support, answered directly. If yours is not here, ask and we will add it."
      />
      <Faq items={FAQS} variant="grid" />
      <Cta
        variant="card"
        title="Still unsure about something?"
        lead="We answer questions in public where we can, so the next person finds the answer already written."
        actions={
          <>
            <LinkButton href="/contact/">Ask us</LinkButton>
            <LinkButton href="/pricing/" variant="secondary">See pricing</LinkButton>
          </>
        }
      />
    </>
  );
}
