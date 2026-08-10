"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

/* Finding things, and the states a list can be in.
 *
 * These fill gaps that exist on the admin side too: the repo had no standalone
 * pagination and no shared empty state before this file. */

export interface SearchBlockProps {
  /** Controlled value. Omit to let the input manage itself. */
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  /** Shown under the field while typing. */
  suggestions?: { label: string; href?: string }[];
  /** Renders the spinner and marks the field busy. */
  loading?: boolean;
  size?: "default" | "lg";
  className?: string;
}

/** A search field. `lg` is the hero variant; the default sits in a toolbar. */
export function SearchBlock({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  label = "Search",
  suggestions,
  loading,
  size = "default",
  className,
}: SearchBlockProps) {
  const id = React.useId();
  const listId = `${id}-suggestions`;

  return (
    <div className={cn("w-full", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(String(new FormData(e.currentTarget).get("q") ?? ""));
        }}
        className="relative"
      >
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
          className={cn("vui-icon-plain pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground", size === "lg" ? "size-5" : "size-4")}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={id}
          name="q"
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-busy={loading || undefined}
          aria-controls={suggestions?.length ? listId : undefined}
          className={cn(
            "w-full rounded-md border border-input bg-background ps-10 pe-3 transition-colors placeholder:text-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none",
            size === "lg" ? "h-12 text-base" : "h-9 text-sm",
          )}
        />
        {loading && (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="vui-icon-plain absolute end-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground motion-reduce:animate-none">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </form>

      {suggestions && suggestions.length > 0 && (
        <ul id={listId} className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-popover">
          {suggestions.map((s, i) => (
            <li key={i}>
              <a href={s.href ?? "#"} className="block px-4 py-2.5 text-sm transition-colors hover:bg-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

/** Category chips plus a sort control. The listing-page toolbar. */
export function FilterBar({
  options,
  active,
  onChange,
  sort,
  className,
}: {
  options: FilterOption[];
  /** The selected value. Use "" for "all". */
  active?: string;
  onChange?: (value: string) => void;
  sort?: { options: FilterOption[]; value?: string; onChange?: (value: string) => void; label?: string };
  className?: string;
}) {
  const sortId = React.useId();
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <ul className="flex flex-wrap items-center gap-2">
        {options.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              aria-pressed={active === o.value}
              onClick={() => onChange?.(o.value)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                active === o.value
                  ? "border-[var(--button-primary)] bg-[var(--button-primary)]/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {o.label}
              {o.count != null && <span className="text-caption opacity-70">{o.count}</span>}
            </button>
          </li>
        ))}
      </ul>

      {sort && (
        <div className="flex items-center gap-2">
          <label htmlFor={sortId} className="text-sm text-muted-foreground">
            {sort.label ?? "Sort"}
          </label>
          <select
            id={sortId}
            value={sort.value}
            onChange={(e) => sort.onChange?.(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {sort.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

/**
 * Page navigation. Renders as a nav of links, so it works without JavaScript
 * and a crawler can follow it, which is the point on a blog.
 */
export function Pagination({
  page,
  totalPages,
  hrefFor,
  onChange,
  className,
}: {
  page: number;
  totalPages: number;
  /** Build a URL per page. Omit for a button-driven list. */
  hrefFor?: (page: number) => string;
  onChange?: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  // Show first, last, current and its neighbours; gap the rest.
  const pages: (number | "gap")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  const item = (target: number, label: React.ReactNode, disabled?: boolean, current?: boolean) => {
    const classes = cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
      current
        ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)]"
        : "border border-border hover:bg-accent",
      disabled && "pointer-events-none opacity-50",
    );
    return hrefFor && !disabled ? (
      <a href={hrefFor(target)} aria-current={current ? "page" : undefined} className={classes}>
        {label}
      </a>
    ) : (
      <button type="button" disabled={disabled} aria-current={current ? "page" : undefined} onClick={() => onChange?.(target)} className={cn(classes, !disabled && "cursor-pointer")}>
        {label}
      </button>
    );
  };

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-2", className)}>
      {item(page - 1, "Previous", page === 1)}
      <ul className="flex items-center gap-1">
        {pages.map((p, i) => (
          <li key={i}>
            {p === "gap" ? (
              <span className="px-2 text-muted-foreground" aria-hidden>
                &hellip;
              </span>
            ) : (
              item(p, p, false, p === page)
            )}
          </li>
        ))}
      </ul>
      {item(page + 1, "Next", page === totalPages)}
    </nav>
  );
}

/** Progressive loading, for feeds where pagination would break the flow. */
export function LoadMore({
  onClick,
  loading,
  remaining,
  label = "Load more",
  className,
}: {
  onClick?: () => void;
  loading?: boolean;
  /** "12 of 48" is more useful than a bare button. */
  remaining?: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {remaining && <p className="text-caption text-muted-foreground">{remaining}</p>}
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-busy={loading || undefined}
        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-60"
      >
        {loading && (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="vui-icon-plain size-4 animate-spin motion-reduce:animate-none">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {loading ? "Loading…" : label}
      </button>
    </div>
  );
}

/**
 * Nothing here. An empty state should say why it is empty and what to do next,
 * which is why the action is a prop and not optional decoration.
 */
export function EmptyState({
  title,
  body,
  icon,
  action,
  className,
}: {
  title: React.ReactNode;
  body?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center", className)}>
      {icon && <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</span>}
      <p className="text-h4 font-semibold tracking-tight">{title}</p>
      {body && <p className="max-w-[46ch] leading-relaxed text-muted-foreground">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Card skeletons, sized like the cards they stand in for so nothing shifts. */
export function LoadingCards({
  count = 3,
  columns = 3,
  className,
}: {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={cn("grid gap-6", cols, className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card" aria-hidden>
          <div className="aspect-[16/9] w-full animate-pulse bg-accent motion-reduce:animate-none" />
          <div className="flex flex-col gap-2 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-accent motion-reduce:animate-none" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-accent motion-reduce:animate-none" />
            <div className="h-3 w-full animate-pulse rounded bg-accent motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
