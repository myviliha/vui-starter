import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Anything that floats has to sit above whatever opened it, or it is invisible
 * or unclickable: a menu inside a slide-over, a confirm raised from a form, a
 * date picker at the bottom of a scrolling card. That has bitten this package
 * more than once, so the stacking order is a fixed scale and this test holds
 * every component to it.
 *
 * Read it as: **what can open on top of what**. A picker must clear a panel,
 * because you open one inside the other. A tooltip must clear the picker,
 * because you can hover a disabled option. Toasts clear everything, because
 * they report on what just happened underneath.
 */
const SCALE = {
  10: "in-page: sticky headers, cell overlays, focus rings",
  20: "in-page, above 10",
  30: "in-page, above 20",
  55: "slide-over backdrop",
  60: "slide-over panel, Sheet",
  70: "Dialog",
  80: "AlertDialog / confirm — must clear a Dialog and a slide-over",
  100: "command palette",
  200: "pickers and menus: Select, Combobox, Dropdown, Popover, context menus",
  210: "HoverCard",
  220: "Tooltip",
  250: "Toast",
} as const;

const ALLOWED = new Set(Object.keys(SCALE).map(Number));

/** `z-50`, `z-[200]`, and the arbitrary form in a `cn(...)` string. */
const Z_CLASS = /\bz-\[(\d+)\]|\bz-(\d+)\b/g;

const SRC = join(__dirname);
const files = readdirSync(SRC).filter(
  (f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"),
);

describe("floating surfaces", () => {
  it("every floating panel uses the same surface, never a dark bubble", () => {
    // shadcn's tooltip is dark `bg-primary`, which reads as a second design
    // system sitting on top of this one. Menus, popovers, selects and tooltips
    // all use `bg-popover` so they look like parts of one product.
    for (const file of [
      "tooltip.tsx",
      "popover.tsx",
      "dropdown-menu.tsx",
      "select.tsx",
      "hover-card.tsx",
    ]) {
      const source = readFileSync(join(SRC, file), "utf8");
      expect(source, file).toContain("bg-popover");
      expect(source, file).not.toContain("bg-primary ");
    }
  });

  it("every backdrop is the themed scrim, not hard black", () => {
    // `bg-black/50` over an already-dark background is a muddy rectangle.
    for (const file of ["dialog.tsx", "alert-dialog.tsx", "sheet.tsx", "command-palette.tsx"]) {
      const source = readFileSync(join(SRC, file), "utf8");
      expect(source, file).toContain("bg-foreground/25");
      expect(source, file).not.toContain("bg-black/");
    }
  });
});

describe("stacking order", () => {
  it("every z-index in the package is on the documented scale", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(join(SRC, file), "utf8");
      for (const match of source.matchAll(Z_CLASS)) {
        const value = Number(match[1] ?? match[2]);
        if (!ALLOWED.has(value)) offenders.push(`${file}: z-${value}`);
      }
    }
    // A new value means picking a layer deliberately: add it to SCALE with a
    // note on what it has to clear, or reuse the layer that already fits.
    expect(offenders).toEqual([]);
  });

  it("pickers and menus clear the slide-over they open inside", () => {
    // The bug this test exists for: a Dropdown at z-40 inside a z-60 panel.
    expect(200).toBeGreaterThan(60);
    for (const file of ["select.tsx", "combobox.tsx", "multi-combobox.tsx", "dropdown-menu.tsx", "popover.tsx"]) {
      const source = readFileSync(join(SRC, file), "utf8");
      expect(source, file).toContain("z-[200]");
    }
  });

  it("a confirm clears both a dialog and a slide-over", () => {
    const source = readFileSync(join(SRC, "alert-dialog.tsx"), "utf8");
    expect(source).toContain("z-[80]");
  });

  it("floating content is portalled, so no scrolling ancestor can clip it", () => {
    // Position alone isn't enough: rendered in place, an `absolute` menu is cut
    // off by the nearest `overflow-hidden`, which every section card has.
    for (const file of ["select.tsx", "combobox.tsx", "multi-combobox.tsx", "dropdown-menu.tsx", "popover.tsx", "tooltip.tsx"]) {
      const source = readFileSync(join(SRC, file), "utf8");
      expect(source, file).toMatch(/createPortal|\.Portal/);
    }
  });
});
