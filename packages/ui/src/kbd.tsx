import * as React from "react";

import { cn } from "./utils";

/** A single keyboard key cap. */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-grid min-w-[1.4rem] place-items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/**
 * A keyboard shortcut rendered as separate key caps joined by "+" — e.g.
 * `<Shortcut keys={["⌘", "K"]} />` → ⌘ + K. Pass each key as its own string.
 */
export function Shortcut({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((k, i) => (
        <React.Fragment key={`${k}-${i}`}>
          {i > 0 && (
            <span aria-hidden="true" className="text-muted-foreground/60">
              +
            </span>
          )}
          <Kbd>{k}</Kbd>
        </React.Fragment>
      ))}
    </span>
  );
}
