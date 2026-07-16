"use client";

import { cn } from "./utils";
import { Button } from "./button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

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
  // Built on the shared Dialog primitive so it stays in lockstep with the
  // header / body / footer standard.
  return (
    <Dialog open={open} onClose={onCancel} label={title} className="max-w-sm">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {description && (
        <DialogBody className="text-muted-foreground">{description}</DialogBody>
      )}
      <DialogFooter>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button
          variant={destructive ? "destructive" : "primary"}
          onClick={onConfirm}
          className={cn(destructive && "[&_svg]:border-white/30")}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
