"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CaretSortIcon as ChevronsUpDown,
  ChevronRightIcon as ChevronRight,
  Cross2Icon as X,
  GearIcon as Settings,
  HamburgerMenuIcon as Menu,
  HomeIcon as Home,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/seo";
import { Menu as MenuPanel } from "@viliha/vui-ui/menu";
import { Logo } from "./logo";
import { QuickActionsLauncher } from "./quick-actions";
import { useOpenTabs } from "./open-tabs";
import {
  isGroup,
  NAV,
  type IconType,
  type NavEntry,
  type NavLink,
} from "./nav-config";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** How a collapsed-rail group with sub-items reveals its children. Set via
 *  `NEXT_PUBLIC_SIDEBAR_GROUP_MODE` (build-time) — see .env.example. */
type CollapsedGroupMode = "inline" | "flyout-click" | "flyout-hover";
const COLLAPSED_GROUP_MODES: readonly CollapsedGroupMode[] = [
  "inline",
  "flyout-click",
  "flyout-hover",
];
function readCollapsedGroupMode(): CollapsedGroupMode {
  const raw = process.env.NEXT_PUBLIC_SIDEBAR_GROUP_MODE;
  return (COLLAPSED_GROUP_MODES as readonly string[]).includes(raw ?? "")
    ? (raw as CollapsedGroupMode)
    : "flyout-hover";
}
const GROUP_MODE = readCollapsedGroupMode();
/** Delay before a hover-flyout closes, so the cursor can travel diagonally
 *  from the trigger into the panel without it disappearing mid-move. */
const FLYOUT_HOVER_CLOSE_DELAY_MS = 150;

/** Nav glyph. All icons share one size for a consistent left-aligned column.
    Top-level icons are bordered chips (from the global icon rule): inactive keep
    their brand color, active inverts (dark fill, light glyph). Sub-menu icons are
    `plain` — no chip, muted — so nesting reads without any indentation. */
