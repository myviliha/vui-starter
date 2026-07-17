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
import { Logo } from "./logo";
import { Wordmark } from "./wordmark";
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

/** Nav glyph. Border/padding come from the global icon chip rule. Inactive icons
    keep their brand color; active inverts (dark fill, light glyph); nested
    (sub-menu) icons are smaller so the hierarchy reads even when collapsed. */
function NavIcon({
  icon: Icon,
  active,
  color,
  nested,
}: {
  icon: IconType;
  active: boolean;
  color?: string;
  nested?: boolean;
}) {
  return (
    <Icon
      className={cn(
        "shrink-0 transition-colors",
        nested ? "size-4" : "size-[18px]",
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
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const renderLink = (item: NavLink, nested = false) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group/nav flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
          collapsed && "justify-center px-0",
          nested && !collapsed && "gap-2.5 py-1.5",
          active
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent",
        )}
      >
        <NavIcon
          icon={item.icon}
          active={active}
          color={item.color}
          nested={nested}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const renderEntry = (entry: NavEntry) => {
    if (!isGroup(entry)) return renderLink(entry);

    const open = openGroups.has(entry.label);
    const anyActive = entry.children.some((c) => isActive(pathname, c.href));
    const GroupIcon = entry.icon;

    // Collapsed rail: show the PARENT icon with an expand chevron beside it;
    // its children reveal inline (indented, smaller) when toggled open.
    if (collapsed)
      return (
        <div key={entry.label} className="space-y-1">
          <button
            type="button"
            onClick={() => toggleGroup(entry.label)}
            aria-expanded={open}
            title={entry.label}
            className={cn(
              "group/nav flex w-full items-center justify-center gap-0.5 rounded-md py-1.5 transition-colors",
              anyActive
                ? "text-sidebar-foreground"
                : "hover:bg-sidebar-accent",
            )}
          >
            <NavIcon icon={GroupIcon} active={anyActive} color={entry.color} />
            <ChevronRight
              className={cn(
                "size-3 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-90",
              )}
              aria-hidden="true"
            />
          </button>
          {open && (
            <div className="ml-3 space-y-1 border-l border-sidebar-border pl-1">
              {entry.children.map((child) => renderLink(child, true))}
            </div>
          )}
        </div>
      );

    return (
      <div key={entry.label} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleGroup(entry.label)}
          aria-expanded={open}
          className={cn(
            "group/nav flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
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
          <div className="ml-[1.15rem] space-y-1 border-l border-sidebar-border pl-2">
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
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center px-0",
          )}
          aria-label="Switch workspace"
          title={collapsed ? "Vui Starter" : undefined}
        >
          <Logo variant="mark" className="h-6 w-6 shrink-0" />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight text-foreground">
                Vui Starter
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
        {!collapsed && headerAction}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-2">
        {NAV.map((section, index) => (
          <div key={section.title ?? `section-${index}`} className="space-y-1">
            {section.title && !collapsed && (
              <p className="px-2 pb-1 text-sm font-medium text-muted-foreground">
                {section.title}
              </p>
            )}
            {section.title && collapsed && index > 0 && (
              <div className="mx-2 my-2 border-t border-sidebar-border" />
            )}
            {section.items.map(renderEntry)}
          </div>
        ))}
      </nav>

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
      className="hidden size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:grid"
    >
      <Menu className="size-4" aria-hidden="true" />
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
        <div className="flex items-center justify-between px-3 pt-3">
          <Wordmark />
          <button
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent"
          >
            <X className="size-4" />
          </button>
        </div>
        <SidebarBody onNavigate={close} />
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
