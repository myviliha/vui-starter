"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { cn } from "./utils";

export type ToastVariant = "default" | "success" | "error" | "warning";
export type ToastAction = { label: string; onClick: () => void };
export type ToastOptions = {
  title: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  /** A single action button (e.g. "Undo"). Firing it dismisses the toast. */
  action?: ToastAction;
  /** Auto-dismiss after ms. Default 5000; `0` keeps it until dismissed. */
  duration?: number;
};
type ToastItem = ToastOptions & { id: number };

// Module-scoped store so `toast()` works from anywhere — event handlers, catch
// blocks, effects — without a wrapping provider. `<Toaster/>` subscribes to it.
let items: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId = 1;
const emit = () => listeners.forEach((l) => l());

/** Remove a toast by id. */
export function dismissToast(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

function addToast(opts: ToastOptions): number {
  const id = nextId++;
  items = [...items, { ...opts, id }];
  emit();
  const duration = opts.duration ?? 5000;
  if (duration > 0) setTimeout(() => dismissToast(id), duration);
  return id;
}

type ToastFn = ((opts: ToastOptions | string) => number) & {
  success: (title: string, opts?: Omit<ToastOptions, "title" | "variant">) => number;
  error: (title: string, opts?: Omit<ToastOptions, "title" | "variant">) => number;
  warning: (title: string, opts?: Omit<ToastOptions, "title" | "variant">) => number;
  dismiss: (id: number) => void;
};

/** Show a toast. `toast("Saved")`, `toast({ title, description, action })`, or
 *  `toast.error("...")` / `toast.success(...)`. Returns the toast id. */
export const toast: ToastFn = Object.assign(
  (opts: ToastOptions | string) =>
    addToast(typeof opts === "string" ? { title: opts } : opts),
  {
    success: (title: string, opts?: Omit<ToastOptions, "title" | "variant">) =>
      addToast({ ...opts, title, variant: "success" }),
    error: (title: string, opts?: Omit<ToastOptions, "title" | "variant">) =>
      addToast({ ...opts, title, variant: "error" }),
    warning: (title: string, opts?: Omit<ToastOptions, "title" | "variant">) =>
      addToast({ ...opts, title, variant: "warning" }),
    dismiss: dismissToast,
  },
);

const VARIANT_ICON = {
  success: CheckCircledIcon,
  error: CrossCircledIcon,
  warning: ExclamationTriangleIcon,
  default: null,
} as const;
const VARIANT_ICON_CLS = {
  success: "text-emerald-500",
  error: "text-destructive",
  warning: "text-amber-500",
  default: "",
} as const;

function ToastCard({ t }: { t: ToastItem }) {
  const variant = t.variant ?? "default";
  const Icon = VARIANT_ICON[variant];
  return (
    <div
      role="status"
      aria-live={variant === "error" ? "assertive" : "polite"}
      className="vui-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border bg-background p-4 shadow-lg"
    >
      {Icon && (
        <Icon className={cn("mt-0.5 size-5 shrink-0", VARIANT_ICON_CLS[variant])} />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{t.title}</p>
        {t.description !== undefined && t.description !== "" && (
          <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
        )}
      </div>
      {t.action && (
        <button
          type="button"
          onClick={() => {
            t.action!.onClick();
            dismissToast(t.id);
          }}
          className="shrink-0 rounded-md border border-border px-2.5 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {t.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => dismissToast(t.id)}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Cross2Icon className="size-4" />
      </button>
    </div>
  );
}

/**
 * Mount once (e.g. in the root layout). Renders the toast stack (bottom-right)
 * in a portal above everything. Trigger toasts from anywhere with `toast(...)`.
 */
export function Toaster() {
  const list = React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => items,
    () => items,
  );
  // Render nothing until mounted, so the FIRST client render matches the
  // server's `null` (a bare `typeof document` check doesn't — `document` exists
  // during hydration, so the portal would appear on the client only → mismatch).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[250] flex flex-col items-end gap-2 p-4 sm:left-auto sm:right-0 sm:max-w-sm"
    >
      {list.map((t) => (
        <ToastCard key={t.id} t={t} />
      ))}
    </div>,
    document.body,
  );
}
