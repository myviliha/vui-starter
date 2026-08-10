import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

/**
 * The button-shaped links in a hero or a call to action.
 *
 * Every block takes its actions as children, so without this each page writes
 * out the same forty characters of class names and one of them eventually gets
 * it wrong. It also picks the right element: an internal route goes through
 * `next/link` so the router prefetches it, and anything external or a `mailto:`
 * stays a plain anchor, which is what those need.
 */
export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const classes = cn(VARIANT[variant], className);
  const external = /^(https?:|mailto:|tel:)/.test(href);

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

const BASE =
  "inline-flex h-10 items-center rounded-md px-5 text-sm font-medium transition-colors";

const VARIANT = {
  primary: cn(
    BASE,
    "bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]",
  ),
  secondary: cn(BASE, "border border-border hover:bg-accent"),
  ghost: cn(BASE, "hover:bg-accent"),
} as const;
