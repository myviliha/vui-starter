"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "./utils";

type Placement = { left: number; top: number; up: boolean };

/**
 * Lightweight styled tooltip. Wraps a trigger and shows `content` in a themed
 * popover on hover/focus (after a short delay), rendered in a portal with fixed
 * positioning so it floats above any scroll/overflow container. Flips above or
 * below depending on room. No dependency — same portal pattern as `Select`.
 */
export function Tooltip({
  content,
  children,
  className,
  delay = 350,
}: {
  content: React.ReactNode;
  /** The trigger — wrapped in an inline element that carries the hover/focus. */
  children: React.ReactNode;
  /** Applied to the inline trigger wrapper (e.g. `truncate` for a table cell). */
  className?: string;
  /** Hover open delay in ms. */
  delay?: number;
}) {
  const [pos, setPos] = React.useState<Placement | null>(null);
  const ref = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const place = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const up = r.top > 72; // room above? else drop below
    setPos({
      left: r.left + r.width / 2,
      top: up ? r.top - 6 : r.bottom + 6,
      up,
    });
  }, []);

  const open = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(place, delay);
  }, [place, delay]);

  const close = React.useCallback(() => {
    clearTimeout(timer.current);
    setPos(null);
  }, []);

  React.useEffect(() => () => clearTimeout(timer.current), []);
  // Close on scroll (position would go stale).
  React.useEffect(() => {
    if (!pos) return;
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [pos, close]);

  return (
    <span
      ref={ref}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      className={className}
    >
      {children}
      {pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.top,
              transform: pos.up
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
            }}
            className={cn(
              "vui-fade-in pointer-events-none z-[220] max-w-xs rounded-md border border-border bg-popover px-2 py-1",
              "text-xs leading-snug text-popover-foreground shadow-md",
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </span>
  );
}
