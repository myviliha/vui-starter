"use client";

import * as React from "react";

import { cn } from "@viliha/vui-ui/utils";
import { CopyButton } from "@/components/copy-button";

/**
 * A code block with tabs, where the choice is shared by every block on the page
 * and remembered between visits. Used for package managers and for frameworks;
 * pass a different `storageKey` per dimension so the two do not fight.
 */
export function CodeTabs<T extends string>({
  options,
  labels,
  blocks,
  storageKey,
  ariaLabel,
  language,
}: {
  options: readonly T[];
  /** Optional display text per option; the option itself is used when absent. */
  labels?: Partial<Record<T, string>>;
  /** Omit an option to hide its tab on this block. */
  blocks: Partial<Record<T, string>>;
  storageKey: string;
  ariaLabel: string;
  /** Tabs render in monospace by default, which suits commands more than names. */
  language?: "mono" | "sans";
}) {
  const selected = useTabChoice(storageKey, options);
  const available = options.filter((o) => blocks[o] != null);
  const active = blocks[selected] != null ? selected : (available[0] ?? options[0]!);
  const code = blocks[active] ?? "";

  return (
    <div className="mb-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 pr-2">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="vui-scroll flex overflow-x-auto"
        >
          {available.map((o) => {
            const on = o === active;
            return (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTabChoice(storageKey, o)}
                className={cn(
                  "-mb-px shrink-0 border-b-2 px-3 py-2 text-[12px] whitespace-nowrap transition-colors",
                  language === "sans" ? "font-medium" : "font-mono",
                  on
                    ? "border-[var(--button-primary)] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {labels?.[o] ?? o}
              </button>
            );
          })}
        </div>
        <CopyButton text={code} className="shrink-0" />
      </div>
      <pre className="vui-scroll overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// One store per storageKey, so package-manager tabs and framework tabs stay
// independent while every block sharing a key switches together.
type Store = { value: string; subs: Set<() => void> };
const stores = new Map<string, Store>();

function storeFor(key: string, fallback: string): Store {
  let s = stores.get(key);
  if (!s) {
    s = { value: fallback, subs: new Set() };
    stores.set(key, s);
  }
  return s;
}

function setTabChoice(key: string, value: string) {
  const s = storeFor(key, value);
  s.value = value;
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — in-memory only
  }
  s.subs.forEach((f) => f());
}

function useTabChoice<T extends string>(key: string, options: readonly T[]): T {
  const fallback = options[0]!;
  const s = storeFor(key, fallback);
  const value = React.useSyncExternalStore(
    React.useCallback(
      (cb: () => void) => {
        s.subs.add(cb);
        return () => void s.subs.delete(cb);
      },
      [s],
    ),
    () => s.value,
    () => fallback as string,
  );
  React.useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(key);
    } catch {
      // storage unavailable — keep the default
    }
    if (saved && (options as readonly string[]).includes(saved)) setTabChoice(key, saved);
  }, [key, options]);
  return (options as readonly string[]).includes(value) ? (value as T) : fallback;
}
