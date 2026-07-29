import Link from "next/link";
import { HeartFilledIcon } from "@radix-ui/react-icons";

/**
 * Eye-catching sponsor CTA for the docs right rail (shown on every docs page).
 * Gradient card + a high-contrast button, tuned to convert readers to sponsors.
 */
export function SponsorCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--button-primary)] via-[var(--brand-violet)] to-[var(--brand-coral)] p-4 text-white shadow-lg shadow-[var(--button-primary)]/20">
      {/* Soft glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-white/20 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-6 size-24 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center gap-1.5">
          <span className="grid size-6 place-items-center rounded-full bg-white/20">
            <HeartFilledIcon className="size-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Sponsor VUI
          </span>
        </div>

        <p className="mt-2.5 text-[13px] leading-relaxed text-white/90">
          Free &amp; open source, built in the open. Your sponsorship funds new
          components and keeps it alive.
        </p>

        <a
          href="https://github.com/sponsors/myviliha"
          target="_blank"
          rel="noreferrer"
          className="mt-3.5 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white text-sm font-semibold text-[var(--button-primary)] shadow-sm transition-transform hover:scale-[1.03]"
        >
          <HeartFilledIcon className="size-3.5" />
          Become a sponsor
        </a>

        <Link
          href="/docs/sponsor"
          className="mt-2 block text-center text-[11px] font-medium text-white/85 transition-colors hover:text-white"
        >
          See sponsor tiers →
        </Link>
      </div>
    </div>
  );
}
