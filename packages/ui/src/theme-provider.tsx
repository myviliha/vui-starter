"use client";

import * as React from "react";

import {
  applyTheme,
  FONT_FAMILIES,
  mergeThemes,
  parseTheme,
  THEME_FIELDS,
  THEME_PRESETS,
  type ThemeConfig,
} from "./theme-config";

// The package ships without @types/node; the consumer's bundler inlines this.
declare const process: { env: Record<string, string | undefined> };

/**
 * Where a user's theme is stored. The package never fetches: you implement these
 * two against your API, so a theme lives in your database against whichever
 * identity you use.
 *
 * ```tsx
 * <ThemeConfigProvider
 *   orgTheme={org.theme}
 *   source={{
 *     load: () => api.get(`/users/${me.id}/theme`),
 *     save: (theme) => api.put(`/users/${me.id}/theme`, theme),
 *   }}
 * >
 * ```
 */
export type ThemeSource = {
  /** Read this user's saved theme. Return `null` when they have none. */
  load: () => Promise<ThemeConfig | null> | ThemeConfig | null;
  /** Persist it. Called when a value changes, and awaited so the UI can show a
   *  saving state and report a failure. */
  save: (theme: ThemeConfig) => Promise<void> | void;
};

type ThemeCtx = {
  /** What's on screen: the organization's theme with the user's on top. */
  theme: ThemeConfig;
  /** The organization's, as passed in. The floor a user overrides. */
  orgTheme: ThemeConfig;
  /** This user's overrides only. What gets saved. */
  userTheme: ThemeConfig;
  /** Change one value. Pass `undefined` to drop the override and fall back to
   *  the organization's. */
  setValue: (key: keyof ThemeConfig, value: string | undefined) => void;
  /** Apply a named preset from `THEME_PRESETS` as the user's theme. */
  applyPreset: (id: string) => void;
  /** Drop every personal override and go back to the organization's theme. */
  reset: () => void;
  /** A save is in flight. */
  saving: boolean;
  /** The last save or load failure, for a message beside the controls. */
  error: unknown;
  fields: typeof THEME_FIELDS;
  presets: typeof THEME_PRESETS;
};

const ThemeConfigContext = React.createContext<ThemeCtx | null>(null);

/**
 * Applies a theme to the document and manages the two layers: the organization
 * sets the brand, and each person can override the parts they care about.
 *
 * With no `source` the user's theme is kept in `localStorage`, which is what the
 * demo does. That is the same trade the top-bar chrome flags make: it works with
 * no backend, and it doesn't follow anyone to another browser.
 */
export function ThemeConfigProvider({
  orgTheme,
  source,
  storageKey = "vui.theme",
  children,
}: {
  /** The organization's theme. Everyone in it starts here. */
  orgTheme?: ThemeConfig;
  /** Your API. Omit to keep the user's theme in this browser only. */
  source?: ThemeSource;
  /** localStorage key used when there is no `source`. */
  storageKey?: string;
  children: React.ReactNode;
}) {
  const org = React.useMemo(() => parseTheme(orgTheme ?? {}), [orgTheme]);
  const [userTheme, setUserTheme] = React.useState<ThemeConfig>({});
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const sourceRef = React.useRef(source);
  sourceRef.current = source;

  // Load after mount, so the server-rendered HTML and the first client render
  // agree. A personal theme therefore lands one frame late; the organization's
  // is applied from the start because it renders with the page.
  React.useEffect(() => {
    let live = true;
    const run = async () => {
      try {
        if (sourceRef.current) {
          const stored = await sourceRef.current.load();
          if (live && stored) setUserTheme(parseTheme(stored));
          return;
        }
        const raw = localStorage.getItem(storageKey);
        if (raw && live) setUserTheme(parseTheme(JSON.parse(raw)));
      } catch (err) {
        if (live) setError(err);
      }
    };
    void run();
    return () => {
      live = false;
    };
  }, [storageKey]);

  const theme = React.useMemo(
    () => mergeThemes(org, userTheme),
    [org, userTheme],
  );

  // One effect owns the document's variables, and it restores what it replaced
  // when the theme changes or the provider unmounts.
  React.useEffect(() => applyTheme(theme), [theme]);

  // A family listed in FONT_FAMILIES but never loaded by the app falls back to
  // its generic stack, so the option looks broken rather than missing. Say so
  // in development, where the fix (load it in the root layout) is one line.
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || !theme.fontSans) return;
    const family = FONT_FAMILIES.find((f) => f.id === theme.fontSans);
    if (!family?.variable) return;
    const loaded = getComputedStyle(document.documentElement).getPropertyValue(
      family.variable,
    );
    if (loaded.trim() === "")
      console.warn(
        `[vui] The "${family.label}" font is offered in FONT_FAMILIES but ${family.variable} is not defined, so it falls back to the generic stack. Load it in your root layout (next/font) and put its variable on <html>.`,
      );
  }, [theme.fontSans]);

  const persist = React.useCallback(
    async (next: ThemeConfig) => {
      setError(null);
      if (!sourceRef.current) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // storage unavailable — the change still applies for this session
        }
        return;
      }
      setSaving(true);
      try {
        await sourceRef.current.save(next);
      } catch (err) {
        setError(err);
      } finally {
        setSaving(false);
      }
    },
    [storageKey],
  );

  const commit = React.useCallback(
    (next: ThemeConfig) => {
      setUserTheme(next);
      void persist(next);
    },
    [persist],
  );

  const setValue = React.useCallback<ThemeCtx["setValue"]>(
    (key, value) => {
      setUserTheme((prev) => {
        const next = { ...prev };
        if (value == null || value === "") delete next[key];
        else next[key] = value;
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const applyPreset = React.useCallback(
    (id: string) => {
      const preset = THEME_PRESETS.find((p) => p.id === id);
      if (preset) commit(mergeThemes(preset.theme));
    },
    [commit],
  );

  const reset = React.useCallback(() => {
    if (!sourceRef.current) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore storage failures
      }
      setUserTheme({});
      return;
    }
    commit({});
  }, [commit, storageKey]);

  const value = React.useMemo<ThemeCtx>(
    () => ({
      theme,
      orgTheme: org,
      userTheme,
      setValue,
      applyPreset,
      reset,
      saving,
      error,
      fields: THEME_FIELDS,
      presets: THEME_PRESETS,
    }),
    [theme, org, userTheme, setValue, applyPreset, reset, saving, error],
  );

  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  );
}

/**
 * Read and change the theme, for a settings screen. Returns `null` when there is
 * no provider above, so a settings section can hide itself rather than crash.
 */
export function useThemeConfig(): ThemeCtx | null {
  return React.useContext(ThemeConfigContext);
}
