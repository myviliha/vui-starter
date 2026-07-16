"use client";

import * as React from "react";
import {
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
} from "@radix-ui/react-icons";

import { cn } from "./utils";

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Custom single-select styled to match the app (Input-like trigger + popover
 * list), replacing the native `<select>`. Click-to-open, outside-click/Escape
 * to close, checkmark on the active option.
 */
export function Select({
  value,
  onValueChange,
  options,
  id,
  ariaLabel,
  placeholder = "Select…",
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  /** Applied to the root (e.g. width in a flex row). */
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
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
      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          className="vui-pop-in absolute z-50 mt-1 max-h-60 w-full min-w-max overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          {options.map((o) => {
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
          })}
        </div>
      )}
    </div>
  );
}
