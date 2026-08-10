"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

/* The two bars that sit outside the page: an announcement above it, and a
   cookie notice over it. Both remember being dismissed, and neither may shift
   the layout after the page has painted. */

/**
 * Reads a dismissal flag without rendering anything until mount.
 *
 * The server has no localStorage, so the first client render must match it or
 * hydration mismatches. Returning "unknown" for one frame and rendering nothing
 * is what keeps a dismissed bar from flashing back into view on every load.
 */
function useDismissed(storageKey: string): [boolean | null, () => void] {
  const [dismissed, setDismissed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {
      // storage unavailable (private mode) — show the bar, it is not important
      // enough to break over
    }
    setDismissed(stored === "1");
  }, [storageKey]);

  const dismiss = React.useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // storage unavailable — dismissal lasts for this page view only
    }
  }, [storageKey]);

  return [dismissed, dismiss];
}

export interface AnnouncementBarProps {
  children: React.ReactNode;
  /** Turns the whole bar into a link. */
  href?: string;
  /** Call-to-action text at the end of the message. */
  linkLabel?: string;
  /** Omit to make the bar permanent. */
  dismissible?: boolean;
  /** Change this when the message changes, so a new one shows again. */
  storageKey?: string;
  tone?: "brand" | "neutral" | "warning";
  className?: string;
}

const TONE = {
  brand: "bg-[var(--button-primary)] text-[var(--button-primary-foreground)]",
  neutral: "bg-foreground text-background",
  warning: "bg-[var(--chart-4)] text-foreground",
};

/** A line above the header: a launch, a migration notice, a sale. */
export function AnnouncementBar({
  children,
  href,
  linkLabel,
  dismissible = true,
  storageKey = "vui.announcement",
  tone = "brand",
  className,
}: AnnouncementBarProps) {
  const [dismissed, dismiss] = useDismissed(dismissible ? storageKey : "");
  if (dismissible && dismissed !== false) return null;

  const message = (
    <>
      <span>{children}</span>
      {linkLabel && (
        <span className="font-semibold underline underline-offset-4">{linkLabel}</span>
      )}
    </>
  );

  return (
    <div className={cn("w-full text-sm", TONE[tone], className)}>
      <div className="vui-container flex items-center justify-center gap-3 py-2 text-center">
        {href ? (
          <a href={href} className="flex flex-wrap items-center justify-center gap-2">
            {message}
          </a>
        ) : (
          <span className="flex flex-wrap items-center justify-center gap-2">{message}</span>
        )}
        {dismissible && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="ms-2 grid size-6 shrink-0 cursor-pointer place-items-center rounded transition-colors hover:bg-black/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="vui-icon-plain size-3.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export interface CookieBannerProps {
  /** The notice. Keep it to a sentence and link the policy. */
  children?: React.ReactNode;
  policyHref?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  settingsLabel?: string;
  /** Called with the choice, so a host can load or skip analytics. */
  onDecision?: (decision: "accepted" | "rejected") => void;
  /** Opens your preferences UI. Omit to hide the button. */
  onSettings?: () => void;
  storageKey?: string;
  className?: string;
}

/**
 * Cookie consent. Reject is as prominent as Accept, because a consent banner
 * where refusing is harder than agreeing is not consent.
 *
 * It stores only the decision, never a tracking identifier, and the host decides
 * what to do with it through `onDecision`.
 */
export function CookieBanner({
  children = "We use cookies to understand how the site is used. You choose what we keep.",
  policyHref,
  acceptLabel = "Accept",
  rejectLabel = "Reject",
  settingsLabel = "Preferences",
  onDecision,
  onSettings,
  storageKey = "vui.cookie-consent",
  className,
}: CookieBannerProps) {
  const [dismissed, dismiss] = useDismissed(storageKey);
  if (dismissed !== false) return null;

  const decide = (decision: "accepted" | "rejected") => {
    try {
      localStorage.setItem(`${storageKey}.decision`, decision);
    } catch {
      // storage unavailable — the decision applies to this page view only
    }
    onDecision?.(decision);
    dismiss();
  };

  return (
    // z-[250] is the toast layer: this must clear dialogs and menus, since it
    // can appear while anything else is open.
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cn(
        "vui-fade-in fixed inset-x-0 bottom-0 z-[250] p-3 sm:p-4",
        className,
      )}
    >
      <div className="vui-container flex max-w-[52rem] flex-col gap-3 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-[var(--shadow-4)] sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {children}{" "}
          {policyHref && (
            <a href={policyHref} className="font-medium text-foreground underline underline-offset-4">
              Privacy policy
            </a>
          )}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {onSettings && (
            <button
              type="button"
              onClick={onSettings}
              className="h-8 cursor-pointer rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {settingsLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="h-8 cursor-pointer rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="h-8 cursor-pointer rounded-md bg-[var(--button-primary)] px-3 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors hover:bg-[var(--button-primary-hover)]"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** An inline notice inside page content: info, success, warning or danger. */
export function Callout({
  children,
  title,
  tone = "info",
  icon,
  className,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-[var(--button-primary)]/30 bg-[var(--button-primary)]/[0.06]",
    success: "border-emerald-500/30 bg-emerald-500/[0.07]",
    warning: "border-amber-500/30 bg-amber-500/[0.07]",
    danger: "border-destructive/30 bg-destructive/[0.07]",
  };
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", tones[tone], className)}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0 text-sm leading-relaxed">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
