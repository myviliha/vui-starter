import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The Vue half of the design system's stacking rules, kept identical to
 * `packages/ui/src/z-layers.test.ts`.
 *
 * Both packages render into the same z-scale, defined once at the top of
 * `theme.css`. A Vue menu that picks its own layer is invisible inside a
 * slide-over for exactly the same reason a React one is, and the fix is the
 * same, so the check is the same. This reads source text, so it works on
 * `.vue` files with no renderer involved.
 */
const SCALE = new Set([10, 20, 30, 55, 60, 70, 80, 100, 200, 210, 220, 250]);
const Z_CLASS = /\bz-\[(\d+)\]|\bz-(\d+)\b/g;

const SRC = fileURLToPath(new URL("./src", import.meta.url));
const files = readdirSync(SRC).filter((f) => f.endsWith(".vue"));

/**
 * Components reference shared class strings (`POPOVER_CONTENT`) rather than
 * spelling them out, so expand those before checking, exactly as the React
 * package's copy of this test does. Otherwise every assertion below passes on a
 * file that renders the wrong thing.
 */
const CONSTANTS = new Map<string, string>();
for (const match of readFileSync(
  fileURLToPath(new URL("../ui/src/class-variants.ts", import.meta.url)),
  "utf8",
).matchAll(
  /export const ([A-Z0-9_]+)(?::[^=]+)? =\s*(?:\[([\s\S]*?)\]\.join\(" "\)|"([\s\S]*?)")/g,
)) {
  CONSTANTS.set(match[1]!, (match[2] ?? match[3] ?? "").replace(/",\s*"/g, " "));
}

const read = (file: string) =>
  readFileSync(join(SRC, file), "utf8").replace(
    /\b[A-Z][A-Z0-9_]{2,}\b/g,
    (name) => CONSTANTS.get(name) ?? name,
  );

// Floating components arrive with the rest of wave B; each list is checked only
// for the files that exist, so this guard is in place before they land rather
// than bolted on afterwards.
const present = (names: string[]) => names.filter((n) => files.includes(n));

describe("floating surfaces", () => {
  it("every floating panel uses the same surface, never a dark bubble", () => {
    for (const file of present([
      "Tooltip.vue",
      "PopoverContent.vue",
      "DropdownMenuContent.vue",
      "SelectContent.vue",
      "HoverCardContent.vue",
    ])) {
      expect(read(file), file).toContain("bg-popover");
      expect(read(file), file).not.toContain("bg-primary ");
    }
  });

  it("every backdrop is the themed scrim, not hard black", () => {
    for (const file of present(["Dialog.vue", "AlertDialog.vue", "Sheet.vue"])) {
      expect(read(file), file).toContain("bg-foreground/25");
      expect(read(file), file).not.toContain("bg-black/");
    }
  });
});

describe("stacking order", () => {
  it("every z-index in the package is on the documented scale", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const match of read(file).matchAll(Z_CLASS)) {
        const value = Number(match[1] ?? match[2]);
        if (!SCALE.has(value)) offenders.push(`${file}: z-${value}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("pickers and menus clear the slide-over they open inside", () => {
    for (const file of present([
      "SelectContent.vue",
      "Combobox.vue",
      "DropdownMenuContent.vue",
      "PopoverContent.vue",
    ])) {
      expect(read(file), file).toContain("z-[200]");
    }
  });

  it("floating content is portalled, so no scrolling ancestor can clip it", () => {
    // Reka's portal component is the equivalent of Radix's; without it, a menu
    // is clipped by the nearest overflow-hidden ancestor at any z-index.
    for (const file of present([
      "SelectContent.vue",
      "Combobox.vue",
      "DropdownMenuContent.vue",
      "PopoverContent.vue",
      "Tooltip.vue",
      "Dialog.vue",
    ])) {
      expect(read(file), file).toMatch(/Portal/);
    }
  });
});
