"use client";

import * as React from "react";
import { Chart, type ChartDefinition } from "@tanstack/charts/react";

import { cn } from "./utils";

/**
 * A TanStack chart wearing the theme.
 *
 * TanStack Charts ships no theme of its own: it paints with `currentColor` and
 * reads six CSS variables for the categorical palette. The `vui-chart` class in
 * `theme.css` maps our tokens onto those names, so a chart follows light and
 * dark mode and a per-tenant brand with no colour props here and no chart
 * config to keep in sync.
 *
 * Why this exists next to `ChartContainer` (Recharts): Recharts is React-only,
 * and the same definition passed to this component also renders in Vue, Svelte,
 * Solid and Angular. Reach for TanStack when a chart has to exist in more than
 * one framework, or when you want the grammar-of-graphics API. `ChartContainer`
 * is unchanged and is still the right choice for existing Recharts code.
 *
 * `@tanstack/charts` is an optional peer dependency: install it only if you use
 * this component.
 */
export interface TanStackChartProps {
  /** Built with `defineChart` from `@tanstack/charts`. */
  definition: ChartDefinition;
  /** Required: a chart with no accessible name is unusable to a screen reader. */
  ariaLabel: string;
  ariaDescription?: string;
  height?: number;
  aspectRatio?: number;
  /** Render inside a bordered card, like the rest of the design system. */
  card?: boolean;
  className?: string;
}

export function TanStackChart({
  definition,
  ariaLabel,
  ariaDescription,
  height,
  aspectRatio,
  card = true,
  className,
}: TanStackChartProps) {
  return (
    <Chart
      definition={definition}
      ariaLabel={ariaLabel}
      ariaDescription={ariaDescription}
      height={height}
      aspectRatio={aspectRatio}
      // React's adapter puts `className` on the outer host; Vue's uses `class`
      // there and reserves `className` for the SVG surface. The class has to be
      // on the host, so the palette variables cascade into the whole chart.
      className={cn(
        "vui-chart w-full",
        card && "rounded-lg border border-border bg-card p-4",
        className,
      )}
    />
  );
}
