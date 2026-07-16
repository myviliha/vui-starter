"use client";

import * as React from "react";

import { cn } from "./utils";

/**
 * Sectioned modal dialog — the theme standard. It provides the shell (centered
 * panel, dimmed backdrop, entrance animation, Escape / backdrop-click to close)
 * and three bordered placeholders — `DialogHeader`, `DialogBody`, `DialogFooter`
 * — so a new dialog only needs to pass content into each. See `ConfirmDialog`
 * for a ready-made example built on top of these.
 *
 *   <Dialog open={open} onClose={close} label="Invite">
 *     <DialogHeader><DialogTitle>Invite teammate</DialogTitle></DialogHeader>
 *     <DialogBody>…form…</DialogBody>
 *     <DialogFooter><Button onClick={close}>Cancel</Button>…</DialogFooter>
 *   </Dialog>
 */
export function Dialog({
  open,
  onClose,
  label,
  className,
  children,
  /** Allow Escape / backdrop click to dismiss (default true). */
  dismissible = true,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog (aria-label). */
  label?: string;
  className?: string;
  children: React.ReactNode;
  dismissible?: boolean;
}) {
  React.useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      className="vui-overlay-in fixed inset-0 z-[70] flex items-center justify-center bg-foreground/25 p-4"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        style={{ ["--vui-pop-origin" as string]: "center" }}
        className={cn(
          "vui-pop-in w-full max-w-md overflow-hidden rounded-lg border border-border bg-background shadow-xl",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Bordered header section. */
export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-b border-border px-5 py-3", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-base font-semibold tracking-tight", className)}>
      {children}
    </h2>
  );
}

/** Scrollable content section (capped so long content scrolls, not the page). */
export function DialogBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-h-[70vh] overflow-y-auto px-5 py-4 text-sm leading-relaxed",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Bordered footer section — right-aligned actions by default. */
export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border px-5 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
