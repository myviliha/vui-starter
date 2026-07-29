/**
 * Registry of documented components — the single source that drives the docs
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
      "A vertically stacked set of interactive headings that each reveal a section of content.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/accordion",
  },
  {
    slug: "alert",
    title: "Alert",
    description: "Displays a callout for user attention.",
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    description: "An interactive component which expands/collapses a panel.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/collapsible",
  },
  {
    slug: "hover-card",
    title: "Hover Card",
    description: "For sighted users to preview content available behind a link.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/hover-card",
  },
  {
    slug: "label",
    title: "Label",
    description: "Renders an accessible label associated with a control.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/label",
  },
  {
    slug: "popover",
    title: "Popover",
    description: "Displays rich content in a portal, triggered by a button.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/popover",
  },
  {
    slug: "separator",
    title: "Separator",
    description: "Visually or semantically separates content.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/separator",
  },
  {
    slug: "sheet",
    title: "Sheet",
    description:
      "Extends the Dialog to display content that complements the main content of the screen.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description: "Use to show a placeholder while content is loading.",
  },
  {
    slug: "switch",
    title: "Switch",
    description:
      "A control that allows the user to toggle between checked and not checked.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/switch",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    radixUrl: "https://www.radix-ui.com/primitives/docs/components/tabs",
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
