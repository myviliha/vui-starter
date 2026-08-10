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

export const SWITCH_ROOT =
  "peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80";

export const SWITCH_THUMB =
  "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground";

export const CHECKBOX =
  "size-4 shrink-0 cursor-pointer rounded border-input accent-[var(--button-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";

export const TABS_ROOT =
  "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col";

export type TabsListVariant = "default" | "line";

export const TABS_LIST_BASE =
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none";

export const TABS_LIST_VARIANTS: Record<TabsListVariant, string> = {
  default: "bg-muted",
  line: "gap-1 bg-transparent",
};

export const TABS_TRIGGER = [
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
  "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
  "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
].join(" ");

export const TABS_CONTENT = "flex-1 outline-none";

export const ACCORDION_ITEM = "border-b last:border-b-0";

export const ACCORDION_TRIGGER =
  "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180";

export const ACCORDION_CHEVRON =
  "pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200";

export const ACCORDION_CONTENT =
  "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down";

export const ACCORDION_CONTENT_INNER = "pt-0 pb-4";

export const DIALOG_OVERLAY =
  "vui-overlay-in fixed inset-0 z-[70] flex items-center justify-center bg-foreground/25 p-4";

export const DIALOG_PANEL =
  "vui-pop-in w-full max-w-md overflow-hidden rounded-lg border border-border bg-background shadow-xl";

export const DIALOG_HEADER = "border-b border-border bg-muted/40 px-5 py-3";

export const DIALOG_TITLE = "text-base font-semibold tracking-tight";

/** Capped so long content scrolls inside the dialog, not the page behind it. */
export const DIALOG_BODY = "max-h-[70vh] overflow-y-auto px-5 py-4 text-sm leading-relaxed";

export const DIALOG_FOOTER =
  "flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3";

/**
 * Everything about the popover surface except its transform origin. Radix and
 * Reka each publish the measured origin under their own variable name, so each
 * component adds that one utility itself, the same split the accordion uses.
 */
export const POPOVER_CONTENT =
  "z-[200] w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95";

export const POPOVER_HEADER = "flex flex-col gap-1 text-sm";
export const POPOVER_TITLE = "font-medium";
export const POPOVER_DESCRIPTION = "text-muted-foreground";

export const TOOLTIP_CONTENT =
  "vui-fade-in relative w-fit max-w-xs text-balance rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md";
