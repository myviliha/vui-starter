"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LightningBoltIcon } from "@radix-ui/react-icons";

import {
  CommandPalette,
  type CommandAction,
} from "@viliha/vui-ui/command-palette";
import { Shortcut } from "@viliha/vui-ui/kbd";
import { cn } from "@/lib/utils";
import { isGroup, NAV, type IconType } from "./nav-config";

/**
 * Quick actions — a ⌘K command palette launched from the sidebar. Wires the
 * app-specific bits (NAV destinations + Next router) into the generic
 * `CommandPalette` from @viliha/vui-ui, and exposes a launcher + global
 * shortcuts. New pages added to NAV appear here automatically.
 */

type NavEntryFlat = {
  label: string;
  href: string;
  icon: IconType;
  color?: string;
  group: string;
};

/** All navigable destinations, flattened from NAV and tagged with their group. */
const NAV_ENTRIES: NavEntryFlat[] = (() => {
  const out: NavEntryFlat[] = [];
  for (const section of NAV) {
    const group = section.title ?? "General";
    for (const entry of section.items) {
      if (isGroup(entry)) {
        for (const child of entry.children)
          out.push({ ...child, group: entry.label });
      } else {
        out.push({ ...entry, group });
      }
    }
  }
  return out;
})();

type Ctx = { open: () => void };
const QuickActionsContext = React.createContext<Ctx | null>(null);

export function useQuickActions(): Ctx {
  const ctx = React.useContext(QuickActionsContext);
  if (!ctx)
    throw new Error("useQuickActions must be used within <QuickActionsProvider>");
  return ctx;
}

function isEditableTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

/** Holds the open state, mounts the palette once, and wires the global
 *  ⌘K / "/" shortcuts. Wrap the app shell with this. */
export function QuickActionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K — but not ⌘⌥K, which is the global-search shortcut.
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.code === "KeyK") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !open && !isEditableTarget(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const actions = React.useMemo<CommandAction[]>(
    () =>
      NAV_ENTRIES.map((e) => ({
        id: e.href,
        label: e.label,
        group: e.group,
        icon: e.icon,
        iconClassName: e.color,
        onSelect: () => router.push(e.href),
      })),
    [router],
  );

  const value = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <QuickActionsContext.Provider value={value}>
      {children}
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        actions={actions}
        placeholder="Search for a page or action…"
      />
    </QuickActionsContext.Provider>
  );
}

/** Sidebar launcher — collapses to an icon-only button when the rail is narrow. */
export function QuickActionsLauncher({ collapsed = false }: { collapsed?: boolean }) {
  const { open } = useQuickActions();
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Quick actions"
      title="Quick actions (⌘K)"
      className={cn(
        "flex items-center gap-2 rounded-md border border-sidebar-border bg-background text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
        collapsed ? "size-9 justify-center px-0" : "w-full px-2.5 py-2",
      )}
    >
      <LightningBoltIcon className="size-4 shrink-0 text-amber-500" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium">Quick actions</span>
          <Shortcut keys={["⌘", "K"]} />
        </>
      )}
    </button>
  );
}
