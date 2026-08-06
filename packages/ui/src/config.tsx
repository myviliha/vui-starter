"use client";

import * as React from "react";

/**
 * The theme's configuration spine.
 *
 * The preconfigured theme is itself a config: {@link vuiPreset} is a plain value
 * built from the same API you would use, and it is what the components fall back
 * to when nothing else is set. So there is no "configurable" variant of a
 * component sitting beside an opinionated one — every component reads resolved
 * config, and the shipped look is one particular resolution.
 *
 * Values resolve in this order, and a later layer only overrides the keys it
 * mentions:
 *
 * ```
 * package default  ←  vuiPreset  ←  <VuiProvider config>  ←  per-instance prop
 * ```
 *
 * A per-instance prop always wins, so a screen that genuinely needs something
 * different never has to fight the app config.
 *
 * ```tsx
 * // Out of the box: nothing to write. The preset is the default.
 * <RecordView … />
 *
 * // Change part of it for the whole app.
 * <VuiProvider config={{ form: { actions: (d) => [...d, saveAndNew] } }}>
 *   {children}
 * </VuiProvider>
 * ```
 */
export type VuiConfig = {
  form?: FormConfig;
};

/** Form-wide configuration. Grows as later slices land (body composition, …). */
export type FormConfig = {
  /**
   * The footer buttons. Pass an array to replace them outright, or a function
   * to start from the ones the theme ships and change what you need:
   *
   * ```tsx
   * actions: (defaults) => [...defaults, saveAndNew]
   * ```
   *
   * Typed loosely here (`FormAction<never>` would fight variance) — the
   * component narrows it to its own row type.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: FormActionsConfig<any>;
};

/** What the footer buttons can be: a list, or a change to the shipped list. */
export type FormActionsConfig<T> =
  | FormAction<T>[]
  | ((defaults: FormAction<T>[]) => FormAction<T>[]);

/** The form's live state, handed to every action callback. */
export type FormActionContext<T> = {
  /** Which form is open. `view` is the read-only panel. */
  mode: "create" | "edit" | "view";
  /** The draft as it stands, including any un-saved edits. */
  row: T;
  /** The draft differs from the record that was opened. */
  dirty: boolean;
  /** No field currently fails validation. */
  valid: boolean;
  /** Inline field errors, keyed by field key. */
  errors: Map<string, string>;
  /** Close the form (runs the same discard path as Cancel). */
  close: () => void;
  /** Put the draft back to the record that was opened. */
  reset: () => void;
  /** Switch a read-only panel into edit mode, when the host allows it. */
  edit?: () => void;
};

/** One footer button. */
export type FormAction<T> = {
  /** Stable identity. The shipped actions use `cancel`, `save`, `close`, `edit`,
   *  so returning one of those ids from `actions` replaces that button. */
  id: string;
  label: string;
  /** Matches `Button`'s variants; omit for the standard secondary button. */
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  /** `start` pins the button to the left of the footer (Delete belongs there);
   *  everything else sits right, in array order. Default `end`. */
  align?: "start" | "end";
  icon?: React.ComponentType<{ className?: string }>;
  /** What the button does. Return `false` to keep the form open; anything else
   *  (including nothing) closes it once the promise settles. */
  onAct: (
    ctx: FormActionContext<T>,
  ) => boolean | void | Promise<boolean | void>;
  /** Hide the button for some modes or rows. Shown when omitted. */
  visible?: (ctx: FormActionContext<T>) => boolean;
  /** Disable without hiding — a tooltip-free "not now". */
  disabled?: (ctx: FormActionContext<T>) => boolean;
  /** Run validation first and block when a field fails. Defaults to `true` for
   *  `variant: "primary"` and `false` for everything else, which is why Save
   *  validates and Cancel doesn't. */
  requiresValid?: boolean;
  /** Ask before acting. Use it for anything destructive. */
  confirm?: { title: string; body?: string; confirmLabel?: string };
};

/**
 * The finished theme, as a value. Empty because every default currently lives in
 * the component that owns it: as later slices move a default here, this is where
 * it lands, and the components keep reading it the same way.
 */
export const vuiPreset: VuiConfig = {};

/** Identity helper for authoring a config with full type checking. */
export function defineConfig(config: VuiConfig): VuiConfig {
  return config;
}

/** Merge configs left to right; a later object overrides only the keys it sets. */
export function mergeConfig(...configs: (VuiConfig | undefined)[]): VuiConfig {
  const out: VuiConfig = {};
  for (const config of configs) {
    if (!config) continue;
    for (const [group, values] of Object.entries(config)) {
      if (values == null) continue;
      const key = group as keyof VuiConfig;
      out[key] = { ...(out[key] ?? {}), ...values } as VuiConfig[keyof VuiConfig];
    }
  }
  return out;
}

const VuiConfigContext = React.createContext<VuiConfig>(vuiPreset);

/**
 * Apply a config to everything below. Optional: without it the components use
 * {@link vuiPreset}, which is the theme as shipped.
 */
export function VuiProvider({
  config,
  children,
}: {
  config?: VuiConfig;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => mergeConfig(vuiPreset, config),
    [config],
  );
  return (
    <VuiConfigContext.Provider value={value}>
      {children}
    </VuiConfigContext.Provider>
  );
}

/** The resolved config (preset merged with any provider above). */
export function useVuiConfig(): VuiConfig {
  return React.useContext(VuiConfigContext);
}

/**
 * Resolve one config section: a per-instance prop wins outright, otherwise the
 * provider's value, otherwise the preset's. This is the whole resolution rule —
 * every component that takes config should use it rather than reinventing one.
 */
export function useResolved<K extends keyof VuiConfig>(
  section: K,
  prop: VuiConfig[K] | undefined,
): VuiConfig[K] {
  const config = useVuiConfig();
  return React.useMemo(
    () => ({ ...(config[section] ?? {}), ...(prop ?? {}) }) as VuiConfig[K],
    [config, section, prop],
  );
}