function NavIcon({
  icon: Icon,
  active,
  color,
  plain,
}: {
  icon: IconType;
  active: boolean;
  color?: string;
  plain?: boolean;
}) {
  if (plain)
    return (
      <Icon
        className={cn(
          // keep the 2px chip padding (transparent border) so plain glyphs sit
          // on the same baseline/box as bordered ones — only the border is gone.
          "size-[18px] shrink-0 border-transparent bg-transparent transition-colors",
          active ? "text-sidebar-foreground" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
    );
  return (
    <Icon
      className={cn(
        "size-[18px] shrink-0 transition-colors",
        active
          ? "border-sidebar-foreground bg-sidebar-foreground text-background"
          : cn("bg-background", color ?? "text-muted-foreground"),
      )}
      aria-hidden="true"
    />
  );
}

/** Shared sidebar contents used by both the desktop aside and the mobile drawer. */
function SidebarBody({
  onNavigate,
  collapsed = false,
  headerAction,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  /** Rendered at the right of the workspace row (e.g. the collapse toggle). */
  headerAction?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(() => {
    const open = new Set<string>();
    for (const section of NAV) {
      for (const entry of section.items) {
        if (
          isGroup(entry) &&
          entry.children.some((c) => isActive(pathname, c.href))
        ) {
          open.add(entry.label);
        }
      }
    }
    return open;
  });
  const usesFlyout = collapsed && GROUP_MODE !== "inline";

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => {
      // Flyout modes show one group at a time (menu-style); inline mode lets
      // several collapsed groups stay expanded at once, like the expanded rail.
      if (usesFlyout) return prev.has(label) ? new Set() : new Set([label]);
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  // flyout-hover: open on enter, close on leave after a short delay so the
  // cursor can travel from the trigger into the panel. A pending close is
  // cancelled if the pointer re-enters the trigger or the panel first.
  const hoverCloseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelHoverClose = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };
  const scheduleHoverClose = () => {
    cancelHoverClose();
    hoverCloseTimer.current = setTimeout(() => {
      setOpenGroups(new Set());
    }, FLYOUT_HOVER_CLOSE_DELAY_MS);
  };
  const openGroupOnHover = (label: string) => {
    cancelHoverClose();
    setOpenGroups(new Set([label]));
  };
  React.useEffect(() => () => cancelHoverClose(), []);

  // Flyout modes: the open group's panel renders `position: fixed` at a rect
  // computed from its trigger button, so it escapes the nav's
  // `overflow-y-auto` clipping instead of being cut off at the rail edge.
  const navRef = React.useRef<HTMLElement | null>(null);
  const flyoutRef = React.useRef<HTMLDivElement | null>(null);
  const groupButtonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [flyoutPos, setFlyoutPos] = React.useState<{ top: number; left: number } | null>(null);
  const openGroupLabel = usesFlyout ? Array.from(openGroups)[0] : undefined;

  React.useLayoutEffect(() => {
    if (!openGroupLabel) {
      setFlyoutPos(null);
      return;
    }
    const btn = groupButtonRefs.current.get(openGroupLabel);
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 4 });
  }, [openGroupLabel]);

  // Clamp the panel to the viewport once its real height is known — a group
  // near the bottom of the rail would otherwise render partly (or fully)
  // below the fold and be invisible.
  React.useLayoutEffect(() => {
    if (!flyoutPos || !flyoutRef.current) return;
    const margin = 8;
    const rect = flyoutRef.current.getBoundingClientRect();
    const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
    if (rect.top > maxTop) {
      setFlyoutPos((prev) => (prev ? { ...prev, top: maxTop } : prev));
    }
  }, [flyoutPos]);

  React.useEffect(() => {
    if (!openGroupLabel) return;
    const close = () => setOpenGroups(new Set());
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (navRef.current?.contains(target)) return;
      if (flyoutRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
    };
  }, [openGroupLabel]);

  const openGroupEntry = React.useMemo(() => {
    if (!openGroupLabel) return undefined;
    for (const section of NAV) {
      for (const entry of section.items) {
        if (isGroup(entry) && entry.label === openGroupLabel) return entry;
      }
    }
    return undefined;
  }, [openGroupLabel]);

  const { openTab } = useOpenTabs();

  const renderLink = (item: NavLink, sub = false, inFlyout = false) => {
    const active = isActive(pathname, item.href);
    const onClick = (e: React.MouseEvent) => {
      // ⌘/Ctrl+click → open in a background tab (stay on the current page),
      // the same gesture as a browser. Plain click navigates as usual.
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        openTab(item.href, { background: true });
        return;
      }
      setOpenGroups((prev) => (collapsed && prev.size ? new Set() : prev));
      onNavigate?.();
    };
    const showLabel = inFlyout || !collapsed;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        title={collapsed && !inFlyout ? `${item.label} — ⌘-click for a new tab` : undefined}
        className={cn(
          "group/nav flex h-9 items-center rounded-md transition-colors",
          collapsed && !inFlyout ? "w-9 justify-center px-0" : "gap-2.5 px-2",
          active
            ? "bg-sidebar-accent text-sidebar-foreground"
            : cn(
                "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                sub && !inFlyout ? "text-muted-foreground" : "text-sidebar-foreground",
              ),
        )}
      >
        <NavIcon icon={item.icon} active={active} color={item.color} plain={sub && !inFlyout} />
        {showLabel && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const renderEntry = (entry: NavEntry) => {
    if (!isGroup(entry)) return renderLink(entry);

    const open = openGroups.has(entry.label);
    const anyActive = entry.children.some((c) => isActive(pathname, c.href));
    const GroupIcon = entry.icon;

    // Collapsed rail — inline mode: the icon plus a small corner chevron
    // badge (not inline beside it, so it never overflows the icon's own box);
    // children reveal indented underneath when toggled open.
    if (collapsed && GROUP_MODE === "inline")
      return (
        <div key={entry.label} className="space-y-1">
          <button
            type="button"
            onClick={() => toggleGroup(entry.label)}
            aria-expanded={open}
            title={entry.label}
            className={cn(
              "group/nav relative flex size-9 items-center justify-center rounded-md transition-colors",
              anyActive ? "text-sidebar-foreground" : "hover:bg-sidebar-accent",
            )}
          >
            <NavIcon icon={GroupIcon} active={anyActive} color={entry.color} />
            <ChevronRight
              className={cn(
                "absolute right-0.5 top-1/2 size-2.5 shrink-0 -translate-y-1/2 text-muted-foreground transition-transform",
                open && "rotate-90",
              )}
              aria-hidden="true"
            />
          </button>
          {open && (
            <div className="space-y-1">
              {entry.children.map((child) => renderLink(child, true))}
            </div>
          )}
        </div>
      );

    // Collapsed rail — flyout modes: the icon alone represents the group
    // (matching the leaf icons around it, no overlapping chevron); opening
    // its children panel (rendered separately, fixed-positioned) is either
    // click- or hover-triggered depending on GROUP_MODE.
    if (collapsed)
      return (
        <button
          key={entry.label}
          ref={(el) => {
            if (el) groupButtonRefs.current.set(entry.label, el);
            else groupButtonRefs.current.delete(entry.label);
          }}
          type="button"
          onClick={() => toggleGroup(entry.label)}
          onMouseEnter={
            GROUP_MODE === "flyout-hover" ? () => openGroupOnHover(entry.label) : undefined
          }
          onMouseLeave={GROUP_MODE === "flyout-hover" ? scheduleHoverClose : undefined}
          aria-expanded={open}
          aria-haspopup="menu"
          title={entry.label}
          className={cn(
            "group/nav flex size-9 items-center justify-center rounded-md transition-colors",
            open && "bg-sidebar-accent",
            anyActive ? "text-sidebar-foreground" : "hover:bg-sidebar-accent",
          )}
        >
          <NavIcon icon={GroupIcon} active={anyActive} color={entry.color} />
        </button>
      );

    return (
      <div key={entry.label} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleGroup(entry.label)}
          aria-expanded={open}
          className={cn(
            "group/nav flex h-9 w-full items-center gap-2.5 rounded-md px-2 transition-colors",
            anyActive
              ? "text-sidebar-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent",
          )}
        >
          <NavIcon icon={GroupIcon} active={anyActive} color={entry.color} />
          <span className="flex-1 truncate text-left">{entry.label}</span>
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-90",
            )}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="space-y-1">
            {entry.children.map((child) => renderLink(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Workspace switcher + collapse toggle (same row) — header */}
      <div className="flex h-12 items-center gap-1 border-b border-sidebar-border bg-background px-3">
        <button
          type="button"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent",
            collapsed ? "w-9 shrink-0 justify-center px-0" : "flex-1",
          )}
          aria-label="Switch workspace"
          title={collapsed ? SITE.name : undefined}
        >
          <Logo variant="mark" className="h-6 w-6 shrink-0" />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight text-foreground">
                {SITE.name}
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
        {!collapsed && headerAction}
      </div>

      {/* Quick actions — fixed above the scrolling nav, with a full-width
          divider and comfortable top/bottom padding. */}
      <div className="border-b border-sidebar-border px-3 py-3">
        <QuickActionsLauncher collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {NAV.map((section, index) => (
          <React.Fragment key={section.title ?? `section-${index}`}>
            {/* Collapsed group separator — a nav-level sibling so the nav's
                space-y rhythm spaces it equally above and below. */}
            {section.title && collapsed && index > 0 && (
              <div
                className="mx-2 border-t border-sidebar-border"
                aria-hidden="true"
              />
            )}
            <div className="space-y-1">
              {section.title && !collapsed && (
                <p className="px-2 pb-1 text-sm font-medium text-muted-foreground">
                  {section.title}
                </p>
              )}
              {section.items.map(renderEntry)}
            </div>
          </React.Fragment>
        ))}
      </nav>

      {/* Collapsed-group flyout: fixed-positioned beside its trigger so it
          escapes the nav's overflow-y-auto clipping instead of the old
          inline-expand, which overflowed the rail and clipped the chevron. */}
      {openGroupEntry && flyoutPos && (
        <div
          ref={flyoutRef}
          style={{ top: flyoutPos.top, left: flyoutPos.left }}
          onMouseEnter={GROUP_MODE === "flyout-hover" ? cancelHoverClose : undefined}
          onMouseLeave={GROUP_MODE === "flyout-hover" ? scheduleHoverClose : undefined}
          className="fixed z-50 min-w-44"
        >
          <MenuPanel
            tabIndex={-1}
            className="space-y-0.5 border-sidebar-border bg-sidebar p-1 shadow-lg"
          >
            <p className="truncate px-2 pb-1 pt-1 text-xs font-medium text-muted-foreground">
              {openGroupEntry.label}
            </p>
            {openGroupEntry.children.map((child) => renderLink(child, false, true))}
          </MenuPanel>
        </div>
      )}
    </>
  );
}

