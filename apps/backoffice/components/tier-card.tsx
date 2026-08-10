import { ArrowRightIcon } from "@radix-ui/react-icons";

/**
 * One card in a row of tiers: a price, what it buys, and a link. Used by the
 * sponsor tiers and by the pricing page, so both stay visually identical.
 */
export function TierCard({
  amount,
  cadence,
  perk,
  href,
  cta = "Sponsor",
  featured,
  bullets,
}: {
  amount: string;
  cadence?: string;
  perk: string;
  href: string;
  /** Link text. Defaults to "Sponsor" for the sponsor tiers. */
  cta?: string;
  featured?: boolean;
  /** Optional list of what the tier includes, shown under the summary. */
  bullets?: string[];
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
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
      <p className="mt-2 text-sm text-muted-foreground">{perk}</p>
      {bullets && (
        <ul className="mt-3 flex-1 space-y-1.5 text-sm text-muted-foreground">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span aria-hidden className="text-[var(--button-primary)]">
                &bull;
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {!bullets && <span className="flex-1" />}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--button-primary)]">
        {cta}
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
