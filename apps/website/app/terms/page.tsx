import { Hero, Prose } from "@viliha/vui-web";

import { SITE, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms of Service",
  description: `The terms of service for ${SITE.name}: what the service is, what you may do with it, and how either side ends the agreement.`,
  path: "/terms/",
});

/**
 * A placeholder, and it says so on the page.
 *
 * Shipping invented legal text that reads as real is worse than shipping an
 * obvious template: someone might rely on it.
 */
export default function TermsPage() {
  return (
    <>
      <Hero variant="minimal" title="Terms of Service" lead="Last updated 11 August 2026." />
      <section className="vui-section-tight">
        <div className="vui-container vui-container-md">
          <Prose>
            <p>
              <strong>This is a template.</strong> Replace it with terms written for
              your business by someone qualified to write them. It exists so the page
              is linked, styled and reachable, not so you can ship it as-is.
            </p>
            <h2>Who we are</h2>
            <p>
              {SITE.name} is operated by {SITE.company}. Reach us at{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
            <h2>Using the service</h2>
            <p>
              Use it lawfully, and do not deliberately degrade it for other people. We
              may suspend access that puts the service or its users at risk.
            </p>
            <h2>Your content</h2>
            <p>
              What you put in stays yours. We store and process it only to provide the
              service, and you can export or delete it.
            </p>
            <h2>Ending the agreement</h2>
            <p>
              You can stop at any time. We can end it for a serious or repeated breach,
              with notice where the law requires it.
            </p>
            <h2>Changes</h2>
            <p>
              Changes are posted here with the date above updated. Material changes get
              an email where we have an address.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
