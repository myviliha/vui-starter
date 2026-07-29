"use client";

import * as React from "react";

import { CHROME_DEFAULTS, type ChromeFeature } from "@/lib/app-config";

/**
 * Runtime override layer for the top-bar chrome flags. Starts from the
 * install-time defaults (`CHROME_DEFAULTS`) and merges a per-browser override
 * from localStorage, editable on the Settings page. Read the effective flags
 * with `useChrome()`; drive the Settings toggles with `useChromeConfig()`.
 */

type ChromeFlags = Record<ChromeFeature, boolean>;

const STORAGE_KEY = "vui.chrome";

type Ctx = {
  chrome: ChromeFlags;
  setFeature: (key: ChromeFeature, on: boolean) => void;
  reset: () => void;
};

const ChromeConfigContext = React.createContext<Ctx | null>(null);

export function ChromeConfigProvider({ children }: { children: React.ReactNode }) {
  // Start from defaults so the prerendered HTML and first client render match;
  // apply the stored override after mount. A feature the override hides flashes
  // once on load — accepted, to avoid a hydration mismatch on the whole shell.
  const [chrome, setChrome] = React.useState<ChromeFlags>(CHROME_DEFAULTS);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setChrome({ ...CHROME_DEFAULTS, ...(parsed as Partial<ChromeFlags>) });
      }
    } catch {
      // malformed or blocked storage — defaults stand
    }
  }, []);

  const setFeature = React.useCallback((key: ChromeFeature, on: boolean) => {
    setChrome((prev) => {
      const next = { ...prev, [key]: on };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable — non-fatal, the change stays in memory
      }
      return next;
    });
  }, []);

  const reset = React.useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    setChrome(CHROME_DEFAULTS);
  }, []);

  const value = React.useMemo(
    () => ({ chrome, setFeature, reset }),
    [chrome, setFeature, reset],
  );

  return (
    <ChromeConfigContext.Provider value={value}>
      {children}
    </ChromeConfigContext.Provider>
  );
}

export function useChromeConfig(): Ctx {
  const ctx = React.useContext(ChromeConfigContext);
  if (!ctx) {
    throw new Error(
      "useChromeConfig must be used within <ChromeConfigProvider>",
    );
  }
  return ctx;
}

/** Just the effective flags — for components that only render conditionally. */
export function useChrome(): ChromeFlags {
  return useChromeConfig().chrome;
}
