"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import {
  Cross2Icon,
  DragHandleDots2Icon,
  FileIcon,
} from "@radix-ui/react-icons";

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

/** Canonical tab identity: drop the query and any trailing slash, so
 *  "/branches" (nav config) and "/branches/" (trailingSlash router) are one
 *  tab. Root "/" is preserved. */
function tabKey(href: string): string {
  const path = (href.split("?")[0] ?? href) || "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** Resolve a tab's display metadata from its path (query ignored). */
function tabMeta(href: string): Tab {
  const clean = tabKey(href);
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
const COLORS_KEY = "vui.openTabColors";

/** Max tabs kept open, from the env (build-time inlined). Default 5, min 1. */
export const MAX_TABS = (() => {
  const n = Number(process.env.NEXT_PUBLIC_MAX_TABS);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 5;
})();

/** Seven color labels a user can tag a tab with (static classes for Tailwind). */
export const TAB_COLORS: { key: string; dot: string; ring: string }[] = [
  { key: "blue", dot: "bg-blue-500", ring: "ring-blue-500" },
  { key: "emerald", dot: "bg-emerald-500", ring: "ring-emerald-500" },
  { key: "amber", dot: "bg-amber-500", ring: "ring-amber-500" },
  { key: "violet", dot: "bg-violet-500", ring: "ring-violet-500" },
  { key: "rose", dot: "bg-rose-500", ring: "ring-rose-500" },
  { key: "cyan", dot: "bg-cyan-500", ring: "ring-cyan-500" },
  { key: "orange", dot: "bg-orange-500", ring: "ring-orange-500" },
];
const DOT_FOR = new Map(TAB_COLORS.map((c) => [c.key, c.dot]));

// useLayoutEffect on the client (to measure before paint), useEffect on the
// server — avoids the SSR warning. Stable per environment.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type Ctx = {
  tabs: Tab[];
  activeHref: string;
  /** Add a tab. `background: true` opens it without leaving the current page. */
  openTab: (href: string, opts?: { background?: boolean }) => void;
  close: (href: string) => void;
  /** Move the tab `from` to the position of the tab `to` (drag reorder). */
  reorder: (from: string, to: string) => void;
  /** href → color key (see TAB_COLORS); undefined = no label. */
  colors: Record<string, string>;
  /** Tag a tab with a color (null clears it). */
  setColor: (href: string, colorKey: string | null) => void;
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
  // Normalize away the trailing slash (trailingSlash: true) so a nav-added
  // "/branches/" and a ⌘-click-added "/branches" are the same tab.
  const activePath = tabKey(usePathname());
  const router = useRouter();
  // Only hrefs are stored (icons don't serialize); tabs are derived on render.
  const [hrefs, setHrefs] = React.useState<string[]>([]);
  const [colors, setColors] = React.useState<Record<string, string>>({});
  const [notice, setNotice] = React.useState<string | null>(null);
  const noticeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  // Latest active path for the (pure) reducer without re-creating callbacks.
  const activeRef = React.useRef(activePath);
  activeRef.current = activePath;
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
    stored = stored.map(tabKey);
    if (!stored.includes(activePath)) stored.push(activePath);
    while (stored.length > MAX_TABS) {
      const i = stored.findIndex((h) => h !== activePath);
      if (i === -1) break;
      stored.splice(i, 1);
    }
    setHrefs(stored);
    try {
      setColors(JSON.parse(sessionStorage.getItem(COLORS_KEY) || "{}"));
    } catch {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist color labels.
  React.useEffect(() => {
    try {
      sessionStorage.setItem(COLORS_KEY, JSON.stringify(colors));
    } catch {
      // ignore storage failures
    }
  }, [colors]);

  // Add the current route as a tab when navigating.
  React.useEffect(() => {
    setHrefs((prev) => capAdd(prev, activePath));
  }, [activePath, capAdd]);

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
      const clean = tabKey(href);
      setHrefs((prev) => capAdd(prev, clean));
      // Foreground open switches to it; background just parks it in the strip.
      if (!opts?.background) router.push(href);
    },
    [router, capAdd],
  );

  const close = React.useCallback(
    (href: string) => {
      const key = tabKey(href);
      const idx = hrefs.indexOf(key);
      const next = hrefs.filter((h) => h !== key);
      setHrefs(next.length ? next : ["/dashboard"]);
      // If the active tab closed, fall back to its neighbour.
      if (key === activePath) {
        const target = next[idx - 1] ?? next[idx] ?? "/dashboard";
        router.push(target);
      }
    },
    [hrefs, activePath, router],
  );

  const reorder = React.useCallback((from: string, to: string) => {
    const a = tabKey(from);
    const b = tabKey(to);
    if (a === b) return;
    setHrefs((prev) => {
      const fromIdx = prev.indexOf(a);
      const toIdx = prev.indexOf(b);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      next.splice(fromIdx, 1); // remove dragged tab
      // Insert AFTER the target when moving right, BEFORE when moving left, so
      // a rightward drag can actually pass the target (incl. reaching the end).
      const at = next.indexOf(b) + (fromIdx < toIdx ? 1 : 0);
      next.splice(at, 0, a);
      return next;
    });
  }, []);

  const setColor = React.useCallback((href: string, colorKey: string | null) => {
    const key = tabKey(href);
    setColors((prev) => {
      const next = { ...prev };
      if (colorKey) next[key] = colorKey;
      else delete next[key];
      return next;
    });
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({
      tabs: hrefs.map(tabMeta),
      activeHref: activePath,
      openTab,
      close,
      reorder,
      colors,
      setColor,
      notice,
    }),
    [hrefs, activePath, openTab, close, reorder, colors, setColor, notice],
  );

  return (
    <OpenTabsContext.Provider value={value}>
      {children}
    </OpenTabsContext.Provider>
  );
}

/** The tab strip — render it directly under the top bar. Tabs can be dragged to
 *  reorder and right-clicked to tag with one of seven color labels. */
export function TabStrip() {
  const { tabs, activeHref, close, reorder, colors, setColor, notice } =
    useOpenTabs();
  const router = useRouter();
  const dragHref = React.useRef<string | null>(null);
  const lastOver = React.useRef<string | null>(null);
  const tabEls = React.useRef(new Map<string, HTMLDivElement>());
  const prevRects = React.useRef(new Map<string, DOMRect>());
  const [menu, setMenu] = React.useState<{
    href: string;
    x: number;
    y: number;
  } | null>(null);

  React.useEffect(() => {
    if (!menu) return;
    const dismiss = () => setMenu(null);
    window.addEventListener("click", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      window.removeEventListener("click", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [menu]);

  // FLIP: when the tab order changes, slide each tab from its old position to
  // its new one so reordering animates smoothly instead of jumping.
  useIsoLayoutEffect(() => {
    const els = tabEls.current;
    els.forEach((el, href) => {
      const prev = prevRects.current.get(href);
      const rect = el.getBoundingClientRect();
      const dx = prev ? prev.left - rect.left : 0;
      if (dx) {
        el.style.transition = "none";
        el.style.transform = `translateX(${dx}px)`;
        requestAnimationFrame(() => {
          el.style.transition = "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
          el.style.transform = "";
        });
      }
      prevRects.current.set(href, rect);
    });
    for (const h of [...prevRects.current.keys()])
      if (!els.has(h)) prevRects.current.delete(h);
  });

  if (tabs.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Open pages"
      className="flex h-9 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-background px-3"
    >
      <span className="mr-1 shrink-0 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
        Tabs
      </span>
      {tabs.map((t) => {
        const active = t.href === activeHref;
        const Icon = t.icon;
        const colorKey = colors[t.href];
        const dot = colorKey ? DOT_FOR.get(colorKey) : null;
        return (
          <div
            key={t.href}
            ref={(el) => {
              if (el) tabEls.current.set(t.href, el);
              else tabEls.current.delete(t.href);
            }}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            draggable
            onDragStart={() => {
              dragHref.current = t.href;
              lastOver.current = t.href;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              // Reorder live as you drag past a tab (FLIP animates the shift).
              const d = dragHref.current;
              if (d && d !== t.href && lastOver.current !== t.href) {
                lastOver.current = t.href;
                reorder(d, t.href);
              }
            }}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={() => {
              dragHref.current = null;
              lastOver.current = null;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu({ href: t.href, x: e.clientX, y: e.clientY });
            }}
            title="Drag to reorder · right-click to color"
            className="group flex h-8 shrink-0 cursor-grab items-center gap-0.5 active:cursor-grabbing"
          >
            {/* Grip — separate from the pill, constant muted color; the drag cue. */}
            <DragHandleDots2Icon
              aria-hidden="true"
              className="size-3.5 shrink-0 text-muted-foreground/50"
            />
            {/* Pill — the active/color background lives here (dot + icon + close). */}
            <div
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-md pl-2 pr-1.5 text-sm transition-colors",
                active
                  ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)]"
                  : "text-muted-foreground group-hover:bg-accent/50",
              )}
            >
              {dot && (
                <span
                  aria-hidden="true"
                  className={cn("size-2 shrink-0 rounded-full", dot)}
                />
              )}
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

      {menu &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            aria-label="Tab color"
            style={{ position: "fixed", top: menu.y + 4, left: menu.x }}
            className="vui-pop-in z-[200] flex items-center gap-1.5 rounded-md border border-border bg-popover p-1.5 shadow-md"
          >
            {TAB_COLORS.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-label={c.key}
                title={c.key}
                onClick={() => {
                  setColor(menu.href, c.key);
                  setMenu(null);
                }}
                className={cn(
                  "size-4 rounded-full ring-offset-1 transition-transform hover:scale-110",
                  c.dot,
                  colors[menu.href] === c.key && cn("ring-2", c.ring),
                )}
              />
            ))}
            <button
              type="button"
              aria-label="No color"
              title="No color"
              onClick={() => {
                setColor(menu.href, null);
                setMenu(null);
              }}
              className="grid size-4 place-items-center rounded-full border border-border text-muted-foreground hover:bg-accent"
            >
              <Cross2Icon className="size-2.5" />
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * Keep-alive outlet — renders the content of every OPEN tab and shows only the
 * active one (the rest are `hidden`), so switching tabs is instant with no
 * remount or flash and each page keeps its live state. It works by caching the
 * active route's element per pathname; inactive routes keep rendering their
 * last element (same component type + key → React preserves the instance). New
 * routes mount on first visit; closed tabs are pruned (bounded by MAX_TABS).
 *
 * Because it renders app pages itself, they are no longer re-created by the file
 * router on navigation — fine here: the app is a static export (all client at
 * runtime, no SSR/SEO to lose).
 */
export function KeepAliveTabs({ children }: { children: React.ReactNode }) {
  const active = tabKey(usePathname());
  const { tabs } = useOpenTabs();
  const cache = React.useRef(new Map<string, React.ReactNode>());
  // Refresh the active route's element (so re-opening an /edit tab with a
  // different record shows the right data); inactive tabs keep their cached
  // element and stay mounted. In-progress form work survives via RecordForm's
  // sessionStorage draft (see persistKey), which is StrictMode-safe.
  cache.current.set(active, children);
  // Drop entries for tabs that have been closed.
  const open = new Set(tabs.map((t) => t.href));
  for (const key of [...cache.current.keys()]) {
    if (key !== active && !open.has(key)) cache.current.delete(key);
  }
  return (
    <>
      {[...cache.current.entries()].map(([href, node]) => (
        <div
          key={href}
          data-tab={href}
          hidden={href !== active}
          className={href === active ? "flex min-h-0 flex-1 flex-col" : undefined}
        >
          {node}
        </div>
      ))}
    </>
  );
}
