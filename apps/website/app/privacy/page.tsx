import { Hero, Prose } from "@viliha/vui-web";

import { SITE, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: `How ${SITE.name} handles personal data: what is collected, why, how long it is kept, and how to get it removed.`,
  path: "/privacy/",
});

/** A placeholder, and it says so. See the note in the terms page. */
export default function PrivacyPage() {
  return (
    <>
      <Hero variant="minimal" title="Privacy Policy" lead="Last updated 11 August 2026." />
      <section className="vui-section-tight">
        <div className="vui-container vui-container-md">
          <Prose>
            <p>
              <strong>This is a template.</strong> Replace it with a policy that
              describes what your product actually does, written by someone qualified.
            </p>
            <h2>What we collect</h2>
            <p>
              Only what the service needs: your account details, and the content you
              create. This marketing site stores a theme preference and your cookie
              choice in your browser, and neither leaves your device.
            </p>
            <h2>Cookies</h2>
            <p>
              We ask before setting anything beyond what the site needs to function.
              Refusing is one click, and as easy as accepting.
            </p>
            <h2>How long we keep it</h2>
            <p>
              For as long as you have an account, and then only what the law requires
              us to retain.
            </p>
            <h2>Your rights</h2>
            <p>
              Ask for a copy, a correction or a deletion at{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will act within
              30 days.
            </p>
            <h2>Who else sees it</h2>
            <p>
              Our infrastructure providers, under contract, and nobody else. We do not
              sell personal data.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
