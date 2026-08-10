import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/charts/" },
  title: "Charts with Recharts or TanStack Charts",
  description:
    "Add themed charts to Vui Starter with Recharts or TanStack Charts. Both drive every series from the --chart-* design tokens, so charts match your theme and dark mode automatically. TanStack Charts also renders in Vue, Svelte, Solid and Angular.",
};

export default function ChartsPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Charts"
        lead="Vui Starter charts on Recharts, wrapped in a small themed ChartContainer that maps your data keys to the --chart-* tokens. Charts stay in sync with the theme and flip with dark mode, with no per-chart styling to maintain."
      />

      <H2>Why Recharts</H2>
      <P>
        Recharts is the same charting layer shadcn/ui builds on: composable React
        components, SSR-friendly, and driven by CSS variables. Since Vui already
        defines <code>--chart-1</code> through <code>--chart-5</code> for both
        light and dark in <code>theme.css</code>, your charts pick up the palette
        without any extra configuration.
      </P>

      <H2>Install</H2>
      <P>Recharts ships with Vui UI. In a standalone app, install it once:</P>
      <CodeBlock title="terminal">{`npm install recharts`}</CodeBlock>
      <Note title="Monorepo">
        In this repo Recharts is already a dependency of{" "}
        <code>@viliha/vui-ui</code> and the backoffice app, so no install is
        needed.
      </Note>

      <H2>The wrapper</H2>
      <P>
        Import the themed pieces from <code>@viliha/vui-ui/chart</code>, and pull
        the chart primitives (AreaChart, Bar, XAxis, …) straight from{" "}
        <code>recharts</code>.
      </P>
      <Ul>
        <li>
          <strong>ChartContainer</strong>: sets a{" "}
          <code>--color-&lt;key&gt;</code> CSS variable for every entry in your{" "}
          <code>config</code> and wraps a responsive container.
        </li>
        <li>
          <strong>ChartTooltip</strong> / <strong>ChartTooltipContent</strong>:
          a styled tooltip that reads labels and colors from the config.
        </li>
        <li>
          <strong>ChartLegend</strong> / <strong>ChartLegendContent</strong>: a
          styled legend.
        </li>
      </Ul>

      <H2>Area chart</H2>
      <P>
        Define a <code>config</code> keyed by your data keys, then reference the
        variables it generates, such as{" "}
        <code>fill=&quot;var(--color-revenue)&quot;</code>.
      </P>
      <CodeBlock title="revenue-chart.tsx">{`"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@viliha/vui-ui/chart";

const data = [
  { month: "Jan", revenue: 18600 },
  { month: "Feb", revenue: 30500 },
  { month: "Mar", revenue: 23700 },
];

const config: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
};

export function RevenueChart() {
  return (
    <ChartContainer config={config}>
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis width={40} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="revenue"
          type="natural"
          stroke="var(--color-revenue)"
          fill="var(--color-revenue)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}`}</CodeBlock>

      <H3>Bar, line, and pie</H3>
      <P>
        The same wrapper handles every Recharts chart. Swap{" "}
        <code>AreaChart</code>/<code>Area</code> for{" "}
        <code>BarChart</code>/<code>Bar</code>,{" "}
        <code>LineChart</code>/<code>Line</code>, or{" "}
        <code>PieChart</code>/<code>Pie</code>. For a pie, color each slice with a{" "}
        <code>Cell</code> and key the config by slice name, so the tooltip and
        legend pick up the labels.
      </P>
      <CodeBlock title="traffic-donut.tsx">{`import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@viliha/vui-ui/chart";

const data = [
  { name: "Direct", value: 4200, color: "var(--chart-1)" },
  { name: "Organic", value: 5400, color: "var(--chart-3)" },
];

<ChartContainer config={{ Direct: { label: "Direct", color: "var(--chart-1)" } }}>
  <PieChart>
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Pie data={data} dataKey="value" nameKey="name" innerRadius={55}>
      {data.map((d) => (
        <Cell key={d.name} fill={d.color} />
      ))}
    </Pie>
  </PieChart>
</ChartContainer>`}</CodeBlock>

      <Note title="See it live">
        The backoffice demo has a full Charts page (area, bar, line, donut) at{" "}
        <code>/charts</code>.
      </Note>

      <H2>Which should I use, Recharts or TanStack Charts?</H2>
      <P>
        Use <strong>Recharts</strong> if your app is React and stays React. It is
        what <code>ChartContainer</code> wraps, it is what the demo uses, and
        nothing about it is changing.
      </P>
      <P>
        Use <strong>TanStack Charts</strong> if the same chart has to exist in
        more than one framework, or you want a grammar-of-graphics API rather than
        a component per chart type. One definition renders in React, Vue, Svelte,
        Solid, Angular, Lit and Alpine, which is why it is how Vue gets charts at
        all: Recharts is React-only.
      </P>
      <P>
        Both read the same tokens, so they look like the same product. Recharts
        reads <code>--chart-1</code> to <code>--chart-5</code> directly. TanStack
        paints with <code>currentColor</code> and reads its own{" "}
        <code>--ts-chart-*</code> palette, and the <code>.vui-chart</code> class in{" "}
        <code>theme.css</code> maps ours onto those, so light mode, dark mode and a
        per-tenant brand all just work.
      </P>

      <H3>TanStack Charts in React</H3>
      <CodeBlock title="app/(app)/reports/revenue-chart.tsx">{`"use client";

import { defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { TanStackChart } from "@viliha/vui-ui/tanstack-chart";

const revenue = [
  { month: "Jan", revenue: 42_000 },
  { month: "Feb", revenue: 58_000 },
  { month: "Mar", revenue: 76_000 },
];

const chart = defineChart({
  marks: [lineY(revenue, { id: "revenue", x: "month", y: "revenue", points: true })],
  x: { scale: () => scalePoint<string>().padding(0.2) },
  y: { scale: scaleLinear, nice: true, grid: true },
});

export function RevenueChart() {
  return <TanStackChart definition={chart} ariaLabel="Monthly revenue" height={280} />;
}`}</CodeBlock>

      <H3>The same chart in Vue</H3>
      <CodeBlock title="RevenueChart.vue">{`<script setup lang="ts">
import { Chart } from "@viliha/vui-vue";
// \`chart\` is the exact definition from the React example: it is framework-neutral.
import { chart } from "./revenue-definition";
</script>

<template>
  <Chart :definition="chart" aria-label="Monthly revenue" :height="280" />
</template>`}</CodeBlock>
      <P>
        <code>@tanstack/charts</code> is an optional peer dependency of both
        packages, so it only costs you anything if you use it:
      </P>
      <CodeBlock title="terminal">{`npm install @tanstack/charts`}</CodeBlock>
      <Note title="Version">
        TanStack Charts is pre-1.0 (0.9 at the time of writing), so its API can
        still move between minor versions. Recharts stays the safer default for a
        React-only app.
      </Note>

      <DocPager
        prev={{ label: "Data table", href: "/docs/data-table" }}
        next={{ label: "Calendar", href: "/docs/calendar" }}
      />
    </article>
  );
}
