import type { Metadata } from "next";
import Link from "next/link";

import { SITE, canonicalFor } from "@/lib/seo";
import {
  LegalList,
  LegalSection,
  LegalTitle,
  TemplateNotice,
} from "../_components/legal";

const title = "Privacy Policy";
const description = `What personal data ${SITE.name} collects, why it collects it, how long it keeps it, who it shares it with, and the rights you have over it.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalFor("/privacy") },
  openGraph: { title, description, url: canonicalFor("/privacy") },
  twitter: { title, description },
};

export default function PrivacyPage() {
  return (
    <>
      <LegalTitle
        title={title}
        updated="6 August 2026"
        lead={`This policy explains what ${SITE.company} does with personal data in ${SITE.name}: what we collect, why, how long we hold it, and what you can ask us to do with it.`}
      />

      <LegalSection id="what-we-collect" title="What we collect">
        <p>Three kinds of data, and nothing else:</p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Account data.</strong> Your
              name, work email, password (stored hashed, never in readable
              form), and which organization you belong to.
            </>,
            <>
              <strong className="text-foreground">Data you enter.</strong> The
              records you create in the app: organizations, branches, employees,
              and anything else you or your colleagues type in or import.
            </>,
            <>
              <strong className="text-foreground">Technical data.</strong> IP
              address, browser and device type, and timestamps of significant
              actions, kept so we can keep accounts secure and work out what
              went wrong when something breaks.
            </>,
          ]}
        />
        <p>
          We do not sell personal data, and we do not use it to train models.
        </p>
      </LegalSection>

      <LegalSection id="why" title="Why we use it">
        <LegalList
          items={[
            "To run the service: signing you in, showing your records, sending the emails the app has to send.",
            "To keep it secure: spotting unusual sign-ins, investigating abuse, keeping an audit trail.",
            "To support you: reproducing a bug you report, answering a question about your account.",
            "To meet legal obligations: tax, accounting and anything a regulator requires of us.",
          ]}
        />
        <p>
          Where the law requires a legal basis, ours is performing our contract
          with you, our legitimate interest in running and securing the service,
          and compliance with legal obligations. Where we rely on consent, you
          can withdraw it at any time.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies and local storage">
        <p>
          We use a session cookie to keep you signed in. The app also stores some
          preferences in your browser rather than on our servers, including your
          theme, which top-bar features you have hidden and how you like data
          tables to behave. Those stay on the device and are not sent to us.
        </p>
        <p>
          No advertising cookies, and no third-party tracking pixels.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Who else sees it">
        <p>
          Other members of your organization see the records in your shared
          workspace, and your administrators can see and manage accounts within
          it.
        </p>
        <p>
          Outside that, we share personal data only with the providers who help
          us run the service, such as hosting, email delivery and error
          monitoring. They may process it only on our instructions. We also
          disclose data when the law compels us to, and we will tell you when we
          are allowed to.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="How long we keep it">
        <LegalList
          items={[
            "Account data: while the account is open, then 30 days after closure.",
            "Data you entered: while the account is open. Deleted records sit in Trash until they are permanently removed or 30 days pass, whichever comes first.",
            "Technical and security logs: 12 months.",
            "Records we must keep by law, such as invoices: as long as the law requires.",
          ]}
        />
        <p>
          Once the period ends, we delete or anonymize the data. Backups age out
          on their own cycle, so a copy can persist there briefly after deletion.
        </p>
      </LegalSection>

      <LegalSection id="security" title="How we protect it">
        <p>
          Data is encrypted in transit and at rest. Access inside our team is
          limited to the people who need it for the job in front of them, and it
          is logged. Passwords are hashed, never stored in a form anyone can
          read.
        </p>
        <p>
          No system is perfectly secure. If a breach affects your data, we will
          tell you and the relevant regulator within the time the law allows.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights">
        <p>Depending on where you live, you can ask us to:</p>
        <LegalList
          items={[
            "give you a copy of the personal data we hold about you",
            "correct anything inaccurate",
            "delete it, where we have no obligation or overriding reason to keep it",
            "export it in a portable format",
            "restrict or object to certain processing",
          ]}
        />
        <p>
          Write to the address below and we will answer within 30 days. If we get
          it wrong, you can complain to your local data protection authority.
        </p>
      </LegalSection>

      <LegalSection id="transfers" title="Where data is held">
        <p>
          We host in the region your organization selects. Where data moves
          outside that region, we rely on the safeguards the law provides for
          such transfers, including standard contractual clauses.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          When this policy changes we update the date at the top. If a change
          materially affects how we use your data, we will tell you in the app or
          by email before it takes effect.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          For anything about privacy, including a request under the rights above,
          write to{" "}
          <a
            href={`mailto:privacy@${SITE.url.replace(/^https?:\/\//, "")}`}
            className="text-[var(--button-primary)] underline-offset-2 hover:underline"
          >
            privacy@{SITE.url.replace(/^https?:\/\//, "")}
          </a>
          . For the terms that govern your use of the service, see the{" "}
          <Link
            href="/terms/"
            className="text-[var(--button-primary)] underline-offset-2 hover:underline"
          >
            Terms of Use
          </Link>
          .
        </p>
      </LegalSection>

      <TemplateNotice />
    </>
  );
}
