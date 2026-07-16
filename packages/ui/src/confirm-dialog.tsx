"use client";

import * as React from "react";

import { cn } from "./utils";
import { Button } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm button as a destructive (red) action. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Centered modal confirmation (e.g. before deleting). Backdrop dims the page;
    Escape / backdrop click / Cancel dismiss it. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="vui-overlay-in fixed inset-0 z-[70] flex items-center justify-center bg-foreground/25 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ ["--vui-pop-origin" as string]: "center" }}
        className="vui-pop-in w-full max-w-sm overflow-hidden rounded-lg border border-border bg-background shadow-xl"
      >
        {/* Header */}
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        </div>
        {/* Content */}
        {description && (
          <div className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={onConfirm}
            className={cn(destructive && "[&_svg]:border-white/30")}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
