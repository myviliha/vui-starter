import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/** One feature, however it is displayed. */
export interface FeatureItem {
  title: ReactNode;
  body?: ReactNode;
  /** Usually an icon. Rendered inside a bordered chip. */
  icon?: ReactNode;
  /** Optional link out of the card. */
  href?: string;
  linkLabel?: string;
}

export interface FeatureGridProps {
  items: FeatureItem[];
  title?: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** Columns at the widest breakpoint. Below that it steps down to one. */
  columns?: 2 | 3 | 4;
  /** `card` draws a border; `plain` lets the icon and text stand alone. */
  variant?: "card" | "plain";
  tone?: SectionTone;
  className?: string;
}

const COLUMNS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-muted/50 text-[var(--button-primary)]">
      {children}
    </span>
  );
}

/** Features as cards in a responsive grid. The default for "what it does". */
export function FeatureGrid({
  items,
  title,
  eyebrow,
  lead,
  columns = 3,
  variant = "card",
  tone,
  className,
}: FeatureGridProps) {
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} className="mb-10" />}
      <div className={cn("grid gap-6", COLUMNS[columns])}>
        {items.map((item, i) => {
          const inner = (
            <>
              {item.icon && <FeatureIcon>{item.icon}</FeatureIcon>}
              <span className="text-h4 font-semibold tracking-tight">{item.title}</span>
              {item.body && (
                <span className="text-muted-foreground leading-relaxed">{item.body}</span>
              )}
              {item.href && (
                <span className="mt-auto pt-1 text-sm font-medium text-[var(--button-primary)]">
                  {item.linkLabel ?? "Learn more"}
                </span>
              )}
            </>
          );
          const shell = cn(
            "flex flex-col gap-3",
            variant === "card" &&
              "rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-1)] transition-colors",
            variant === "card" && item.href && "hover:border-[var(--button-primary)]/50 hover:bg-accent/30",
          );
          return item.href ? (
            <a key={i} href={item.href} className={shell}>
              {inner}
            </a>
          ) : (
            <div key={i} className={shell}>
              {inner}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/** Features as vertical rows. Better than a grid when each needs more words. */
export function FeatureList({
  items,
  title,
  eyebrow,
  lead,
  tone,
  className,
}: Omit<FeatureGridProps, "columns" | "variant">) {
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} className="mb-10" />}
      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 p-6">
            {item.icon && <FeatureIcon>{item.icon}</FeatureIcon>}
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="text-h4 font-semibold tracking-tight">{item.title}</p>
              {item.body && <p className="text-muted-foreground leading-relaxed">{item.body}</p>}
              {item.href && (
                <a href={item.href} className="text-sm font-medium text-[var(--button-primary)] underline-offset-4 hover:underline">
                  {item.linkLabel ?? "Learn more"}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export interface FeatureSplitProps {
  title: ReactNode;
  body?: ReactNode;
  eyebrow?: ReactNode;
  /** Short supporting points under the body. */
  points?: ReactNode[];
  actions?: ReactNode;
  visual?: ReactNode;
  /** Puts the visual first on wide screens. Alternate down a page. */
  reverse?: boolean;
  tone?: SectionTone;
  className?: string;
}

/** Text beside a visual. The workhorse of a features page. */
export function FeatureSplit({
  title,
  body,
  eyebrow,
  points,
  actions,
  visual,
  reverse,
  tone,
  className,
}: FeatureSplitProps) {
  return (
    <Section tone={tone} className={className}>
      <div
        className={cn(
          "grid items-center gap-10 md:grid-cols-2 md:gap-14",
          reverse && "md:[&>*:first-child]:order-2",
        )}
      >
        <div className="flex flex-col gap-5">
          <SectionHeader eyebrow={eyebrow} title={title} lead={body} size="h2" />
          {points && points.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {points.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-muted-foreground">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--button-primary)]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
          {actions && <div className="flex flex-wrap items-center gap-3 pt-1">{actions}</div>}
        </div>
        {visual && <div className="min-w-0">{visual}</div>}
      </div>
    </Section>
  );
}
