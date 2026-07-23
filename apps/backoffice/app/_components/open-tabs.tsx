"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Cross2Icon, FileIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { isGroup, NAV, type IconType } from "./nav-config";
import { colorFor, labelFor } from "./route-meta";

/**
 * Open tabs — a browser-style strip of the pages you've opened, so several
 * pages stay one click apart. Navigation-tab model: the strip tracks opened
 * routes and switching is a `router.push` (the page re-renders); the tab *list*
 * persists across reloads via sessionStorage. Labels/icons/colors come from the
 * same single source as the sidebar (`nav-config` + `route-meta`), so a new
 * page is tab-able with zero extra wiring.
 */

type Tab = { href: string; label: string; icon: IconType; color?: string };

/** href → { label, icon, color }, flattened from NAV once. */
const NAV_META = (() => {
  const m = new Map<string, { label: string; icon: IconType; color?: string }>();
  for (const section of NAV) {
    for (const entry of section.items) {
      if (isGroup(entry)) {
        for (const c of entry.children)
          m.set(c.href, { label: c.label, icon: c.icon, color: c.color });
      } else {
        m.set(entry.href, {
          label: entry.label,
          icon: entry.icon,
          color: entry.color,
        });
      }
    }
  }
  return m;
})();

/** Resolve a tab's display metadata from its path (query ignored). */
function tabMeta(href: string): Tab {
  const clean = href.split("?")[0] ?? href;
  const exact = NAV_META.get(clean);
  if (exact) return { href: clean, ...exact };
  // e.g. /organizations/new → inherit the parent's icon/color, label the leaf.
  const parent = clean.slice(0, clean.lastIndexOf("/")) || "/";
  const pm = NAV_META.get(parent);
  const seg = clean.split("/").filter(Boolean).pop() ?? "";
  return {
    href: clean,
    label: labelFor(seg),
    icon: pm?.icon ?? FileIcon,
    color: pm?.color ?? colorFor(clean),
  };
}

const KEY = "vui.openTabs";

/** Max tabs kept open, from the env (build-time inlined). Default 5, min 1. */
export const MAX_TABS = (() => {
  const n = Number(process.env.NEXT_PUBLIC_MAX_TABS);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 5;
})();

type Ctx = {
  tabs: Tab[];
  activeHref: string;
  /** Add a tab. `background: true` opens it without leaving the current page. */
  openTab: (href: string, opts?: { background?: boolean }) => void;
  close: (href: string) => void;
  /** Transient warning (e.g. the oldest tab was evicted at the cap). */
  notice: string | null;
};
const OpenTabsContext = React.createContext<Ctx | null>(null);

export function useOpenTabs(): Ctx {
  const ctx = React.useContext(OpenTabsContext);
  if (!ctx)
    throw new Error("useOpenTabs must be used within <OpenTabsProvider>");
  return ctx;
}