const SIDEBAR_MIN_W = 200;
const SIDEBAR_MAX_W = 420;
const SIDEBAR_DEFAULT_W = 240;
const SIDEBAR_COLLAPSED_W = 60;
const SIDEBAR_WIDTH_KEY = "sidebar:width";
const SIDEBAR_COLLAPSED_KEY = "sidebar:collapsed";

type SidebarContextValue = {
  collapsed: boolean;
  width: number;
  resizing: boolean;
  toggleCollapsed: () => void;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setResizing: React.Dispatch<React.SetStateAction<boolean>>;
  persist: (w: number, c: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

/**
 * Shares the sidebar's collapsed/width state so both the sidebar and the page
 * header can read + toggle it (ui-system puts the expand toggle in the page
 * header once the rail is collapsed). Persists to localStorage.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = React.useState(SIDEBAR_DEFAULT_W);
  const [collapsed, setCollapsed] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);

  React.useEffect(() => {
    const savedWidth = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
    if (savedWidth >= SIDEBAR_MIN_W && savedWidth <= SIDEBAR_MAX_W) {
      setWidth(savedWidth);
    }
    setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
  }, []);

  const persist = React.useCallback((w: number, c: boolean) => {
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(w));
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(c));
    } catch {
      // storage unavailable — non-fatal
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    persist(width, next);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        width,
        resizing,
        toggleCollapsed,
        setWidth,
        setResizing,
        persist,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Desktop-only (≥ md) left sidebar, matching ui-system: the collapse toggle sits
 * inline with the workspace title; drag the right edge to resize its width.
 */
export function AppSidebar() {
  const { collapsed, width, resizing, setWidth, setResizing, persist } =
    useSidebar();

  function startResize(e: React.MouseEvent) {
    if (collapsed) return;
    e.preventDefault();
    setResizing(true);
    const startX = e.clientX;
    const startW = width;
    const clamp = (dx: number) =>
      Math.min(SIDEBAR_MAX_W, Math.max(SIDEBAR_MIN_W, startW + dx));
    const onMove = (ev: MouseEvent) => setWidth(clamp(ev.clientX - startX));
    const onUp = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      setResizing(false);
      persist(clamp(ev.clientX - startX), collapsed);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  }

  return (
    <aside
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_W : width }}
      className={cn(
        "relative hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
        !resizing && "transition-[width] duration-200 ease-out",
      )}
    >
      <SidebarBody collapsed={collapsed} />

      {/* Resize handle (right edge) */}
      {!collapsed && (
        <button
          type="button"
          aria-label="Resize sidebar"
          title="Drag to resize"
          onMouseDown={startResize}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setWidth((w) => {
                const n = Math.max(SIDEBAR_MIN_W, w - 16);
                persist(n, collapsed);
                return n;
              });
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setWidth((w) => {
                const n = Math.min(SIDEBAR_MAX_W, w + 16);
                persist(n, collapsed);
                return n;
              });
            }
          }}
          className={cn(
            "absolute inset-y-0 -right-1 z-10 w-2 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-primary/40 focus-visible:bg-primary/60 focus-visible:outline-none",
            resizing && "bg-primary/50",
          )}
        />
      )}
    </aside>
  );
}

