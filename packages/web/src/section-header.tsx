import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

/**
 * Eyebrow, heading, lead and actions. Nearly every other block renders one, so
 * heading sizes and the gap beneath them are decided here once.
 *
 * `level` sets the tag without changing the look: a page has one `h1`, and a
 * block dropped halfway down a page should not claim it. Size follows the level
 * by default and can be overridden when the visual weight needs to differ from
 * the document outline.
 */
export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";

export interface SectionHeaderProps {
  title: ReactNode;
  /** Small label above the title. Decorative, so it is not a heading. */
  eyebrow?: ReactNode;
  /** One or two sentences under the title. */
  lead?: ReactNode;
  /** Buttons or links, right of the title on wide screens, below on narrow. */
  actions?: ReactNode;
  level?: HeadingLevel;
  size?: HeadingSize;
  align?: "start" | "center";
  /**
   * How the eyebrow is drawn. `pill` is the bordered chip a hero uses; `text`
   * is the plain uppercase label that suits a section further down the page,
   * where a row of chips would compete with the content.
   */
  eyebrowVariant?: "text" | "pill";
  className?: string;
  /** For the heading itself, when a page wants a gradient or a wider measure. */
  titleClassName?: string;
}

const SIZE: Record<HeadingSize, string> = {
  display: "text-display font-semibold tracking-tight text-balance",
  h1: "text-h1 font-semibold tracking-tight text-balance",
  h2: "text-h2 font-semibold tracking-tight text-balance",
  h3: "text-h3 font-semibold tracking-tight text-balance",
  h4: "text-h4 font-semibold tracking-tight",
};

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

export function SectionHeader({
  title,
  eyebrow,
  lead,
  actions,
  level = 2,
  size,
  align = "start",
  eyebrowVariant = "text",
  className,
  titleClassName,
}: SectionHeaderProps) {
  const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        // Actions sit beside the text once there is room for both.
        actions && !centered && "md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", centered && "items-center", !centered && "max-w-[52ch]")}>
        {eyebrow &&
          (eyebrowVariant === "pill" ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 ps-2.5 pe-3 text-caption font-medium text-muted-foreground shadow-[var(--shadow-1)] backdrop-blur">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-[var(--button-primary)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--button-primary)_20%,transparent)]"
              />
              {eyebrow}
            </p>
          ) : (
            <p className="text-caption font-medium tracking-wide text-[var(--button-primary)] uppercase">
              {eyebrow}
            </p>
          ))}
        <Heading className={cn(SIZE[size ?? DEFAULT_SIZE[level]], titleClassName)}>
          {title}
        </Heading>
        {lead && (
          <p className={cn("text-lead text-muted-foreground", centered && "max-w-[60ch]")}>
            {lead}
          </p>
        )}
      </div>
      {actions && (
        <div className={cn("flex flex-wrap items-center gap-3", centered && "justify-center")}>
          {actions}
        </div>
      )}
    </div>
  );
}
