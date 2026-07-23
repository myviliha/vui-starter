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

type Ctx = {
  tabs: Tab[];
  activeHref: string;
  /** Add a tab. `background: true` opens it without leaving the current page. */
  openTab: (href: string, opts?: { background?: boolean }) => void;
  close: (href: string) => void;
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

  // Hydrate from sessionStorage once, ensuring the current page is present.
  React.useEffect(() => {
    let stored: string[] = [];
    try {
      stored = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    } catch {
      // ignore malformed storage
    }
    if (!stored.includes(pathname)) stored = [...stored, pathname];
    setHrefs(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add the current route as a tab when navigating.
  React.useEffect(() => {
    setHrefs((prev) => (prev.includes(pathname) ? prev : [...prev, pathname]));
  }, [pathname]);

  // Persist the open list.
  React.useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(hrefs));
    } catch {
      // ignore storage failures (private mode, quota)
    }
  }, [hrefs]);

  const openTab = React.useCallback(
    (href: string, opts?: { background?: boolean }) => {
      const clean = href.split("?")[0] ?? href;
      setHrefs((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
      // Foreground open switches to it; background just parks it in the strip.
      if (!opts?.background) router.push(href);
    },
    [router],
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
    () => ({ tabs: hrefs.map(tabMeta), activeHref: pathname, openTab, close }),
    [hrefs, pathname, openTab, close],
  );

  return (
    <OpenTabsContext.Provider value={value}>
      {children}
    </OpenTabsContext.Provider>
  );
}

/** The tab strip — render it directly under the top bar. */
export function TabStrip() {
  const { tabs, activeHref, close } = useOpenTabs();
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
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/50",
            )}
          >
            <button
              type="button"
              onClick={() => router.push(t.href)}
              className="flex items-center gap-1.5"
            >
              <Icon className={cn("size-3.5 shrink-0", t.color)} />
              <span className="max-w-40 truncate">{t.label}</span>
            </button>
            <button
              type="button"
              onClick={() => close(t.href)}
              aria-label={`Close ${t.label}`}
              className="grid size-4 place-items-center rounded text-muted-foreground opacity-60 transition-colors hover:bg-border hover:text-foreground group-hover:opacity-100"
            >
              <Cross2Icon className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
