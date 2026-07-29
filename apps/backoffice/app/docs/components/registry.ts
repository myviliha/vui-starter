/**
 * Registry of documented components: the single source that drives the docs
 * sidebar "Components" list and each component page's prev/next pager. Order
 * here is the order shown in the sidebar. Add a component by adding one entry
 * plus its page at `app/docs/components/<slug>/page.tsx`.
 */
export type ComponentMeta = {
  slug: string;
  title: string;
  /** One-line description (shown as the page lead + sidebar tooltip). */
  description: string;
  /** Underlying Radix primitive docs, if any (rendered as an "API Reference" link). */
  radixUrl?: string;
};

export const COMPONENTS: ComponentMeta[] = [
  {
    slug: "accordion",
    title: "Accordion",
    description:
      "Accordion is a vertically stacked set of headings, each revealing a section of content when you open it.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/accordion",
  },
  {
    slug: "alert",
    title: "Alert",
    description: "Alert is a callout that highlights an important message to the user.",
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    description:
      "Alert Dialog is a modal that interrupts the user with important content and waits for a response before continuing.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
  },
  {
    slug: "aspect-ratio",
    title: "Aspect Ratio",
    description: "Aspect Ratio locks its content to a fixed width-to-height ratio, such as 16:9.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/aspect-ratio",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description: "Breadcrumb shows the path to the current page as a row of linked parent levels.",
  },
  {
    slug: "calendar",
    title: "Calendar",
    description:
      "Calendar is a date picker for selecting a single date, several dates, or a range.",
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    description: "Collapsible is a control that shows or hides a single panel of content.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/collapsible",
  },
  {
    slug: "command",
    title: "Command",
    description: "Command is a fast, composable command menu (the kind behind a Cmd+K palette) for searching and running actions.",
  },
  {
    slug: "form",
    title: "Form",
    description: "Form wires React Hook Form to accessible fields, labels, and validation messages.",
  },
  {
    slug: "hover-card",
    title: "Hover Card",
    description: "Hover Card previews the content behind a link when the user hovers over it.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/hover-card",
  },
  {
    slug: "input-otp",
    title: "Input OTP",
    description:
      "Input OTP is an accessible one-time-password field with per-digit boxes and paste support.",
  },
  {
    slug: "label",
    title: "Label",
    description: "Label renders an accessible caption tied to a form control.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/label",
  },
  {
    slug: "popover",
    title: "Popover",
    description: "Popover shows rich content in a floating panel, anchored to the button that opens it.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/popover",
  },
  {
    slug: "progress",
    title: "Progress",
    description:
      "Progress is a horizontal bar that shows how far a task has completed.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/progress",
  },
  {
    slug: "radio-group",
    title: "Radio Group",
    description:
      "Radio Group is a set of options where the user can select exactly one.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/radio-group",
  },
  {
    slug: "scroll-area",
    title: "Scroll Area",
    description: "Scroll Area is a scrollable container with consistent, cross-browser custom scrollbars.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/scroll-area",
  },
  {
    slug: "separator",
    title: "Separator",
    description: "Separator is a thin line that divides content, horizontally or vertically.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/separator",
  },
  {
    slug: "sheet",
    title: "Sheet",
    description:
      "Sheet is a dialog that slides in from an edge of the screen (top, right, bottom, or left).",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description: "Skeleton is a placeholder shape that stands in for content while it loads.",
  },
  {
    slug: "slider",
    title: "Slider",
    description:
      "Slider is an input for choosing a value, or a range, by dragging along a track.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/slider",
  },
  {
    slug: "sonner",
    title: "Sonner",
    description: "Sonner is a toast notification system for React, an alternative to the built-in toast.",
  },
  {
    slug: "switch",
    title: "Switch",
    description:
      "Switch is an on/off toggle for a single setting.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/switch",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "Tabs organize content into panels shown one at a time, with a row of triggers to switch between them.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/tabs",
  },
  {
    slug: "textarea",
    title: "Textarea",
    description: "Textarea is a multi-line text input for longer, free-form content.",
  },
  {
    slug: "toggle",
    title: "Toggle",
    description: "Toggle is a button that stays pressed to represent an on or off state.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/toggle",
  },
  {
    slug: "toggle-group",
    title: "Toggle Group",
    description: "Toggle Group is a set of toggle buttons for single or multiple selection.",
    radixUrl:
      "https://www.radix-ui.com/primitives/docs/components/toggle-group",
  },
];

/** Sibling components for prev/next navigation. */
export function componentNeighbors(slug: string): {
  prev?: ComponentMeta;
  next?: ComponentMeta;
} {
  const i = COMPONENTS.findIndex((c) => c.slug === slug);
  return { prev: COMPONENTS[i - 1], next: COMPONENTS[i + 1] };
}
