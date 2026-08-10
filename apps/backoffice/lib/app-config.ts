import type { OrgSwitcherConfig } from "@viliha/vui-ui/config";
import {
  FONT_FAMILIES,
  THEME_FIELDS,
  type ThemeConfig,
} from "@viliha/vui-ui/theme-config";

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
  { key: "help", label: "Help", hint: "Opens the support screen." },
  { key: "docs", label: "Documentation", hint: "Opens the docs site in a new tab." },
  { key: "notifications", label: "Notifications", hint: "Bell with a hover preview; opens the notifications page." },
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

/**
 * Data-table behaviour the person using the app may change for themselves, on
 * the Settings page. Everything else in the theme's config stays the app's call:
 * a preference is for how someone likes to work, not for redesigning the screen.
 */
export const DATA_TABLE_PREFERENCES = [
  "rowClick",
  "flashMs",
  "confirmDelete",
] as const;

/** Labels for the Settings controls, in display order. */
export const DATA_TABLE_PREFERENCE_FIELDS = [
  {
    key: "rowClick" as const,
    label: "Clicking a record name",
    hint: "Open it for reading, open it for editing, or do nothing.",
    options: [
      { value: "view", label: "Open to view" },
      { value: "edit", label: "Open to edit" },
      { value: "none", label: "Do nothing" },
    ],
  },
  {
    key: "flashMs" as const,
    label: "Highlight a row after saving",
    hint: "A brief highlight so you can see what changed.",
    options: [
      { value: "1600", label: "On" },
      { value: "0", label: "Off" },
    ],
  },
  {
    key: "confirmDelete" as const,
    label: "Ask before deleting",
    hint: "Turn this off only if you know what you are doing.",
    options: [
      { value: "true", label: "Ask first" },
      { value: "false", label: "Delete straight away" },
    ],
  },
];

/**
 * The organization's theme: the brand everyone in it starts from. A real app
 * loads this with the organization record and passes it to
 * `ThemeConfigProvider`; the demo hard-codes the shipped blue so there is
 * something for a personal override to sit on top of.
 */
export const ORG_THEME: ThemeConfig = {
  brand: "#266df0",
};

/**
 * The theme controls the Settings page renders as dropdowns. Colour has its own
 * swatch row, and the asset fields belong on the organization's branding screen
 * rather than a personal one.
 */
export const THEME_CHOICES = THEME_FIELDS.filter(
  (f) => f.type === "choice" || f.type === "font" || f.type === "length",
).map((f) => ({
  key: f.key,
  label: f.label,
  hint: f.hint,
  options:
    f.type === "font"
      ? FONT_FAMILIES.map((family) => ({ value: family.id, label: family.label }))
      : (f.options ?? []),
}));

/**
 * Organization switcher chrome. The **destination of "Add organization" lives
 * here**, not in the sidebar, so changing where creating a tenant goes is one
 * line in one file: a registration wizard, your own create page, or an external
 * signup. Set `onAdd` on the component instead when it should open a dialog
 * rather than navigate.
 */
export const ORG_SWITCHER: OrgSwitcherConfig = {
  addHref: "/register-business",
  addLabel: "Add organization",
  showPlan: true,
};

/**
 * Where the paid tier is sold. The core is MIT and always will be; Pro is an
 * optional add-on of net-new work. Point `checkoutUrl` at your checkout (a Polar
 * or Lemon Squeezy link, say) and the pricing page picks it up. Until it is set,
 * the page invites people to register interest instead of pretending there is a
 * buy button, and `available: false` keeps the copy honest about that.
 */
export const PRO = {
  available: false,
  price: "$149",
  cadence: "one-time, per developer",
  checkoutUrl:
    process.env.NEXT_PUBLIC_PRO_CHECKOUT_URL ??
    "https://github.com/myviliha/vui-starter/discussions",
  contactEmail: "hello@viliha.com",
} as const;