export function OpenTabsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // Only hrefs are stored (icons don't serialize); tabs are derived on render.
  const [hrefs, setHrefs] = React.useState<string[]>([]);
  const [notice, setNotice] = React.useState<string | null>(null);
  const noticeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  // Latest pathname for the (pure) reducer without re-creating callbacks.
  const activeRef = React.useRef(pathname);
  activeRef.current = pathname;
  // Set inside the reducer when a tab is evicted; drained by the persist effect
  // so the warning fires exactly once. ponytail: a ref write in a reducer is a
  // benign, idempotent side effect — fine here, avoids a second state pass.
  const evicted = React.useRef(false);

  const showNotice = React.useCallback((msg: string) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3200);
  }, []);

  /** Add `href`, then evict the oldest tab that isn't the one just added or the
   *  active page until within MAX_TABS. Pure enough to run in a reducer. */
  const capAdd = React.useCallback((prev: string[], href: string): string[] => {
    if (prev.includes(href)) return prev;
    const next = [...prev, href];
    while (next.length > MAX_TABS) {
      const i = next.findIndex((h) => h !== href && h !== activeRef.current);
      if (i === -1) break; // nothing safe to drop
      next.splice(i, 1);
      evicted.current = true;
    }
    return next;
  }, []);

  // Hydrate from sessionStorage once, ensuring the current page is present and
  // the list is within the cap (older extras dropped silently on load).
  React.useEffect(() => {
    let stored: string[] = [];
    try {
      stored = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    } catch {
      // ignore malformed storage
    }
    if (!stored.includes(pathname)) stored.push(pathname);
    while (stored.length > MAX_TABS) {
      const i = stored.findIndex((h) => h !== pathname);
      if (i === -1) break;
      stored.splice(i, 1);
    }
    setHrefs(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add the current route as a tab when navigating.
  React.useEffect(() => {
    setHrefs((prev) => capAdd(prev, pathname));
  }, [pathname, capAdd]);

  // Persist the open list, and surface any eviction that just happened.
  React.useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(hrefs));
    } catch {
      // ignore storage failures (private mode, quota)
    }
    if (evicted.current) {
      evicted.current = false;
      showNotice(`Only ${MAX_TABS} tabs stay open — closed the oldest.`);
    }
  }, [hrefs, showNotice]);

  const openTab = React.useCallback(
    (href: string, opts?: { background?: boolean }) => {
      const clean = href.split("?")[0] ?? href;
      setHrefs((prev) => capAdd(prev, clean));
      // Foreground open switches to it; background just parks it in the strip.
      if (!opts?.background) router.push(href);
    },
    [router, capAdd],
  );

  const close = React.useCallback(
    (href: string) => {
      const idx = hrefs.indexOf(href);
      const next = hrefs.filter((h) => h !== href);
      setHrefs(next.length ? next : ["/dashboard"]);
      // If the active tab closed, fall back to its neighbour.
      if (href === pathname) {
        const target = next[idx - 1] ?? next[idx] ?? "/dashboard";
        router.push(target);
      }
    },
    [hrefs, pathname, router],
  );

  const value = React.useMemo<Ctx>(
    () => ({
      tabs: hrefs.map(tabMeta),
      activeHref: pathname,
      openTab,
      close,
      notice,
    }),
    [hrefs, pathname, openTab, close, notice],
  );

  return (
    <OpenTabsContext.Provider value={value}>
      {children}
    </OpenTabsContext.Provider>
  );
}

/** The tab strip — render it directly under the top bar. */
export function TabStrip() {
  const { tabs, activeHref, close, notice } = useOpenTabs();
  const router = useRouter();
  if (tabs.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Open pages"
      className="flex h-9 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-background px-2"
    >
      {tabs.map((t) => {
        const active = t.href === activeHref;
        const Icon = t.icon;
        return (
          <div
            key={t.href}
            role="tab"
            aria-selected={active}
            className={cn(
              "group flex h-7 shrink-0 items-center gap-1.5 rounded-md pl-2 pr-1 text-sm transition-colors",
              active
                ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)]"
                : "text-muted-foreground hover:bg-accent/50",
            )}
          >
            <button
              type="button"
              onClick={() => router.push(t.href)}
              className="flex items-center gap-1.5"
            >
              <Icon
                className={cn(
                  "size-3.5 shrink-0",
                  active ? "text-[var(--button-primary-foreground)]" : t.color,
                )}
              />
              <span className="max-w-40 truncate">{t.label}</span>
            </button>
            <button
              type="button"
              onClick={() => close(t.href)}
              aria-label={`Close ${t.label}`}
              className={cn(
                "grid size-4 place-items-center rounded opacity-70 transition-colors group-hover:opacity-100",
                active
                  ? "text-[var(--button-primary-foreground)] hover:bg-white/20"
                  : "text-muted-foreground hover:bg-border hover:text-foreground",
              )}
            >
              <Cross2Icon className="size-3" />
            </button>
          </div>
        );
      })}
      {notice && (
        <span
          role="status"
          className="vui-fade-in ml-auto shrink-0 whitespace-nowrap rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
        >
          {notice}
        </span>
      )}
    </div>
  );
}
