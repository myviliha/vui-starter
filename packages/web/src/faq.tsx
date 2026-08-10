import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

export interface FaqItem {
  question: ReactNode;
  answer: ReactNode;
  /** Groups questions on the grid variant. */
  category?: string;
}

export interface FaqProps {
  items: FaqItem[];
  title?: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** `accordion` collapses; `grid` shows every answer, grouped by category. */
  variant?: "accordion" | "grid";
  /** Index opened on first render. Omit to start with everything closed. */
  defaultOpen?: number;
  tone?: SectionTone;
  className?: string;
}

/**
 * Frequently asked questions.
 *
 * The accordion is `<details>`, not a JavaScript disclosure: the browser gives
 * keyboard operation, screen-reader semantics and open-by-default for free, it
 * works before hydration, and search engines index the answer either way. There
 * is no state to manage, which is why this block has no "use client".
 */
export function Faq({
  items,
  title,
  eyebrow,
  lead,
  variant = "accordion",
  defaultOpen,
  tone,
  className,
}: FaqProps) {
  if (variant === "grid") {
    const groups = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
      const key = item.category ?? "General";
      (acc[key] ??= []).push(item);
      return acc;
    }, {});

    return (
      <Section tone={tone} className={className}>
        {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />}
        <div className="grid gap-10 md:grid-cols-2">
          {Object.entries(groups).map(([group, entries]) => (
            <div key={group} className="flex flex-col gap-5">
              <h3 className="text-h4 font-semibold tracking-tight">{group}</h3>
              <dl className="flex flex-col gap-5">
                {entries.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <dt className="font-medium">{item.question}</dt>
                    <dd className="leading-relaxed text-muted-foreground">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section tone={tone} width="md" className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />}
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {items.map((item, i) => (
          <details key={i} open={defaultOpen === i} className="group">
            <summary
              className={cn(
                "flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium transition-colors",
                "hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                // The default triangle would sit beside our own chevron.
                "[&::-webkit-details-marker]:hidden [&::marker]:content-['']",
              )}
            >
              {item.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="vui-icon-plain size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="px-5 pb-4 leading-relaxed text-muted-foreground">{item.answer}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}
