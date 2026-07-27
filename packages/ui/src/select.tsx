"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  UpdateIcon as Spinner,
} from "@radix-ui/react-icons";

import { cn } from "./utils";
import { useAsyncOptions, type AsyncOptionSource } from "./use-async-options";

export interface SelectOption {
  value: string;
  label: string;
}

type Placement = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Static options. Omit when using `source` (async). */
  options?: SelectOption[];
  /** Async option source — loads on open (no search box; use `Combobox` for a
   *  searchable remote list). The set value's label resolves via one record. */
  source?: AsyncOptionSource;
  /** Changing this invalidates the async cache + reloads on next open. */
  resetKey?: string;
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  loadingText?: string;
  errorText?: string;
  /** Applied to the root (e.g. width in a flex row). */
  className?: string;
}

/**
 * Custom single-select styled to match the app (Input-like trigger + popover
 * list), replacing the native `<select>`. Click-to-open, outside-click/Escape
 * to close, checkmark on the active option. The list is rendered in a portal
 * with fixed positioning so it floats above any scrolling/overflow container
 * (forms, dialogs, the tab-kept pages) instead of being clipped. Pass static
 * `options`, or a `source` to load on open (for a searchable remote list use
 * {@link Combobox} instead).
 */
export function Select({
  value,
  onValueChange,
  options,
  source,
  resetKey,
  id,
  ariaLabel,
  placeholder = "Select…",
  loadingText = "Loading…",
  errorText = "Couldn't load — retry",
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<Placement | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const isAsync = !!source;
  const async = useAsyncOptions({ source, open, search: "", value, resetKey });
  const list = isAsync ? async.options : (options ?? []);

  const place = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    // Flip up when there isn't room below and there's more room above.
    const openUp = below < 240 && above > below;
    setPos({
      left: r.left,
      width: r.width,
      top: openUp ? undefined : r.bottom + 4,
      bottom: openUp ? window.innerHeight - r.top + 4 : undefined,
      maxHeight: Math.min(240, (openUp ? above : below) - 8),
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!open) return;
    place();
    const reflow = () => place();
    // capture: catch scrolls inside any ancestor container, not just the window
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
  }, [open, place]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = list.find((o) => o.value === value);
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
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-2.5 transition-colors",
          "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        {isAsync && async.loading ? (
          <Spinner className="size-3.5 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        )}
      </button>
      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            aria-label={ariaLabel}
            tabIndex={-1}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
            }}
            className="vui-pop-in z-[200] overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          >
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
                {placeholder}
              </div>
            ) : (
              list.map((o) => {
                const active = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onValueChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-accent hover:text-accent-foreground",
                      active && "bg-accent/60",
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {active && (
                      <Check className="size-3.5 shrink-0 text-[var(--button-primary)]" />
                    )}
                  </button>
                );
              })
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
