import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/**
 * The conversion section: a headline, a sentence, and the thing you want clicked.
 *
 *   banner   centred text and actions on a tinted band
 *   split    text one side, a visual or form the other
 *   card     the same content inside a bordered card, for mid-page placement
 */
export interface CtaProps {
  title: ReactNode;
  lead?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  /** Image, form or anything else. Used by `split` only. */
  visual?: ReactNode;
  /** Reassurance under the actions: "No card required", "Cancel any time". */
  footnote?: ReactNode;
  variant?: "banner" | "split" | "card";
  tone?: SectionTone;
  className?: string;
}

export function Cta({
  title,
  lead,
  eyebrow,
  actions,
  visual,
  footnote,
  variant = "banner",
  tone = "brand",
  className,
}: CtaProps) {
  const body = (
    <>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        align={variant === "split" ? "start" : "center"}
        size="h2"
      />
      {actions && (
        <div className={cn("flex flex-wrap items-center gap-3", variant !== "split" && "justify-center")}>
          {actions}
        </div>
      )}
      {footnote && (
        <p className={cn("text-caption text-muted-foreground", variant !== "split" && "text-center")}>
          {footnote}
        </p>
      )}
    </>
  );

  if (variant === "split") {
    return (
      <Section tone={tone} className={className}>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">{body}</div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </Section>
    );
  }

  if (variant === "card") {
    return (
      <Section tone="none" className={className}>
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-[var(--button-primary)]/[0.06] px-6 py-10 shadow-[var(--shadow-2)] md:px-12">
          {body}
        </div>
      </Section>
    );
  }

  return (
    <Section tone={tone} className={className}>
      <div className="mx-auto flex max-w-[56ch] flex-col items-center gap-6">{body}</div>
    </Section>
  );
}
