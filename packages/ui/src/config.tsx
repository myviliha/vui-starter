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
 * package default ← vuiPreset ← <VuiProvider config> ← user preference ← prop
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
  behaviour?: BehaviourConfig;
  orgSwitcher?: OrgSwitcherConfig;
};

/**
 * The organization switcher's chrome. The switching logic itself is not in here
 * on purpose: that belongs to `OrgProvider`'s `onSwitch`, because it is code
 * rather than configuration. This is what the control says and shows.
 */
export type OrgSwitcherConfig = {
  /** Heading above the list. Default `"Organizations"`. */
  heading?: string;
  /** Badge on the active row. Default `"Current"`. */
  currentLabel?: string;
  /** The row that creates one. Default `"Add organization"`. */
  addLabel?: string;
  /** Where that row goes. A route, so the destination is set once for the app
   *  rather than wired per screen: a registration wizard, your own create page,
   *  an external signup. The switcher renders a real link, so middle-click and
   *  "open in new tab" work. Override the behaviour entirely (a dialog, say)
   *  with the component's `onAdd`, which wins over this. */
  addHref?: string;
  /** Show the plan line under each name. Default `true`; turn it off for an app
   *  with no billing. */
  showPlan?: boolean;
  /** Show the create row at all. Default `true`, and it still needs an `onAdd`
   *  handler to appear. Set `false` where only an admin may create tenants. */
  showAdd?: boolean;
};

/** A tenant's theme, as handed to `ThemeConfigProvider`. Declared loosely here
 *  so `config` doesn't have to import the theme types. */
export type ThemeAwareOrgConfig = Record<string, string | undefined>;

/**
 * What the components do, as opposed to how they look. Every key here replaces
 * something that used to be hard-coded, and every one has a real consumer — the
 * config is not a place to park settings nothing reads.
 */
export type BehaviourConfig = {
  /** What clicking a row's name does. Default `"view"`. */
  rowClick?: "view" | "edit" | "none";
  /** Close the form after a successful save. Set `false` for a form that stays
   *  open so the next record can be entered. Default `true`. */
  closeOnSave?: boolean;
  /** How long a saved row stays highlighted, in milliseconds. `0` turns the
   *  highlight off. Default `1600`. */
  flashMs?: number;
  /** Ask before deleting a row. Default `true`. Turning this off makes delete
   *  immediate, so only do it where you have an undo. */
  confirmDelete?: boolean;
  /** Ask before discarding a form with unsaved edits. Default `false`, which is
   *  how Cancel has always behaved. */
  confirmDiscardWhenDirty?: boolean;
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
  /**
   * How many columns the fields flow across: 1, 2 or 3. Default 1.
   *
   * This is about **fields**, not sections. `formColumns` on a full-page form
   * still decides whether whole sections sit side by side, and the two compose:
   * a two-column page of two-column sections is four fields wide, which is
   * usually too many.
   */
  fieldColumns?: FieldColumns;
  /**
   * How a field's label meets its control. Default `"inline"`.
   *
   * - `"inline"` puts them on one row, `Label * [control]`, with the labels in
   *   a column that widens to the longest one so every control lines up.
   * - `"stacked"` puts the label on its own row above the control, which is
   *   what long values, textareas and address blocks want.
   *
   * A field can override it, so one textarea can stack inside an inline form.
   */
  fieldLayout?: FieldLayout;
};

/** Columns the form's fields flow across. */
export type FieldColumns = 1 | 2 | 3;

/** Label beside the control, or above it. */
export type FieldLayout = "inline" | "stacked";

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

/**
 * Something of your own between the fields of a form: a callout, a preview, a
 * pair of custom controls. It renders as a full-width row inside the section, so
 * it inherits the card, the separators and the padding rather than floating
 * beside them.
 *
 * Slots live next to the form, not in the `fields` array, because that array is
 * the data contract: it drives the table, the filter panel and import/export as
 * well as the form. Mixing arbitrary markup into it would put layout into all
 * four.
 */
export type FormSlot<T> = {
  id: string;
  /** Place it after this field. Omit to put it at the end of `group`. */
  after?: string;
  /** Which section it belongs to. Defaults to the last group, or "General". */
  group?: string;
  render: (ctx: FormActionContext<T>) => React.ReactNode;
};

/** What the form does once an action succeeds. */
export type FormActionOutcome =
  /** Close the form. The default, and what Save does. */
  | "close"
  /** Keep it open on the record just saved. */
  | "stay"
  /** Open a blank record, for entering several in a row ("Save & New").
   *  Needs `makeEmptyRow` on the table; falls back to "stay" without it. */
  | "new";

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
  /** What happens after the action succeeds. Default `"close"`. Set
   *  `after: "new"` on a saving action to get "Save & New". Ignored when the
   *  action returns `false`, which means it handled its own outcome. */
  after?: FormActionOutcome;
  /** Ask before acting. Use it for anything destructive. */
  confirm?: { title: string; body?: string; confirmLabel?: string };
};

