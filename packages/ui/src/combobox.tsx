"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  MagnifyingGlassIcon as Search,
  UpdateIcon as Spinner,
} from "@radix-ui/react-icons";

import { cn } from "./utils";
import type { SelectOption } from "./select";
import { useAsyncOptions, type AsyncOptionSource } from "./use-async-options";

export type { AsyncOptionSource, AsyncOption } from "./use-async-options";

type Placement = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

export interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Static options. Omit when using `source` (async). */
  options?: SelectOption[];
  /** Async option source (lazy load on open + debounced search). Takes over from
   *  `options`; the list is fetched on demand, never on mount. */
  source?: AsyncOptionSource;
  /** Changing this invalidates the async cache + reloads on next open — wire it
   *  to a cascade parent (e.g. the selected Region for a Country picker). */
  resetKey?: string;
  id?: string;
  ariaLabel?: string;
  /** Disable the control (trigger inert, popover can't open). */
  disabled?: boolean;
  placeholder?: string;
  /** Placeholder for the filter input. */
  searchPlaceholder?: string;
  /** Shown when the query matches nothing. */
  emptyText?: string;
  /** Shown in the dropdown while an async load is in flight. */
  loadingText?: string;
  /** Shown in the dropdown when an async load fails (click to retry). */
  errorText?: string;
  /** Applied to the root (e.g. width in a flex row). */
  className?: string;
}

/**
 * Searchable single-select. Same trigger + portal-popover as {@link Select}, but
 * the popover leads with a filter input that type-narrows the options, so it
 * scales to long lists (an FK / country picker) where a plain Select doesn't.
 * Pass a static `options` array, or a `source` for async lazy loading (fetch on
 * open, debounced server search, single-record label resolve). Keyboard: type to
 * filter, ↑/↓ to move, Enter to pick, Esc to close.
 */
export function Combobox({
  value,
  onValueChange,
  options,
  source,
  resetKey,
  id,
  ariaLabel,
  disabled = false,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  loadingText = "Loading…",
  errorText = "Couldn't load — retry",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [pos, setPos] = React.useState<Placement | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isAsync = !!source;
  const async = useAsyncOptions({ source, open, search: query, value, resetKey });

  // Async: the server already applied the search, so render as-is. Static: filter
  // client-side by the query.
  const list = React.useMemo(() => {
    if (isAsync) return async.options;
    const opts = options ?? [];
    const q = query.trim().toLowerCase();
    return q ? opts.filter((o) => o.label.toLowerCase().includes(q)) : opts;
  }, [isAsync, async.options, options, query]);

  const place = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    const openUp = below < 280 && above > below;
    setPos({
      left: r.left,
      width: r.width,
      top: openUp ? undefined : r.bottom + 4,
      bottom: openUp ? window.innerHeight - r.top + 4 : undefined,
      maxHeight: Math.min(300, (openUp ? above : below) - 8),
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!open) return;
    place();
    const reflow = () => place();
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
  }, [open, place]);

  // Reset the query + focus the input each time it opens.
  React.useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the active index in range as the list shrinks/grows.
  React.useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, list.length - 1)));
  }, [list.length]);

  // Selected label: from the (async-resolved or static) options; falls back to
  // the raw value if nothing resolves it yet.
  const pool = isAsync ? async.options : (options ?? []);
  const selected = pool.find((o) => o.value === value);
  const commit = (v: string) => {
    onValueChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = list[active];
      if (o) commit(o.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const showLoading = isAsync && async.loading && list.length === 0;
  const showError = isAsync && async.error && !async.loading;

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-2.5 transition-colors",
          "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={listRef}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
            }}
            className="vui-pop-in z-[200] flex flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          >
            <div className="relative border-b border-border p-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                aria-label={ariaLabel ? `Search ${ariaLabel}` : "Search"}
                className="h-8 w-full rounded-sm bg-transparent pl-8 pr-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {isAsync && async.loading && (
                <Spinner className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
            <div role="listbox" aria-label={ariaLabel} className="overflow-auto">
              {showLoading ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {loadingText}
                </div>
              ) : showError ? (
                <button
                  type="button"
                  onClick={async.reload}
                  className="w-full px-3 py-6 text-center text-sm text-destructive hover:underline"
                >
                  {errorText}
                </button>
              ) : list.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                list.map((o, i) => {
                  const isSelected = o.value === value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => commit(o.value)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left last:border-b-0",
                        i === active && "bg-accent text-accent-foreground",
                        isSelected && "bg-accent/60",
                      )}
                    >
                      <span className="truncate">{o.label}</span>
                      {isSelected && (
                        <Check className="size-3.5 shrink-0 text-[var(--button-primary)]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
