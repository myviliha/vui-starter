"use client";

import * as React from "react";

import { cn } from "./utils";

/**
 * Bordered list primitives — the theme standard for menus and record lists.
 * Each row draws its own bottom divider (the last one is omitted), so any list
 * built from these can't miss the border. Use `Menu` as the rounded, clipped
 * container and `MenuItem` for each row; `MenuLabel` for section headers.
 */

/** Shared row styling — exported for the rare case you must style a bespoke
 *  element (e.g. a framework `<Link>`) yet still match the standard. */
export const menuItemClass =
  "flex w-full items-center gap-2.5 border-b border-border px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-accent";

export function Menu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="menu"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a different element (e.g. a framework `<Link>`); default button. */
  as?: React.ElementType;
  href?: string;
}

/** A bordered list row. Renders a `<button>` by default; pass `as={Link}` +
 *  `href` to render a navigation link. Divider + hover come baked in. */
export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  function MenuItem({ as: Comp = "button", className, children, ...props }, ref) {
    return (
      <Comp
        ref={ref}
        role="menuitem"
        className={cn(menuItemClass, className)}
        {...(Comp === "button" ? { type: "button" } : {})}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

export function MenuLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "border-b border-border px-3 py-2 font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
