import type { ReactNode } from "react";

import { AuthHeader } from "@/app/_components/auth-header";
import { SiteFooter } from "@/app/_components/site-footer";

/**
 * The shell every error screen wears: brand header, a centred block, footer. No
 * sidebar and no menus, because a signed-out visitor hitting a 404 should not be
 * dropped into the app chrome.
 *
 * One component for the real `not-found.tsx` and `error.tsx` boundaries and for
 * the demo pages under /errors, so a new error screen is a code, a title and a
 * sentence rather than another copy of this layout.
 */
export function ErrorScreen({
  code,
  title,
  message,
  icon,
  actions,
  tone = "muted",
}: {
  /** Big and muted: "404", "500", "Maintenance". */
  code: string;
  title: string;
  message: ReactNode;
  icon: ReactNode;
  actions?: ReactNode;
  /** A failure we caused reads destructive; everything else stays neutral. */
  tone?: "muted" | "destructive";
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AuthHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div
          className={
            tone === "destructive"
              ? "grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive"
              : "grid size-14 place-items-center rounded-full bg-muted text-muted-foreground"
          }
        >
          {icon}
        </div>
        <p className="text-6xl font-semibold tracking-tight text-muted-foreground">
          {code}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-sm text-muted-foreground">{message}</p>
        {actions}
      </main>
      <SiteFooter />
    </div>
  );
}
