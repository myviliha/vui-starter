"use client";

import * as React from "react";

import { cn } from "@viliha/vui-ui/utils";
import { CopyButton } from "@/components/copy-button";

const PMS = ["npm", "pnpm", "yarn", "bun"] as const;
type PM = (typeof PMS)[number];

// Small shared store so every command block on a page switches together and the
// choice persists across visits.
const KEY = "vui-docs-pm";
const store = {
  pm: "npm" as PM,
  subs: new Set<() => void>(),
  subscribe(cb: () => void) {
    store.subs.add(cb);
    return () => store.subs.delete(cb);
  },
  get: () => store.pm,
  set(p: PM) {
    store.pm = p;
    try {
      localStorage.setItem(KEY, p);
    } catch {
      // storage unavailable (private mode) — in-memory only
    }
    store.subs.forEach((f) => f());
  },
};

function usePM(): PM {
  const pm = React.useSyncExternalStore(
    store.subscribe,
    store.get,
    () => "npm" as PM,
  );
  React.useEffect(() => {
    const saved = localStorage.getItem(KEY) as PM | null;
    if (saved && PMS.includes(saved)) store.set(saved);
  }, []);
  return pm;
}

/**
 * A code block with npm / pnpm / yarn / bun tabs. Pass a command per manager;
 * omit any you do not support. The selected manager is shared across all blocks
 * on the page and remembered between visits.
 */
export function PackageManagerTabs({
  commands,
}: {
  commands: Partial<Record<PM, string>>;
}) {
  const selected = usePM();
  const available = PMS.filter((p) => commands[p] != null);
  const pm = commands[selected] != null ? selected : (available[0] ?? "npm");
  const code = commands[pm] ?? "";

  return (
    <div className="mb-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 pr-2">
        <div role="tablist" aria-label="Package manager" className="flex">
          {available.map((p) => {
            const active = p === pm;
            return (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => store.set(p)}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 font-mono text-[12px] transition-colors",
                  active
                    ? "border-[var(--button-primary)] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
        <CopyButton text={code} className="shrink-0" />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}
