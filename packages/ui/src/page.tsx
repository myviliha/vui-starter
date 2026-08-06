"use client";

import * as React from "react";

import { cn } from "./utils";

/**
 * The standard page frame, as a component instead of markup every page copies.
 *
 * The shape is fixed on purpose, because it is what makes twelve screens feel
 * like one app: a full-height column, a 48px action header holding the
 * breadcrumb trail and whatever that page's actions are, then the single
 * scrolling content region with `p-4` padding and `gap-4` between blocks.
 *
 * ```tsx
 * <Page breadcrumbs={<Breadcrumbs />} actions={<Button>New</Button>}>
 *   <section>…</section>
 * </Page>
 * ```
 *
 * What varies is the content of the slots, not the frame. Where a page needs
 * something the slots don't cover, the class-name props open each region up
 * without reaching for a different layout.
 */
export type PageProps = {
  /** Left of the action header. Usually `<Breadcrumbs />`. */
  breadcrumbs?: React.ReactNode;
  /** Right of the action header: buttons, a note, a filter control. */
  actions?: React.ReactNode;
  /** The page body. Rendered inside the one scrolling region. */
  children: React.ReactNode;
  /** Pinned below the content, outside the scroll: a Save bar, a summary. */
  footer?: React.ReactNode;
  /** Drop the standard `flex flex-col gap-4 p-4` wrapper and lay the body out
   *  yourself. For a page that owns its own scrolling, like a board. */
  bare?: boolean;
  /** Hide the header entirely, for a page that has nothing to put in it. */
  hideHeader?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function Page({
  breadcrumbs,
  actions,
  children,
  footer,
  bare = false,
  hideHeader = false,
  className,
  headerClassName,
  contentClassName,
}: PageProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {!hideHeader && (
        <div
          className={cn(
            "flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4",
            headerClassName,
          )}
        >
          {breadcrumbs}
          {/* Right-aligned even when there are no breadcrumbs to push against. */}
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {/* The single scroll owner. Nothing inside should scroll the document. */}
      <div className={cn("min-h-0 flex-1 overflow-y-auto", contentClassName)}>
        {bare ? children : <div className="flex flex-col gap-4 p-4">{children}</div>}
      </div>
      {footer}
    </div>
  );
}
