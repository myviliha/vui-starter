import Link from "next/link";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/seo";
import { Logo } from "./logo";

/**
 * The brand lockup — Vui logo + "Vui Starter" wordmark — used consistently in
 * the app sidebar, the auth screens, and the docs header. Single source of the
 * logo + type styling so they never drift.
 */
export function Wordmark({
  href,
  className,
  logoClassName,
  textClassName,
}: {
  /** Render as a link when set (e.g. header → home). */
  href?: string;
  className?: string;
  logoClassName?: string;
  textClassName?: string;
}) {
  const content = (
    <>
      <Logo className={cn("h-6 w-6 shrink-0", logoClassName)} />
      <span
        className={cn(
          "text-lg font-bold tracking-tight text-foreground",
          textClassName,
        )}
      >
        {SITE.name}
      </span>
    </>
  );
  const classes = cn("flex items-center gap-2", className);

  return href ? (
    <Link href={href} aria-label={SITE.name} className={classes}>
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}
