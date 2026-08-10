import { ContactForm, Faq, Hero } from "@viliha/vui-web";

import { FAQS } from "@/lib/content";
import { SITE, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Talk to us about the library, a commercial licence, or work you want built. We reply within one business day.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="Contact"
        title="Talk to a human"
        lead="Questions about the licence, a quote for custom work, or a bug you would rather not file in public."
      />
      <ContactForm
        title="Send a message"
        lead="We reply within one business day, usually sooner."
        aside={
          <>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Email</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
                  {SITE.email}
                </a>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Bugs and features</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Public issues get answered faster, because the answer helps the next person too.
              </p>
              <a href="https://github.com/myviliha/vui-starter/issues" className="mt-2 inline-block text-sm font-medium text-[var(--button-primary)] underline-offset-4 hover:underline">
                Open an issue
              </a>
            </div>
          </>
        }
      />
      <Faq title="Common questions" items={FAQS.filter((f) => f.category === "Support" || f.category === "Technical")} tone="muted" />
    </>
  );
}
