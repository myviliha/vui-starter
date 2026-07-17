"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LightningBoltIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { isGroup, NAV, type IconType } from "./nav-config";

/**
 * Quick actions — a ⌘K command palette launched from the sidebar. Search across
 * every destination in the app and jump to it by keyboard or click. Built from
 * the same NAV config the sidebar uses, so new pages appear here automatically.
 */

type Action = {
  label: string;
  href: string;
  icon: IconType;
  color?: string;
  group: string;
};

/** All navigable destinations, flattened from NAV and tagged with the section
 *  (or parent group) they belong to. */
const ACTIONS: Action[] = (() => {
  const out: Action[] = [];
  for (const section of NAV) {
    const group = section.title ?? "General";
    for (const entry of section.items) {
      if (isGroup(entry)) {
        for (const child of entry.children) out.push({ ...child, group: entry.label });
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

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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

  const value = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <QuickActionsContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onClose={() => setOpen(false)} />
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
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            ⌘K
          </kbd>
        </>
      )}
    </button>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // On open: reset, focus the search, and close on an outside click.
  React.useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    inputRef.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ACTIONS;
    return ACTIONS.filter(
      (a) =>
        a.label.toLowerCase().includes(term) ||
        a.group.toLowerCase().includes(term),
    );
  }, [q]);

  // Group filtered results while preserving order.
  const groups = React.useMemo(() => {
    const map = new Map<string, Action[]>();
    for (const a of results) {
      const list = map.get(a.group);
      if (list) list.push(a);
      else map.set(a.group, [a]);
    }
    return [...map.entries()];
  }, [results]);

  // Clamp the highlight if the result set shrank.
  React.useEffect(() => {
    setActive((i) => (i >= results.length ? Math.max(results.length - 1, 0) : i));
  }, [results.length]);

  // Keep the highlighted row scrolled into view.
  React.useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const run = React.useCallback(
    (a: Action) => {
      onClose();
      router.push(a.href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = results[active];
      if (a) run(a);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  let flatIndex = -1;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[12vh]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quick actions"
        className="vui-pop-in flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
        style={{ "--vui-pop-origin": "top center" } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-3">
          <MagnifyingGlassIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search for a page or action…"
            aria-label="Search actions"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No actions found for “{q}”.
            </p>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-1 last:mb-0">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  {group}
                </p>
                {items.map((a) => {
                  flatIndex += 1;
                  const idx = flatIndex;
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.href}
                      type="button"
                      data-active={idx === active}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => run(a)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Icon
                        className={cn("size-4 shrink-0", a.color ?? "text-muted-foreground")}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate">{a.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
