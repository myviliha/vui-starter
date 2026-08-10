import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

export interface SiteFooterProps {
  /** Wordmark or logo. */
  brand?: ReactNode;
  /** A sentence about the company, under the brand. */
  blurb?: ReactNode;
  columns?: FooterColumn[];
  /** Newsletter block, usually the `Newsletter` component in compact mode. */
  newsletter?: ReactNode;
  social?: { label: string; href: string; icon: ReactNode }[];
  /** Terms, privacy, cookies. Rendered in the bottom bar. */
  legal?: { label: string; href: string }[];
  /** "© 2026 Company". */
  copyright?: ReactNode;
  /** `minimal` drops the columns and keeps one line. */
  variant?: "standard" | "minimal";
  className?: string;
}

/**
 * The footer. Two shapes from one component: the full navigation grid, and a
 * single line for pages that should not end in a wall of links.
 */
export function SiteFooter({
  brand,
  blurb,
  columns = [],
  newsletter,
  social,
  legal = [],
  copyright,
  variant = "standard",
  className,
}: SiteFooterProps) {
  const socialRow = social && social.length > 0 && (
    <ul className="flex items-center gap-1">
      {social.map((s) => (
        <li key={s.href}>
          <a
            href={s.href}
            aria-label={s.label}
            target="_blank"
            rel="noreferrer noopener"
            className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  );

  const bottom = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-caption text-muted-foreground">
      <p>{copyright}</p>
      <div className="flex items-center gap-4">
        {legal.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
            {l.label}
          </a>
        ))}
        {variant === "minimal" && socialRow}
      </div>
    </div>
  );

  if (variant === "minimal") {
    return (
      <footer className={cn("border-t border-border bg-background", className)}>
        <div className="vui-container py-6">{bottom}</div>
      </footer>
    );
  }

  return (
    <footer className={cn("border-t border-border bg-muted/30", className)}>
      <div className="vui-container py-12">
        <div
          className={cn(
            "grid gap-10",
            // The brand column is wider than the link columns, and the whole
            // thing collapses to one column on a phone.
            columns.length > 0 ? "lg:grid-cols-[minmax(0,1.4fr)_repeat(auto-fit,minmax(8rem,1fr))]" : "",
          )}
        >
          <div className="flex flex-col gap-4">
            {brand}
            {blurb && <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">{blurb}</p>}
            {socialRow}
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
              <h2 className="text-caption font-semibold tracking-wide uppercase">{col.title}</h2>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {newsletter && <div className="mt-10 border-t border-border pt-8">{newsletter}</div>}

        <div className="mt-10 border-t border-border pt-6">{bottom}</div>
      </div>
    </footer>
  );
}
