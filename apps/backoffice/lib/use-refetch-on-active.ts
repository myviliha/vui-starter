"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Revalidate a KEPT-ALIVE tab. Keep-alive preserves the mounted controller, so
 * its once-on-mount fetch never re-runs and the data freezes at open time (see
 * `KeepAliveTabs` in `_components/open-tabs.tsx`). This runs `refetch` at the
 * two moments a stale tab actually matters:
 *
 *   1. the tab becomes the active route again (you clicked back to it), and
 *   2. the browser window/app regains focus (you returned from elsewhere).
 *
 * Pair it with a *delta* fetch (`?since=cursor`) in the controller, not a full
 * reload — the whole point is a cheap "what changed?" call, not re-pulling the
 * list. ponytail: no polling, no realtime socket; we revalidate only when a
 * human looks at the tab.
 *
 * @param routePath this route's canonical path (e.g. "/organizations"); compared
 *   to the live pathname to detect re-activation. Trailing slash is tolerated.
 */
export function useRefetchOnActive(routePath: string, refetch: () => void): void {
  const pathname = usePathname();
  // Keep the latest refetch without re-subscribing the window listeners.
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  // Re-activation: only fire on the transition from inactive → active, so a
  // plain re-render of the active tab doesn't refetch.
  const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
  const wasActive = useRef(true);
  useEffect(() => {
    const active = norm(pathname) === norm(routePath);
    if (active && !wasActive.current) refetchRef.current();
    wasActive.current = active;
  }, [pathname, routePath]);

  // Window/app refocus — catches another user's edit made while you were away.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refetchRef.current();
    };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
