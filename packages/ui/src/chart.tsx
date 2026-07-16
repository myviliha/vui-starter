"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip, Legend } from "recharts";

import { cn } from "./utils";

/**
 * Themed Recharts wrapper for the Vui design system.
 *
 * ponytail: a compact token-driven wrapper, not the full shadcn chart.tsx —
 * covers container + tooltip + legend for area/bar/line/pie demos. Swap in the
 * upstream shadcn `chart` component if you need indicator variants / nameKey.
 *
 * Each `config` entry maps a data key to a label + color. The container exposes
 * every color as a `--color-<key>` CSS variable so series can reference
 * `stroke="var(--color-revenue)"` and stay in sync with the theme tokens
 * (`--chart-1 … --chart-5`).
 */
export type ChartConfig = Record<string, { label: string; color: string }>;

const ChartConfigContext = React.createContext<ChartConfig>({});

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  /** A single Recharts chart element (AreaChart, BarChart, PieChart, …). */
  children: React.ReactElement;
}) {
  const cssVars = Object.fromEntries(
    Object.entries(config).map(([key, v]) => [`--color-${key}`, v.color]),
  ) as React.CSSProperties;

  return (
    <ChartConfigContext.Provider value={config}>
      <div
        style={cssVars}
        className={cn(
          "aspect-video w-full text-xs [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-text]:fill-muted-foreground",
          className,
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartConfigContext.Provider>
  );
}

type TooltipEntry = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

/** Styled tooltip. Pass as `content={<ChartTooltipContent />}` to a `<Tooltip>`. */
export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}) {
  const config = React.useContext(ChartConfigContext);
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-32 rounded-md border border-border bg-popover px-2.5 py-2 text-popover-foreground shadow-md">
      {label != null && (
        <p className="mb-1.5 font-medium">{String(label)}</p>
      )}
      <div className="space-y-1">
        {payload.map((item, i) => {
          // Recharts fills `name` with the series `name` (defaults to dataKey)
          // for cartesian charts, and the slice's nameKey for pies.
          const key = String(item.name ?? item.dataKey ?? i);
          const conf = config[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ background: item.color ?? conf?.color }}
                />
                {conf?.label ?? item.name ?? key}
              </span>
              <span className="font-mono font-medium text-foreground">
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type LegendEntry = { value?: string; color?: string; dataKey?: string | number };

/** Styled legend. Pass as `content={<ChartLegendContent />}` to a `<Legend>`. */
export function ChartLegendContent({ payload }: { payload?: LegendEntry[] }) {
  const config = React.useContext(ChartConfigContext);
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      {payload.map((item, i) => {
        // Legend payload uses `value` for the label (series name / pie slice
        // name); a pie gives every entry the same `dataKey` ("value"), so key
        // off `value` (with index as a guaranteed-unique fallback).
        const key = String(item.value ?? item.dataKey ?? i);
        const conf = config[key];
        return (
          <span
            key={`${key}-${i}`}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: item.color ?? conf?.color }}
            />
            {conf?.label ?? item.value ?? key}
          </span>
        );
      })}
    </div>
  );
}

/** Re-export the raw Recharts `Tooltip`/`Legend` so consumers get them from one place. */
export { Tooltip as ChartTooltip, Legend as ChartLegend };
