import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/**
 * The first thing a visitor reads. One component, seven shapes, because a hero
 * is always the same parts arranged differently: eyebrow, headline, lead,
 * actions, and something to look at.
 *
 *   centered  headline over a centred column, visual underneath
 *   split     text one side, visual the other
 *   product   centred text with a screenshot bleeding off the bottom edge
 *   gradient  centred text on a brand aurora wash, for a landing page
 *   minimal   text only, for inner pages
 *   image     full-bleed background image with an overlay
 *   video     same, with a muted looping video
 *
 * Four shapes people ask for by name are these seven plus a prop, and adding a
 * variant that renders identically would only be a second name for the same
 * markup:
 *
 *   full screen   any variant with `fullScreen`
 *   breadcrumb    any variant with `breadcrumbs`
 *   search        any variant with `search`
 *   conversion    `minimal` or `gradient` with `actions` and no `visual`
 *
 * The headline is the page's `h1`, which is why `level` defaults to 1 here and
 * to 2 everywhere else.
 */
export type HeroVariant =
  | "centered"
  | "split"
  | "product"
  | "gradient"
  | "minimal"
  | "image"
  | "video";

export interface HeroProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** Buttons. The first should be the primary action. */
  actions?: ReactNode;
  /** Screenshot, illustration or anything else. Ignored by `minimal`. */
  visual?: ReactNode;
  /** Logos, ratings or a line of reassurance under the actions. */
  footnote?: ReactNode;
  /** A trail above the eyebrow, for an inner page. Pass `<Breadcrumbs/>`. */
  breadcrumbs?: ReactNode;
  /** A search field under the lead, for a directory or docs landing page. */
  search?: ReactNode;
  variant?: HeroVariant;
  /** Background for `image` and `video`. A URL; the overlay is applied for you. */
  media?: string;
  /** Poster frame while a video loads, and the fallback if it cannot play. */
  poster?: string;
  tone?: SectionTone;
  /** Reversed layout for `split`, putting the visual first on wide screens. */
  reverse?: boolean;
  /** Fills the viewport. Use sparingly; it pushes everything below the fold. */
  fullScreen?: boolean;
  /**
   * Background texture behind the words. `grid` and `dots` are faint and fade
   * out downward; `none` opts out. Ignored by `image` and `video`, which have a
   * background already.
   */
  pattern?: "none" | "grid" | "dots";
  /** Draws the headline in a brand gradient. Defaults on for `gradient`. */
  gradientTitle?: boolean;
  className?: string;
}

export function Hero({
  title,
  eyebrow,
  lead,
  actions,
  visual,
  footnote,
  breadcrumbs,
  search,
  variant = "centered",
  media,
  poster,
  tone,
  reverse,
  fullScreen,
  pattern = "none",
  gradientTitle,
  className,
}: HeroProps) {
  const overMedia = variant === "image" || variant === "video";
  const gradient = variant === "gradient";
  const decorated = gradient
    ? "vui-aurora"
    : pattern === "grid"
      ? "vui-grid-bg"
      : pattern === "dots"
        ? "vui-dot-bg"
        : "";

  const header = (
    <SectionHeader
      level={1}
      size={variant === "minimal" ? "h1" : "display"}
      align={variant === "split" ? "start" : "center"}
      eyebrow={eyebrow}
      eyebrowVariant="pill"
      title={title}
      lead={lead}
      titleClassName={cn((gradientTitle ?? gradient) && "vui-gradient-text")}
      className={cn(overMedia && "[&_p]:text-white/80 [&_h1]:text-white")}
    />
  );

  const trail = breadcrumbs && (
    <div className={cn("mb-2 text-caption text-muted-foreground", variant !== "split" && "text-center")}>
      {breadcrumbs}
    </div>
  );

  const finder = search && (
    <div className={cn("w-full max-w-xl", variant !== "split" && "mx-auto")}>{search}</div>
  );

  const cta = actions && (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        variant !== "split" && "justify-center",
      )}
    >
      {actions}
    </div>
  );

  const note = footnote && (
    <div
      className={cn(
        "text-caption text-muted-foreground",
        variant !== "split" && "text-center",
        overMedia && "text-white/70",
      )}
    >
      {footnote}
    </div>
  );

  if (variant === "split") {
    return (
      <Section
        as="header"
        tone={tone}
        className={cn(
          "relative isolate",
          decorated,
          fullScreen && "flex min-h-svh items-center",
          className,
        )}
      >
        <div className={cn("grid items-center gap-10 md:grid-cols-2 md:gap-14", reverse && "md:[&>*:first-child]:order-2")}>
          <div className="flex flex-col gap-6">
            {trail}
            {header}
            {finder}
            {cta}
            {note}
          </div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </Section>
    );
  }

  if (overMedia) {
    return (
      <Section
        as="header"
        tone="none"
        className={cn("relative isolate overflow-hidden", fullScreen && "flex min-h-svh items-center", className)}
      >
        {/* The media sits behind everything, with a scrim so text stays legible
            whatever the image is. Decorative, so it is hidden from readers. */}
        {variant === "video" && media ? (
          <video
            className="absolute inset-0 -z-10 size-full object-cover"
            src={media}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          media && (
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${media})` }}
              aria-hidden="true"
            />
          )
        )}
        <div className="absolute inset-0 -z-10 bg-foreground/60" aria-hidden="true" />
        <div className="mx-auto flex max-w-[60ch] flex-col items-center gap-6">
          {trail}
          {header}
          {finder}
          {cta}
          {note}
        </div>
      </Section>
    );
  }

  return (
    <Section
      as="header"
      tone={tone}
      className={cn(
        "relative isolate",
        decorated,
        variant === "product" && "overflow-hidden",
        fullScreen && "flex min-h-svh items-center",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="flex w-full max-w-[62ch] flex-col items-center gap-6">
          {trail}
          {header}
          {finder}
          {cta}
          {note}
        </div>
        {variant !== "minimal" && variant !== "gradient" && visual && (
          <div
            className={cn(
              "w-full min-w-0",
              // The product shot is clipped at the bottom so it reads as the app
              // continuing below the fold rather than a floating rectangle.
              variant === "product" &&
                "-mb-[var(--section-y)] max-h-[36rem] overflow-hidden rounded-t-xl border border-border bg-card shadow-[var(--shadow-4)]",
            )}
          >
            {visual}
          </div>
        )}
      </div>
    </Section>
  );
}