/**
 * The finished theme, as a value. These are the shipped defaults, and the
 * components read them from here rather than keeping their own copies, which is
 * what makes "the preconfigured theme is a config" true rather than a slogan.
 */
export const vuiPreset: VuiConfig = {
  behaviour: {
    rowClick: "view",
    closeOnSave: true,
    flashMs: 1600,
    confirmDelete: true,
    confirmDiscardWhenDirty: false,
  },
};

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

/**
 * Which keys the person using the app may change for themselves, per section:
 * `{ behaviour: ["rowClick", "flashMs"] }`. Nothing is user-editable unless it
 * is listed here, because "the user can move the Save button" is chaos while
 * "the user prefers no row highlight" is a feature.
 */
export type UserConfigurable = {
  [K in keyof VuiConfig]?: readonly (keyof NonNullable<VuiConfig[K]>)[];
};

/** A user's saved choices, same shape as the config but partial throughout. */
export type VuiPreferences = VuiConfig;

const VuiConfigContext = React.createContext<VuiConfig>(vuiPreset);

type PreferencesCtx = {
  /** The stored choices, as saved. */
  preferences: VuiPreferences;
  /** Which keys this app opened up. Drive a settings UI from it. */
  userConfigurable: UserConfigurable;
  /** Set one key. Ignored (with no write) when the app didn't allow it. */
  setPreference: <K extends keyof VuiConfig>(
    section: K,
    key: keyof NonNullable<VuiConfig[K]>,
    value: unknown,
  ) => void;
  /** Forget every stored choice and fall back to the app's config. */
  reset: () => void;
};

const VuiPreferencesContext = React.createContext<PreferencesCtx | null>(null);

/** Drop any stored key the app hasn't opened up. Exported for testing. */
export function filterUserPreferences(
  preferences: VuiPreferences,
  userConfigurable: UserConfigurable,
): VuiConfig {
  const out: VuiConfig = {};
  for (const [group, values] of Object.entries(preferences)) {
    const section = group as keyof VuiConfig;
    const keys = userConfigurable[section] as readonly string[] | undefined;
    if (!keys || values == null) continue;
    const kept = Object.fromEntries(
      Object.entries(values).filter(([k]) => keys.includes(k)),
    );
    if (Object.keys(kept).length)
      out[section] = kept as VuiConfig[keyof VuiConfig];
  }
  return out;
}

/**
 * Apply a config to everything below. Optional: without it the components use
 * {@link vuiPreset}, which is the theme as shipped.
 *
 * Pass `userConfigurable` to let the person using the app override some of it
 * from inside the app. Their choices are saved per browser and merged over your
 * config, so the preconfigured theme stays changeable at runtime without the
 * host giving up control of what may change.
 */
export function VuiProvider({
  config,
  userConfigurable,
  storageKey = "vui.prefs",
  children,
}: {
  config?: VuiConfig;
  userConfigurable?: UserConfigurable;
  /** localStorage key for the user's choices. Default `"vui.prefs"`. */
  storageKey?: string;
  children: React.ReactNode;
}) {
  const editable = React.useMemo(
    () => userConfigurable ?? {},
    [userConfigurable],
  );
  const [preferences, setPreferences] = React.useState<VuiPreferences>({});

  // Read after mount, so the prerendered HTML and the first client render agree.
  // A preference that changes something visible settles one frame late, which is
  // the same trade the top-bar chrome flags make.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object")
        setPreferences(parsed as VuiPreferences);
    } catch {
      // malformed or blocked storage — the app's config stands
    }
  }, [storageKey]);

  const setPreference = React.useCallback<PreferencesCtx["setPreference"]>(
    (section, key, value) => {
      const keys = editable[section] as readonly string[] | undefined;
      if (!keys?.includes(key as string)) return; // not open to the user
      setPreferences((prev) => {
        const next = {
          ...prev,
          [section]: { ...(prev[section] ?? {}), [key]: value },
        } as VuiPreferences;
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // storage unavailable — the change stays in memory for this session
        }
        return next;
      });
    },
    [editable, storageKey],
  );

  const reset = React.useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore storage failures
    }
    setPreferences({});
  }, [storageKey]);

  const value = React.useMemo(
    () =>
      mergeConfig(
        vuiPreset,
        config,
        filterUserPreferences(preferences, editable),
      ),
    [config, preferences, editable],
  );
  const prefsValue = React.useMemo(
    () => ({ preferences, userConfigurable: editable, setPreference, reset }),
    [preferences, editable, setPreference, reset],
  );

  return (
    <VuiConfigContext.Provider value={value}>
      <VuiPreferencesContext.Provider value={prefsValue}>
        {children}
      </VuiPreferencesContext.Provider>
    </VuiConfigContext.Provider>
  );
}

/**
 * Read and write the user's own choices — for a Settings screen. Returns `null`
 * when there is no {@link VuiProvider} above, so a settings section can hide
 * itself rather than crash.
 */
export function useVuiPreferences(): PreferencesCtx | null {
  return React.useContext(VuiPreferencesContext);
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
