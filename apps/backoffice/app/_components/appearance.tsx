"use client";

// Appearance: how the shell is arranged, as opposed to what colour it is.
//
// Three choices, each one attribute on <html> so CSS does the work and nothing
// re-renders to change layout:
//
//   data-sidebar="inset|floating|plain"   how the sidebar meets the content
//   data-density="default|compact|full"   spacing and type scale
//   dir="ltr|rtl"                         reading direction
//
// Colours are not here. Those are tokens and live in ThemeConfigProvider, so a
// tenant's brand and a person's layout preference stay independent.

import * as React from "react";

export const SIDEBAR_VARIANTS = [
  { id: "inset", label: "Inset", hint: "Content sits in a rounded panel with a gap around it." },
  { id: "floating", label: "Floating", hint: "The sidebar detaches and floats over the background." },
  { id: "plain", label: "Sidebar", hint: "Flush to the edge, sharing one border with the content." },
] as const;

export const DENSITIES = [
  { id: "default", label: "Default", hint: "The spacing the design system ships." },
  { id: "compact", label: "Compact", hint: "Tighter padding and slightly smaller type, for dense data." },
  { id: "full", label: "Full layout", hint: "Edge to edge, with the sidebar collapsed to icons." },
] as const;

export const DIRECTIONS = [
  { id: "ltr", label: "Left to Right", hint: "English, and most European languages." },
  { id: "rtl", label: "Right to Left", hint: "Arabic, Hebrew, Persian, Urdu." },
] as const;

export type SidebarVariant = (typeof SIDEBAR_VARIANTS)[number]["id"];
export type Density = (typeof DENSITIES)[number]["id"];
export type Direction = (typeof DIRECTIONS)[number]["id"];

export type Appearance = {
  sidebar: SidebarVariant;
  density: Density;
  direction: Direction;
};

const DEFAULTS: Appearance = {
  sidebar: "inset",
  density: "default",
  direction: "ltr",
};

const KEY = "vui.appearance";

type Ctx = Appearance & { set: <K extends keyof Appearance>(key: K, value: Appearance[K]) => void };

const AppearanceContext = React.createContext<Ctx | null>(null);

function apply(value: Appearance) {
  const root = document.documentElement;
  root.dataset.sidebar = value.sidebar;
  root.dataset.density = value.density;
  root.dir = value.direction;
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = React.useState<Appearance>(DEFAULTS);

  // Read the stored choice after mount. Server and first client render agree on
  // the defaults, so there is no hydration mismatch; the switch is one frame.
  React.useEffect(() => {
    let stored: Appearance | null = null;
    try {
      stored = JSON.parse(localStorage.getItem(KEY) ?? "null") as Appearance | null;
    } catch {
      // storage unavailable or corrupt — defaults are fine
    }
    const next = { ...DEFAULTS, ...(stored ?? {}) };
    setValue(next);
    apply(next);
  }, []);

  const set = React.useCallback<Ctx["set"]>((key, next) => {
    setValue((prev) => {
      const merged = { ...prev, [key]: next };
      apply(merged);
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        // storage unavailable (private mode) — in-memory only
      }
      return merged;
    });
  }, []);

  return (
    <AppearanceContext.Provider value={{ ...value, set }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): Ctx {
  const ctx = React.useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used inside AppearanceProvider");
  return ctx;
}
