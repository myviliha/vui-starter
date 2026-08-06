/**
 * Theme configuration: the complete list of things a host (or the person using
 * the app) can change about how the theme looks, as data.
 *
 * The rule the rest of the design system follows is that visual values live in
 * `theme.css` and nothing styles itself per component. This does not break that
 * rule, it finishes it: there is still exactly one token surface, and this file
 * gives it a runtime source. Every entry below maps to one CSS variable, so
 * applying a theme is setting variables on an element, and every component
 * follows without knowing this file exists.
 *
 * The package never talks to your database. `ThemeConfigProvider` takes a
 * `source` with `load()` and `save()`, so a theme can live in your API against
 * a user, an organization, or both.
 *
 * ```ts
 * const theme: ThemeConfig = { brand: "#266df0", radius: "0.625rem", fontSans: "inter" };
 * applyTheme(theme);           // sets the CSS variables on :root
 * ```
 */

/** One themeable value: what it is, what it edits, and how to show it. */
export type ThemeField = {
  key: keyof ThemeConfig;
  label: string;
  /** Which control a settings UI should render. */
  type: "color" | "font" | "length" | "choice" | "asset";
  /** The CSS variable it writes. Everything else in `theme.css` derives from
   *  these, which is why the list stays short. */
  cssVar: string;
  group: "Brand" | "Surface" | "Typography" | "Shape" | "Assets";
  /** What it does, in the words you'd put under the control. */
  hint: string;
  /** Options for `choice` and `font`. */
  options?: { value: string; label: string }[];
  /** Whether a value is required for the theme to render. Optional entries fall
   *  back to whatever `theme.css` ships. */
  optional?: boolean;
};

/**
 * The themeable surface. Twelve entries on purpose: these are the ones with an
 * obvious meaning to whoever is looking at the screen. Everything else in
 * `theme.css` is derived from them (the ring, the selection colour, the button
 * shadow and the hover state all follow `--brand`), so this stays a settings
 * page rather than a stylesheet editor.
 */
export const THEME_FIELDS: ThemeField[] = [
  {
    key: "brand",
    label: "Primary color",
    type: "color",
    cssVar: "--brand",
    group: "Brand",
    hint: "Buttons, links, focus rings, selected text and the active nav item.",
  },
  {
    key: "brandForeground",
    label: "Text on primary",
    type: "color",
    cssVar: "--button-primary-foreground",
    group: "Brand",
    hint: "Left unset, it picks black or white for you, whichever stays readable.",
    optional: true,
  },
  {
    key: "accent",
    label: "Accent",
    type: "color",
    cssVar: "--accent",
    group: "Brand",
    hint: "Hover backgrounds, chips and other quiet highlights.",
    optional: true,
  },
  {
    key: "destructive",
    label: "Destructive",
    type: "color",
    cssVar: "--destructive",
    group: "Brand",
    hint: "Delete buttons, error text and invalid fields.",
    optional: true,
  },
  {
    key: "background",
    label: "Page background",
    type: "color",
    cssVar: "--background",
    group: "Surface",
    hint: "The canvas behind cards and tables.",
    optional: true,
  },
  {
    key: "foreground",
    label: "Text",
    type: "color",
    cssVar: "--foreground",
    group: "Surface",
    hint: "Default text colour across the app.",
    optional: true,
  },
  {
    key: "border",
    label: "Borders",
    type: "color",
    cssVar: "--border",
    group: "Surface",
    hint: "Card edges, table rules and dividers.",
    optional: true,
  },
  {
    key: "fontSans",
    label: "Font",
    type: "font",
    cssVar: "--font-sans-choice",
    group: "Typography",
    hint: "Used for everything except code.",
    options: [], // filled from FONT_FAMILIES below
  },
  {
    key: "fontScale",
    label: "Text size",
    type: "choice",
    cssVar: "--font-scale",
    group: "Typography",
    hint: "Scales every size at once, for denser or roomier screens.",
    options: [
      { value: "0.95", label: "Compact" },
      { value: "1", label: "Default" },
      { value: "1.05", label: "Comfortable" },
    ],
  },
  {
    key: "radius",
    label: "Corner radius",
    type: "length",
    cssVar: "--radius",
    group: "Shape",
    hint: "How round buttons, cards and inputs are.",
    options: [
      { value: "0rem", label: "Square" },
      { value: "0.375rem", label: "Slight" },
      { value: "0.625rem", label: "Default" },
      { value: "1rem", label: "Round" },
    ],
  },
  {
    key: "logo",
    label: "Logo",
    type: "asset",
    cssVar: "--brand-logo",
    group: "Assets",
    hint: "Shown in the sidebar and on the auth screens.",
    optional: true,
  },
  {
    key: "favicon",
    label: "Favicon",
    type: "asset",
    cssVar: "--brand-favicon",
    group: "Assets",
    hint: "The browser tab icon.",
    optional: true,
  },
];

/**
 * A saved theme. Every field is optional: anything unset falls back to the
 * organization's theme, then to what `theme.css` ships, so a partial record from
 * your database is always valid.
 */
export type ThemeConfig = {
  /** Any CSS colour. Hex is what the pickers produce. */
  brand?: string;
  brandForeground?: string;
  accent?: string;
  destructive?: string;
  background?: string;
  foreground?: string;
  border?: string;
  /** A `FONT_FAMILIES` id. */
  fontSans?: string;
  /** A multiplier as a string, e.g. `"1.05"`. */
  fontScale?: string;
  /** A CSS length, e.g. `"0.625rem"`. */
  radius?: string;
  /** A URL, or whatever your uploader returns. */
  logo?: string;
  favicon?: string;
};

