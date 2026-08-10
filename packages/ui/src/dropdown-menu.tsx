"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import {
  DROPDOWN_CONTENT,
  DROPDOWN_ITEM,
  DROPDOWN_LABEL,
  DROPDOWN_TRIGGER,
  DROPDOWN_TRIGGER_ACTIVE,
  DROPDOWN_TRIGGER_IDLE,
} from "./class-variants";
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
  /** Extra classes on the label text — e.g. `hidden sm:inline` to hide it on
   *  mobile so the trigger collapses to an icon-only button. */
  labelClassName?: string;
}

/** Minimal click-to-open menu with outside-click + Escape to close. */
export function Dropdown({
  label,
  icon,
  align = "start",
  children,
  ariaLabel,
  active,
  labelClassName,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  // The menu is portalled to the body and positioned against the trigger.
  // Rendered in place it was clipped by any scrolling ancestor (a form's scroll
  // region, a section card) and sat under the slide-over, so it was either
  // invisible or unclickable exactly where it mattered.
  const [pos, setPos] = React.useState<{
    top: number;
    left?: number;
    right?: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos(
        align === "end"
          ? { top: r.bottom + 4, right: window.innerWidth - r.right }
          : { top: r.bottom + 4, left: r.left },
      );
    };
    place();
    const reflow = () => place();
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
  }, [open, align]);

  React.useEffect(() => {
    if (!open) return;
    function onDocMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      // The menu is outside `ref` now (it's portalled), so check it too.
      if (
        !ref.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
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
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel ?? label}
        className={cn(
          DROPDOWN_TRIGGER,
          active ? DROPDOWN_TRIGGER_ACTIVE : DROPDOWN_TRIGGER_IDLE,
        )}
      >
        {icon}
        {label && <span className={cn("truncate", labelClassName)}>{label}</span>}
      </button>
      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, right: pos.right }}
            className={cn("fixed", DROPDOWN_CONTENT)}
          >
            {children}
          </div>,
          document.body,
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
      className={DROPDOWN_ITEM}
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
    <p className={DROPDOWN_LABEL}>
      {children}
    </p>
  );
}
