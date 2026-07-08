"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "./utils";

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
          "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors",
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
            "absolute z-40 mt-1 min-w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
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
      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12px] hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {checked !== undefined && (
        <Check
          className={cn("size-3.5", checked ? "opacity-100" : "opacity-0")}
        />
      )}
    </button>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 py-1 text-[12px] font-medium text-muted-foreground">
      {children}
    </p>
  );
}
