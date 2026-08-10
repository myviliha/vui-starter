import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";

import Chart from "./src/Chart.vue";

const revenue = [
  { month: "Jan", revenue: 42_000 },
  { month: "Feb", revenue: 58_000 },
  { month: "Mar", revenue: 76_000 },
];

const definition = defineChart({
  marks: [lineY(revenue, { id: "revenue", x: "month", y: "revenue" })],
  x: { scale: () => scalePoint<string>().padding(0.2) },
  y: { scale: scaleLinear, nice: true, grid: true },
});

const render = () =>
  renderToString(
    createSSRApp({
      render: () =>
        h(Chart as never, { definition, ariaLabel: "Monthly revenue", height: 240 }),
    }),
  );

it("renders a chart on the server, so a static export ships real SVG", async () => {
  const html = await render();
  expect(html).toContain("<svg");
  expect(html).toContain('aria-label="Monthly revenue"');
  // The line mark made it into the scene rather than an empty frame.
  expect(html).toMatch(/<path|<polyline/);
});

it("wears the theme instead of TanStack's default palette", async () => {
  const html = await render();
  expect(html).toContain("vui-chart");
  // Card frame comes from the design system's own border and surface tokens.
  expect(html).toContain("border-border");
  expect(html).toContain("bg-card");
});

it("maps every palette slot TanStack reads onto a theme token", () => {
  const css = readFileSync(
    fileURLToPath(new URL("../ui/src/theme.css", import.meta.url)),
    "utf8",
  );
  // TanStack reads six; a missing one silently falls back to its own blue.
  for (const i of [1, 2, 3, 4, 5, 6]) {
    expect(css).toMatch(new RegExp(`--ts-chart-${i}:\\s*var\\(--`));
  }
});
