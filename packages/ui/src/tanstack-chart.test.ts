import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Source-text assertions, like z-layers.test.ts: these rules are about which
// element carries which class, which no unit test of the rendered output would
// catch without a browser.
// __dirname, not import.meta: this package compiles to CommonJS.
const chart = readFileSync(join(__dirname, "tanstack-chart.tsx"), "utf8");
const theme = readFileSync(join(__dirname, "theme.css"), "utf8");

describe("TanStack chart theming", () => {
  it("puts the palette class on the host, using React's prop name", () => {
    // The two adapters disagree: React's `className` lands on the outer host,
    // while Vue's `class` does and its `className` targets the SVG surface.
    // Using `class` here silently drops the theme in React.
    expect(chart).toMatch(/className=\{cn\(\s*"vui-chart/);
    expect(chart).not.toMatch(/\n\s+class=\{/);
  });

  it("maps every palette slot TanStack reads onto a theme token", () => {
    // TanStack reads six categorical colours. A missing one falls back to its
    // own default blue, which is off-theme and easy to miss on a busy chart.
    for (const i of [1, 2, 3, 4, 5, 6]) {
      expect(theme).toMatch(new RegExp(`--ts-chart-${i}:\\s*var\\(--`));
    }
    // Foreground drives axes, grids and labels through currentColor.
    expect(theme).toMatch(/\.vui-chart\s*\{[^}]*color:\s*var\(--foreground\)/);
  });
});
