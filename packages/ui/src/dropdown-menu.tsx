"use client";

import * as React from "react";

import { cn } from "./utils";
import { Checkbox } from "./checkbox";

interface DropdownProps {
  label: string;
  icon?: React.ReactNode;
  align?: "start" | "end";
  children: React.ReactNode;
  /** Accessible name for icon-only triggers (when label is empty). */
  ariaLabel?: string;
  /** Render the trigger as a compact toolbar button (default) or a plain one. */
  active?: boolean;
}

/** Minimal click-to-open menu with outside-click + Escape to close. */
export function Dropdown({
  label,
  icon,
  align = "start",
  children,
  ariaLabel,
  active,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDocMouseDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel ?? label}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 font-medium transition-colors",
          active
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        {icon}
        {label}
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-1 min-w-52 overflow-hidden rounded-md border border-border bg-popover text-left text-sm font-normal text-popover-foreground shadow-md",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  checked?: boolean;
  icon?: React.ReactNode;
}

export function DropdownItem({
  children,
  onSelect,
  checked,
  icon,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-accent hover:text-accent-foreground"
    >
      <span className="flex-1 truncate">{children}</span>
      {icon}
      {checked !== undefined && (
        <Checkbox
          checked={checked}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none"
        />
      )}
    </button>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
      {children}
    </p>
  );
}
