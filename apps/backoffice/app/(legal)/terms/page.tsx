import type { Metadata } from "next";
import Link from "next/link";

import { SITE, canonicalFor } from "@/lib/seo";
import {
  LegalList,
  LegalSection,
  LegalTitle,
  TemplateNotice,
} from "../_components/legal";

const title = "Terms of Use";
const description = `The terms you agree to when you use ${SITE.name}: what the account is, what you may and may not do with it, who owns what, and how either side can end the agreement.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalFor("/terms") },
  openGraph: { title, description, url: canonicalFor("/terms") },
  twitter: { title, description },
};

export default function TermsPage() {
  return (
    <>
      <LegalTitle
        title={title}
        updated="6 August 2026"
        lead={`These terms are the agreement between you and ${SITE.company} for using ${SITE.name}. By creating an account or using the service, you accept them. If you are agreeing on behalf of a company, you are confirming you may bind that company.`}
      />

      <LegalSection id="account" title="Your account">
        <p>
          You need an account to use most of {SITE.name}. Keep your credentials
          to yourself, use a password you do not use elsewhere, and tell us
          promptly if you think someone else has got in. Anything done through
          your account is treated as done by you.
        </p>
        <p>
          Your organization&apos;s administrators can add and remove members,
          change what each member can see, and close accounts. If your access
          came from an employer, they control it.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="What you may not do">
        <p>Do not use {SITE.name} to:</p>
        <LegalList
          items={[
            "break the law, or help anyone else break it",
            "upload content you have no right to share, or that infringes someone else's rights",
            "attempt to access another organization's data, or probe, scan or test the security of the service without written permission",
            "interfere with the service, overload it, or work around its rate limits and access controls",
            "resell, sublicense or white-label the hosted service without an agreement that says you may",
          ]}
        />
        <p>
          We may suspend an account that is doing any of these, and will tell you
          why when we do.
        </p>
      </LegalSection>

      <LegalSection id="your-content" title="Your data stays yours">
        <p>
          You keep every right you already had in the data you put into{" "}
          {SITE.name}. You give us permission to store, process and display it
          only so far as we need to run the service for you, including making
          backups and troubleshooting a problem you report.
        </p>
        <p>
          You are responsible for having the right to upload what you upload, and
          for making sure your use of it follows the law that applies to you. How
          we handle personal data is set out in the{" "}
          <Link
            href="/privacy/"
            className="text-[var(--button-primary)] underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="our-content" title="Our software">
        <p>
          The service, its software and its design remain ours or our licensors&apos;.
          These terms do not transfer any of that to you. They give you
          permission to use the service while your account is active, nothing
          more.
        </p>
        <p>
          {SITE.name} is built on open-source components, which stay under their
          own licences. Nothing here overrides those licences.
        </p>
      </LegalSection>

      <LegalSection id="availability" title="Availability and changes">
        <p>
          We work to keep the service running, and we cannot promise it will
          never be unavailable. Maintenance, a failure at a provider we depend
          on, or something we did not foresee can all interrupt it.
        </p>
        <p>
          Features change. We may add, alter or withdraw them. If we withdraw
          something you depend on, or change these terms in a way that matters,
          we will give you reasonable notice first through the app or by email.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Liability">
        <p>
          The service is provided as it is. To the extent the law allows, we
          exclude implied warranties, and we are not liable for lost profits,
          lost data or indirect losses. Where liability cannot be excluded, it is
          limited to what you paid us in the twelve months before the claim.
        </p>
        <p>
          Nothing here limits liability for death or personal injury caused by
          negligence, for fraud, or for anything else that cannot be limited
          under the law that applies to you.
        </p>
      </LegalSection>

      <LegalSection id="ending" title="Ending the agreement">
        <p>
          You can stop using {SITE.name} and close your account whenever you
          like. We can suspend or close an account that breaks these terms, or
          if we stop offering the service.
        </p>
        <p>
          Export your data before you close an account. After closure we delete
          it on the schedule in the Privacy Policy, and once it is gone we cannot
          get it back.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about these terms go to{" "}
          <a
            href={`mailto:legal@${SITE.url.replace(/^https?:\/\//, "")}`}
            className="text-[var(--button-primary)] underline-offset-2 hover:underline"
          >
            legal@{SITE.url.replace(/^https?:\/\//, "")}
          </a>
          .
        </p>
      </LegalSection>

      <TemplateNotice />
    </>
  );
}
