import type { Metadata } from "next";
import { ArrowRightIcon, PlusIcon } from "@radix-ui/react-icons";

import { PageTitle, H2, H3, P, Ul, Note, DocPager } from "@/components/doc";

const SPONSORS_URL = "https://github.com/sponsors/myviliha";

/** A single sponsorship tier card linking to the GitHub Sponsors checkout. */
function TierCard({
  amount,
  cadence,
  perk,
  featured,
}: {
  amount: string;
  cadence?: string;
  perk: string;
  featured?: boolean;
}) {
  return (
    <a
      href={SPONSORS_URL}
      target="_blank"
      rel="noreferrer"
      className={
        "group flex flex-col rounded-xl border bg-card p-5 transition-colors hover:bg-accent/40 " +
        (featured
          ? "border-[var(--button-primary)]/60 ring-1 ring-[var(--button-primary)]/20"
          : "border-border hover:border-[var(--button-primary)]/50")
      }
    >
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {amount}
        </span>
        {cadence && (
          <span className="text-sm text-muted-foreground">{cadence}</span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{perk}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--button-primary)]">
        Sponsor
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

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

      <H2>Sponsors</H2>
      <P>Sponsors are featured here — be the first to claim a spot.</P>
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-border p-6">
        <a
          href={SPONSORS_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Become the first sponsor"
          className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-dashed border-[var(--button-primary)]/40 text-[var(--button-primary)] transition-colors hover:border-[var(--button-primary)] hover:bg-[var(--button-primary)]/5"
        >
          <PlusIcon className="size-6" />
        </a>
        <div>
          <p className="text-sm font-medium text-foreground">
            Be the first sponsor
          </p>
          <p className="text-sm text-muted-foreground">
            Your avatar and a link to your site will appear right here.
          </p>
        </div>
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
        Monthly or one-time — pick what fits. Custom amounts start at $1, and
        every card links straight to GitHub Sponsors checkout.
      </P>

      <H3>Monthly</H3>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <TierCard amount="$5" cadence="/mo" perk="Access to private repositories" />
        <TierCard
          amount="$6"
          cadence="/mo"
          perk="Have your bug reports prioritized"
          featured
        />
      </div>

      <H3>One-time</H3>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <TierCard amount="$10" perk="One bug or medium-sized bounty" />
        <TierCard
          amount="$100"
          perk="Large contract project — contact me!"
          featured
        />
      </div>

      <Note title="Thank you" variant="tip">
        Every sponsorship — big or small — directly funds the next release. Thank
        you for supporting open source.
      </Note>

      <H2>Inspired by</H2>
      <P>
        A big thank-you to{" "}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--button-primary)] hover:underline"
        >
          shadcn/ui
        </a>{" "}
        and{" "}
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--button-primary)] hover:underline"
        >
          React
        </a>{" "}
        — VUI builds on their ideas and components, and wouldn&apos;t exist
        without them.
      </P>

      <DocPager next={{ label: "Introduction", href: "/docs" }} />
    </article>
  );
}
