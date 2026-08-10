import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

/**
 * The frame every block sits in: vertical rhythm from `--section-y`, a centred
 * container from `--container-*`, and nothing else. Blocks compose this rather
 * than each choosing their own padding, which is how fifty sections end up with
 * forty-nine different gaps.
 *
 * `width` picks the content column. `tone` paints the full-bleed background, so
 * an alternating stripe is a prop rather than a wrapper div at the page level.
 */
export type SectionWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type SectionTone = "default" | "muted" | "card" | "brand" | "none";

export interface SectionProps {
  children: ReactNode;
  /** Content column. Defaults to `xl` (80rem). `full` opts out entirely. */
  width?: SectionWidth;
  /** Full-bleed background. `none` inherits whatever is behind it. */
  tone?: SectionTone;
  /** Tighter vertical rhythm, for sections that sit close together. */
  tight?: boolean;
  /** Anchor target, so a page can link to its own sections. */
  id?: string;
  /** Semantic element. A landmark section should usually stay `section`. */
  as?: "section" | "div" | "header" | "footer" | "aside" | "main";
  className?: string;
  /** Class for the inner container, when a block needs to lay its own grid. */
  innerClassName?: string;
}

const WIDTH: Record<SectionWidth, string> = {
  sm: "vui-container vui-container-sm",
  md: "vui-container vui-container-md",
  lg: "vui-container vui-container-lg",
  xl: "vui-container",
  "2xl": "vui-container vui-container-2xl",
  full: "w-full",
};

const TONE: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted/40 text-foreground",
  card: "bg-card text-card-foreground",
  // A tint of the tenant's brand, so it repaints per organization.
  brand: "bg-[var(--button-primary)]/[0.06] text-foreground",
  none: "",
};

export function Section({
  children,
  width = "xl",
  tone = "none",
  tight,
  id,
  as: Tag = "section",
  className,
  innerClassName,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        tight ? "vui-section-tight" : "vui-section",
        TONE[tone],
        className,
      )}
    >
      <div className={cn(WIDTH[width], innerClassName)}>{children}</div>
    </Tag>
  );
}
