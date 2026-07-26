"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  MagnifyingGlassIcon as Search,
} from "@radix-ui/react-icons";

import { cn } from "./utils";
import type { SelectOption } from "./select";

type Placement = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

/**
 * Searchable single-select. Same trigger + portal-popover as {@link Select}, but
 * the popover leads with a filter input that type-narrows the options, so it
 * scales to long lists (an FK / country picker) where a plain Select doesn't.
 * Same API as Select (drop-in), plus search/empty placeholders. Keyboard: type
 * to filter, ↑/↓ to move, Enter to pick, Esc to close.
 */
export function Combobox({
  value,
  onValueChange,
  options,
  id,
  ariaLabel,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  /** Placeholder for the filter input. */
  searchPlaceholder?: string;
  /** Shown when the query matches nothing. */
  emptyText?: string;
  /** Applied to the root (e.g. width in a flex row). */
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [pos, setPos] = React.useState<Placement | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

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

  // Keep the active index in range as the filtered list shrinks/grows.
  React.useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const selected = options.find((o) => o.value === value);
  const commit = (v: string) => {
    onValueChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = filtered[active];
      if (o) commit(o.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-2.5 transition-colors",
          "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
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
            </div>
            <div role="listbox" aria-label={ariaLabel} className="overflow-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                filtered.map((o, i) => {
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
