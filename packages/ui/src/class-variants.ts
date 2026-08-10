/**
 * The class strings that *are* the design system, as data.
 *
 * A component in any framework renders the same markup with the same Tailwind
 * utilities; only the templating differs. Keeping the strings here means the
 * React component and the Vue one cannot drift: change a button's hover state
 * once and both follow.
 *
 * Framework-free on purpose. It ships to non-React consumers through
 * `@viliha/vui-core` (see packages/core/scripts/build.mjs), so nothing in this
 * file may import React, Vue or Svelte.
 */

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

// Standard button: white background + border; on hover only the icon activates
// (muted → foreground). Shared by default/secondary/outline for one consistent look.
const NEUTRAL =
  "border border-border bg-background text-foreground [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground";

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: NEUTRAL,
  primary:
    "border border-transparent bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)] [&_svg]:border-[var(--button-primary-hover)]",
  secondary: NEUTRAL,
  outline: NEUTRAL,
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: "h-8 px-3",
  sm: "h-7 rounded-sm px-2.5",
  lg: "h-9 px-4",
  icon: "size-8",
};

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "muted"
  | "success"
  | "warning"
  | "destructive";

export const BADGE_BASE =
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-normal";

export const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  outline: "border-border text-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
  success:
    "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  warning:
    "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  destructive:
    "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
};
