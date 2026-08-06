import { describe, expect, it } from "vitest";

import {
  applyTheme,
  FONT_FAMILIES,
  mergeThemes,
  parseHex,
  parseTheme,
  readableOn,
  THEME_FIELDS,
  themeToCssVars,
} from "./theme-config";

describe("parseHex", () => {
  it("reads both hex forms", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("#266DF0")).toEqual([38, 109, 240]);
    expect(parseHex("  #000000 ")).toEqual([0, 0, 0]);
  });

  it("returns null for anything else, including the oklch values we ship", () => {
    expect(parseHex("oklch(0.577 0.245 27.325)")).toBeNull();
    expect(parseHex("red")).toBeNull();
    expect(parseHex("#12345")).toBeNull();
  });
});

describe("readableOn", () => {
  it("puts white on dark brands and near-black on light ones", () => {
    expect(readableOn("#266df0")).toBe("#ffffff"); // the shipped blue
    expect(readableOn("#000000")).toBe("#ffffff");
    expect(readableOn("#ffffff")).toBe("#101112");
    expect(readableOn("#fde047")).toBe("#101112"); // yellow: the case that bites
  });

  it("falls back to white for a colour it can't read", () => {
    expect(readableOn("oklch(0.6 0.1 250)")).toBe("#ffffff");
  });
});

describe("themeToCssVars", () => {
  it("maps a value onto the field's variable", () => {
    expect(themeToCssVars({ radius: "1rem" })["--radius"]).toBe("1rem");
  });

  it("picks the text colour from the brand when it isn't set", () => {
    expect(themeToCssVars({ brand: "#ffffff" })["--button-primary-foreground"]).toBe(
      "#101112",
    );
  });

  it("keeps an explicit text colour", () => {
    const vars = themeToCssVars({ brand: "#ffffff", brandForeground: "#ff0000" });
    expect(vars["--button-primary-foreground"]).toBe("#ff0000");
  });

  it("resolves a font id to its variable plus fallbacks", () => {
    expect(themeToCssVars({ fontSans: "inter" })["--font-sans-choice"]).toContain(
      "var(--font-inter)",
    );
    // The system stack has no loaded family, so no var() wrapper.
    expect(themeToCssVars({ fontSans: "system" })["--font-sans-choice"]).not.toContain(
      "var(",
    );
    expect(themeToCssVars({ fontSans: "nope" })["--font-sans-choice"]).toBeUndefined();
  });

  it("wraps an asset in url()", () => {
    expect(themeToCssVars({ logo: "https://cdn/logo.svg" })["--brand-logo"]).toBe(
      'url("https://cdn/logo.svg")',
    );
  });

  it("skips empty values rather than writing blanks", () => {
    expect(themeToCssVars({ brand: "" })).toEqual({});
  });
});

describe("parseTheme", () => {
  it("keeps known string keys and drops everything else", () => {
    expect(
      parseTheme({ brand: "#fff", nope: "x", radius: 4, logo: "u" }),
    ).toEqual({ brand: "#fff", logo: "u" });
  });

  it("refuses values that could break out of a style attribute", () => {
    // A stored theme is user input, and these land in a CSS variable.
    expect(parseTheme({ brand: "red; background: url(x)" })).toEqual({});
    expect(parseTheme({ brand: "}" })).toEqual({});
  });

  it("survives junk", () => {
    expect(parseTheme(null)).toEqual({});
    expect(parseTheme("nope")).toEqual({});
    expect(parseTheme([])).toEqual({});
  });
});

describe("mergeThemes", () => {
  it("lets the user's value win over the organization's, key by key", () => {
    expect(
      mergeThemes({ brand: "#111", radius: "1rem" }, { brand: "#222" }),
    ).toEqual({ brand: "#222", radius: "1rem" });
  });

  it("ignores empty overrides, so unsetting falls back to the org", () => {
    expect(mergeThemes({ brand: "#111" }, { brand: "" })).toEqual({
      brand: "#111",
    });
  });
});

describe("applyTheme", () => {
  it("does nothing outside a browser instead of throwing", () => {
    expect(() => applyTheme({ brand: "#fff" }, null)).not.toThrow();
  });
});

describe("THEME_FIELDS", () => {
  it("has a unique key and variable per entry", () => {
    const keys = THEME_FIELDS.map((f) => f.key);
    const vars = THEME_FIELDS.map((f) => f.cssVar);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(vars).size).toBe(vars.length);
  });
});

describe("FONT_FAMILIES", () => {
  it("has a unique id and a fallback stack for every entry", () => {
    const ids = FONT_FAMILIES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const family of FONT_FAMILIES) {
      expect(family.stack, family.id).not.toBe("");
      expect(family.label, family.id).not.toBe("");
    }
  });

  it("names a CSS variable for every family the app has to load", () => {
    // "system" is the one that needs no loading. Everything else names a
    // variable the app must define, or picking it does nothing.
    for (const family of FONT_FAMILIES) {
      if (family.id === "system") {
        expect(family.variable).toBe("");
        continue;
      }
      expect(family.variable, family.id).toMatch(/^--font-[a-z0-9-]+$/);
    }
  });
});
