import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

/**
 * Content that scrolls sideways, forever.
 *
 * The children are rendered twice inside one track, and the track is translated
 * by exactly half its width, which is what makes the loop seamless. The second
 * copy is hidden from assistive tech, so a strip of six logos is announced as
 * six and not twelve.
 *
 * `LogoCloud` uses this for its marquee variant. Reach for it directly for
 * anything else that belongs on a moving strip: awards, integrations, quotes.
 *
 * It stops on hover, and it stops when focus lands inside it. Motion that
 * cannot be stopped is the accessibility failure people actually hit with this
 * pattern: a keyboard user tabbing to a link on a moving strip cannot reach it.
 * `prefers-reduced-motion` stops it before it ever starts.
 */
export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. Longer is calmer. */
  duration?: number;
  /** Runs right to left by default; `reverse` sends it the other way. */
  reverse?: boolean;
  /** Fade the ends into the background, so items do not appear to be cut off. */
  fade?: boolean;
  /** Space between items. */
  gap?: "sm" | "md" | "lg";
  /** Keeps moving while the pointer is over it. */
  pauseOnHover?: boolean;
  className?: string;
}

/* The gap is a length rather than a class because each copy also needs it as
   trailing padding. Without that, one copy is `n` items and `n - 1` gaps, the
   halves are unequal, and the loop jumps by half a gap on every pass. */
const GAP = { sm: "1.5rem", md: "2.5rem", lg: "4rem" } as const;

export function Marquee({
  children,
  duration = 40,
  reverse,
  fade = true,
  gap = "md",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max items-center animate-[vui-marquee_var(--vui-marquee-duration)_linear_infinite] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          "group-focus-within:[animation-play-state:paused]",
        )}
        style={{
          ["--vui-marquee-duration" as string]: `${duration}s`,
          ["--vui-marquee-gap" as string]: GAP[gap],
        }}
      >
        <div className="flex shrink-0 items-center gap-[var(--vui-marquee-gap)] pe-[var(--vui-marquee-gap)]">
          {children}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-center gap-[var(--vui-marquee-gap)] pe-[var(--vui-marquee-gap)]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