/**
 * Global sidebar collapse/expand toggle. Lives in the top bar so it's always
 * available regardless of page or collapsed state (desktop only).
 */
export function SidebarToggle() {
  const { collapsed, toggleCollapsed } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="hidden size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:grid"
    >
      <Menu className="size-5" aria-hidden="true" />
    </button>
  );
}

/** @deprecated Use the SidebarToggle in the top bar. Kept as a no-op shim. */
export function SidebarExpandButton() {
  return null;
}

const BOTTOM_BAR_ITEMS: NavLink[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Mobile navigation (< md), matching ui-system: a fixed bottom bar whose
 * "Menu" button toggles a full-width (100vw) slide-in drawer. Drawer closes on
 * navigation, the Menu toggle, Escape, or the in-drawer close button.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const close = React.useCallback(() => setOpen(false), []);

  // Close the drawer whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + Escape-to-close while the drawer is open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Full-width slide-in drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 flex w-full flex-col bg-sidebar pb-14 transition-transform duration-200 ease-out md:hidden",
          open ? "translate-x-0" : "pointer-events-none -translate-x-full",
        )}
      >
        <SidebarBody
          onNavigate={close}
          headerAction={
            <button
              type="button"
              onClick={close}
              aria-label="Close navigation"
              className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
          }
        />
      </div>

      {/* Fixed bottom navigation bar */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-sidebar-border bg-sidebar md:hidden"
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          aria-label="Menu"
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
            open
              ? "text-sidebar-accent-foreground"
              : "text-muted-foreground hover:text-sidebar-accent-foreground",
          )}
        >
          <Menu className="size-5" aria-hidden="true" />
          Menu
        </button>
        {BOTTOM_BAR_ITEMS.map((item) => {
          const active = !open && isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
                active
                  ? "text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
