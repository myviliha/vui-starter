import * as React from "react";
import {
  ArrowLeftIcon as ArrowLeft,
  ChevronRightIcon as ChevronRight,
} from "@radix-ui/react-icons";

import { cn } from "./utils";

export interface Crumb {
  label: React.ReactNode;
  /** Navigate via a link (rendered with `linkComponent` if given, else <a>). */
  href?: string;
  /** Navigate via a handler (rendered as a button). Ignored if href is set. */
  onClick?: () => void;
}

/** Minimal link contract so an app can pass its router link (e.g. next/link). */
type LinkComponent = React.ComponentType<{
  href: string;
  className?: string;
  children: React.ReactNode;
}>;

const CRUMB_LINK =
  "shrink-0 text-muted-foreground transition-colors hover:text-foreground";

/**
 * Shared breadcrumb trail — one style used everywhere (route pages and forms).
 * The LAST crumb is the current page (bold, non-interactive); earlier crumbs
 * are links (href) or buttons (onClick).
 */
export function Breadcrumbs({
  crumbs,
  onBack,
  linkComponent: Link,
  className,
}: {
  crumbs: Crumb[];
  /** Optional back button shown before the trail. */
  onBack?: () => void;
  linkComponent?: LinkComponent;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 text-sm", className)}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          title="Back"
          className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
        </button>
      )}
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={i} className="flex min-w-0 items-center gap-1">
              {isLast ? (
                <span className="truncate font-medium text-foreground">
                  {c.label}
                </span>
              ) : (
                <>
                  {c.href && Link ? (
                    <Link href={c.href} className={CRUMB_LINK}>
                      {c.label}
                    </Link>
                  ) : c.href ? (
                    <a href={c.href} className={CRUMB_LINK}>
                      {c.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={c.onClick}
                      className={CRUMB_LINK}
                    >
                      {c.label}
                    </button>
                  )}
                  <ChevronRight
                    className="size-3 shrink-0 text-muted-foreground/60"
                    aria-hidden="true"
                  />
                </>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