/**
 * The font families an app offers. Self-hosted and loaded by the app (with
 * `next/font`, which sets the CSS variable named here), so switching font makes
 * no network request and can't flash or shift the layout. Add a family by
 * loading it in your app and adding an entry.
 */
export type FontFamily = {
  id: string;
  label: string;
  /** The CSS variable the app's font loader defines, e.g. `--font-inter`. */
  variable: string;
  /** Fallbacks, used until the family loads and if it never does. */
  stack: string;
};

export const FONT_FAMILIES: FontFamily[] = [
  {
    id: "inter",
    label: "Inter",
    variable: "--font-inter",
    stack: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "system",
    label: "System",
    variable: "",
    stack:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: "geist",
    label: "Geist",
    variable: "--font-geist",
    stack: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "source-serif",
    label: "Source Serif",
    variable: "--font-source-serif",
    stack: "ui-serif, Georgia, serif",
  },
];

/** Named themes for a swatch picker. The first is what the package ships. */
export type ThemePreset = { id: string; label: string; theme: ThemeConfig };

export const THEME_PRESETS: ThemePreset[] = [
  { id: "default", label: "Vui blue", theme: { brand: "#266df0" } },
  { id: "crimson", label: "Crimson", theme: { brand: "#d33c4e" } },
  { id: "violet", label: "Violet", theme: { brand: "#8b5cf6" } },
  { id: "emerald", label: "Emerald", theme: { brand: "#3fae7f" } },
  { id: "amber", label: "Amber", theme: { brand: "#d97706" } },
  { id: "slate", label: "Slate", theme: { brand: "#475569" } },
];

/** Parse `#rgb` / `#rrggbb` into 0-255 channels. Returns null for anything else,
 *  including the `oklch()` values `theme.css` ships. */
export function parseHex(color: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return null;
  const hex = m[1]!;
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/**
 * Black or white, whichever stays readable on `color`. Uses the WCAG relative
 * luminance, so a mid-tone brand colour lands on the right side of the line
 * instead of shipping white text on yellow.
 *
 * Falls back to white for anything it can't parse, which is what the shipped
 * blue wants.
 */
export function readableOn(color: string): "#ffffff" | "#101112" {
  const rgb = parseHex(color);
  if (!rgb) return "#ffffff";
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb;
  const luminance =
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  // Contrast against white vs against black, whichever is higher.
  return (1.05 / (luminance + 0.05)) >= (luminance + 0.05) / 0.05
    ? "#ffffff"
    : "#101112";
}

/**
 * A theme as CSS variables. The dark-mode variants are not computed here: they
 * derive from the same variables in `theme.css` with `color-mix`, so one saved
 * value covers both modes and neither can drift from the other.
 */
export function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const field of THEME_FIELDS) {
    const value = theme[field.key];
    if (!value) continue;
    if (field.type === "font") {
      const family = FONT_FAMILIES.find((f) => f.id === value);
      if (!family) continue;
      vars[field.cssVar] = family.variable
        ? `var(${family.variable}), ${family.stack}`
        : family.stack;
      continue;
    }
    if (field.type === "asset") {
      vars[field.cssVar] = `url("${value}")`;
      continue;
    }
    vars[field.cssVar] = value;
  }
  // Text on the brand colour follows the brand unless it was set explicitly.
  if (theme.brand && !theme.brandForeground)
    vars["--button-primary-foreground"] = readableOn(theme.brand);
  return vars;
}

/**
 * Write a theme onto an element (the document root by default). Passing an
 * element scopes it, which is how a live preview renders one theme inside a page
 * running another.
 *
 * Returns a function that removes what it set, so a preview can clean up.
 */
export function applyTheme(
  theme: ThemeConfig,
  element?: HTMLElement | null,
): () => void {
  const target =
    element ??
    (typeof document === "undefined" ? null : document.documentElement);
  if (!target) return () => {};
  const vars = themeToCssVars(theme);
  const previous = new Map<string, string>();
  for (const [name, value] of Object.entries(vars)) {
    previous.set(name, target.style.getPropertyValue(name));
    target.style.setProperty(name, value);
  }
  return () => {
    for (const [name, value] of previous) {
      if (value) target.style.setProperty(name, value);
      else target.style.removeProperty(name);
    }
  };
}

/**
 * Keep only the keys this file knows about, and only string values. Run it on
 * anything arriving from your API: a stored theme is user input, and an unknown
 * key would otherwise be written straight onto the document as a CSS variable.
 */
export function parseTheme(input: unknown): ThemeConfig {
  if (!input || typeof input !== "object") return {};
  const known = new Set(THEME_FIELDS.map((f) => f.key as string));
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!known.has(key) || typeof value !== "string") continue;
    // No `;` or `}`: a CSS variable value is inserted into a style attribute.
    if (/[;{}<>]/.test(value)) continue;
    out[key] = value.trim();
  }
  return out as ThemeConfig;
}

/** Later themes win, key by key. Used for organization theme ← user theme. */
export function mergeThemes(...themes: (ThemeConfig | undefined)[]): ThemeConfig {
  const out: ThemeConfig = {};
  for (const theme of themes) {
    if (!theme) continue;
    for (const [key, value] of Object.entries(theme)) {
      if (value) out[key as keyof ThemeConfig] = value;
    }
  }
  return out;
}
