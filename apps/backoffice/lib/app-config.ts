/**
 * Top-bar chrome feature flags.
 *
 * Every top-bar affordance (quick actions, global search, help, docs,
 * notifications, settings, user menu) is on by default. A consumer setting up
 * the theme can turn any of them off two ways:
 *
 * 1. **Install-time** — set the matching `NEXT_PUBLIC_SHOW_*` env var to `0`
 *    (or `false`). These are the defaults baked into the build.
 * 2. **Runtime** — flip it on the Settings page ("Top bar" section); the choice
 *    persists per-browser and overrides the install-time default live.
 *
 * The runtime layer lives in `app/_components/chrome-config.tsx`.
 */

export type ChromeFeature =
  | "quickActions"
  | "globalSearch"
  | "help"
  | "docs"
  | "notifications"
  | "settings"
  | "userMenu";

/** Ordered metadata for the Settings toggles. */
export const CHROME_FEATURES: { key: ChromeFeature; label: string; hint: string }[] = [
  { key: "quickActions", label: "Quick actions (⌘K)", hint: "Command palette to jump between pages." },
  { key: "globalSearch", label: "Global search (⌘⌥K)", hint: "Search across records from the top bar." },
  { key: "help", label: "Help", hint: "Help & support button." },
  { key: "docs", label: "Documentation", hint: "Opens the docs site in a new tab." },
  { key: "notifications", label: "Notifications", hint: "Notifications bell." },
  { key: "settings", label: "Settings", hint: "Shortcut to this page." },
  { key: "userMenu", label: "User menu", hint: "Account avatar, profile & sign out." },
];

/** Parse a NEXT_PUBLIC_* flag: unset/empty → default; "0"/"false" → off; else on. */
function flag(value: string | undefined, dflt: boolean): boolean {
  if (value == null || value === "") return dflt;
  return value !== "0" && value.toLowerCase() !== "false";
}

/**
 * Install-time defaults. Each env var is referenced literally so Next inlines it
 * into the client bundle — do NOT rewrite these as a dynamic
 * `process.env[`NEXT_PUBLIC_SHOW_${key}`]` lookup, which Next cannot inline.
 */
export const CHROME_DEFAULTS: Record<ChromeFeature, boolean> = {
  quickActions: flag(process.env.NEXT_PUBLIC_SHOW_QUICK_ACTIONS, true),
  globalSearch: flag(process.env.NEXT_PUBLIC_SHOW_GLOBAL_SEARCH, true),
  help: flag(process.env.NEXT_PUBLIC_SHOW_HELP, true),
  docs: flag(process.env.NEXT_PUBLIC_SHOW_DOCS, true),
  notifications: flag(process.env.NEXT_PUBLIC_SHOW_NOTIFICATIONS, true),
  settings: flag(process.env.NEXT_PUBLIC_SHOW_SETTINGS, true),
  userMenu: flag(process.env.NEXT_PUBLIC_SHOW_USER_MENU, true),
};
