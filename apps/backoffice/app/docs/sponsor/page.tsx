import type { Metadata } from "next";

import { PageTitle, H2, P, Ul, Note, DocPager } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/sponsor/" },
  title: "Sponsor Me",
  description:
    "VUI is free and open source. Sponsor its development to fund new components, docs, and support.",
};

export default function SponsorPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Support"
        title="Sponsor Me"
        lead="VUI Starter is free, open source, and built in the open. If it saves you time or ships your product, sponsoring keeps it maintained and moving forward."
      />

      {/* GitHub Sponsors card */}
      <div className="mb-8 flex justify-center">
        <iframe
          src="https://github.com/sponsors/myviliha/card"
          title="Sponsor myviliha"
          height={225}
          width={600}
          style={{ border: 0 }}
          className="max-w-full"
        />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <a
          href="https://github.com/sponsors/myviliha"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors hover:bg-[var(--button-primary-hover)]"
        >
          ❤ Become a sponsor
        </a>
        <iframe
          src="https://github.com/sponsors/myviliha/button"
          title="Sponsor myviliha"
          height={32}
          width={114}
          style={{ border: 0, borderRadius: 6 }}
        />
      </div>

      <H2>Why sponsor</H2>
      <P>
        VUI is developed and maintained by a small, independent team. There is no
        company behind it — sponsorship is what pays for the time to keep building.
      </P>

      <H2>What your sponsorship supports</H2>
      <Ul>
        <li>New components and blocks, and keeping the shadcn/ui set in sync.</li>
        <li>Documentation, examples, and the live demo app.</li>
        <li>Bug fixes, releases, and answering issues.</li>
        <li>Keeping the whole thing free and open source (MIT).</li>
      </Ul>

      <H2>Tiers</H2>
      <P>
        One-time or monthly tiers — from a coffee to a logo placement — are listed
        on the{" "}
        <a
          href="https://github.com/sponsors/myviliha"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--button-primary)] hover:underline"
        >
          GitHub Sponsors page
        </a>
        . Sponsoring at any level genuinely helps.
      </P>

      <Note title="Thank you" variant="tip">
        Every sponsorship — big or small — directly funds the next release. Thank
        you for supporting open source.
      </Note>

      <DocPager
        next={{ label: "Introduction", href: "/docs" }}
      />
    </article>
  );
}
