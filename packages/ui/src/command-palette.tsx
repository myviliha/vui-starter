"use client";

import * as React from "react";

import { cn } from "./utils";
import { Kbd } from "./kbd";

/**
 * A generic ⌘K-style command palette. Fully controlled and headless of any
 * router — the host owns the open state, supplies the `actions`, and each
 * action carries its own `onSelect` (navigate, open a modal, run a command…).
 *
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <CommandPalette
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   actions={[
 *     { id: "home", label: "Home", group: "Go to", onSelect: () => router.push("/") },
 *   ]}
 * />
 * ```
 */
export type CommandAction = {
  /** Stable unique key. */
  id: string;
  label: string;
  /** Optional group heading; actions with the same group render together. */
  group?: string;
  /** Optional leading icon (anything that takes a `className`). */
  icon?: React.ComponentType<{ className?: string }>;
  /** Extra classes for the icon (e.g. a brand color). */
  iconClassName?: string;
  /** Extra text matched by the search, beyond `label` and `group`. */
  keywords?: string;
  /** Runs when the action is chosen (Enter or click). */
  onSelect: () => void;
};

export function CommandPalette({
  open,
  onClose,
  actions,
  placeholder = "Search…",
  emptyMessage,
}: {
  open: boolean;
  onClose: () => void;
  actions: CommandAction[];
  placeholder?: string;
  /** Message when the search matches nothing; `{q}` in the default is the query. */
  emptyMessage?: string;
}) {
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
    if (!term) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(term) ||
        a.group?.toLowerCase().includes(term) ||
        a.keywords?.toLowerCase().includes(term),
    );
  }, [q, actions]);

  // Group filtered results while preserving order.
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandAction[]>();
    for (const a of results) {
      const key = a.group ?? "";
      const list = map.get(key);
      if (list) list.push(a);
      else map.set(key, [a]);
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
    (a: CommandAction) => {
      onClose();
      a.onSelect();
    },
    [onClose],
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
        aria-label="Command palette"
        className="vui-pop-in flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
        style={{ "--vui-pop-origin": "top center" } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-3">
          <SearchGlyph />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Kbd className="shrink-0">Esc</Kbd>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {emptyMessage ?? `No results for “${q}”.`}
            </p>
          ) : (
            groups.map(([group, items]) => (
              <div key={group || "_"} className="mb-1 last:mb-0">
                {group && (
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    {group}
                  </p>
                )}
                {items.map((a) => {
                  flatIndex += 1;
                  const idx = flatIndex;
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      data-active={idx === active}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => run(a)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            a.iconClassName ?? "text-muted-foreground",
                          )}
                        />
                      )}
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

/** Inline magnifier so the palette carries no icon dependency. */
function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 15 15"
      aria-hidden="true"
      className="size-4 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="M9.5 9.5 L13 13" strokeLinecap="round" />
    </svg>
  );
}
