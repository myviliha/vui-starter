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
  title: "Charts",
  description:
    "Add themed charts to Vui Starter with Recharts. The ChartContainer wrapper drives every series from the --chart-* design tokens, so charts match your theme and dark mode automatically.",
};

export default function ChartsPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Charts"
        lead="Vui Starter uses Recharts for data visualisation, wrapped in a small themed ChartContainer that maps your data keys to the --chart-* tokens. Charts stay in sync with the theme and flip with dark mode — no per-chart styling."
      />

      <H2>Why Recharts</H2>
      <P>
        Recharts is the same charting layer shadcn/ui builds its charts on:
        composable React components, SSR-friendly, and driven by CSS variables.
        Because Vui already defines <code>--chart-1</code> through{" "}
        <code>--chart-5</code> (light and dark) in{" "}
        <code>theme.css</code>, charts adopt the palette with zero extra config.
      </P>

      <H2>Install</H2>
      <P>Recharts ships with Vui UI. In a standalone app, add it once:</P>
      <CodeBlock title="terminal">{`npm install recharts`}</CodeBlock>
      <Note title="Monorepo">
        In this repo Recharts is already a dependency of{" "}
        <code>@viliha/vui-ui</code> and the backoffice app — no install needed.
      </Note>

      <H2>The wrapper</H2>
      <P>
        Import the themed pieces from{" "}
        <code>@viliha/vui-ui/chart</code> and the chart primitives (AreaChart,
        Bar, XAxis, …) straight from <code>recharts</code>.
      </P>
      <Ul>
        <li>
          <strong>ChartContainer</strong> — sets a{" "}
          <code>--color-&lt;key&gt;</code> CSS variable for every entry in your{" "}
          <code>config</code> and wraps a responsive container.
        </li>
        <li>
          <strong>ChartTooltip</strong> / <strong>ChartTooltipContent</strong> —
          a styled tooltip that reads labels and colors from the config.
        </li>
        <li>
          <strong>ChartLegend</strong> / <strong>ChartLegendContent</strong> — a
          styled legend.
        </li>
      </Ul>

      <H2>Area chart</H2>
      <P>
        Define a <code>config</code> keyed by your data keys, then reference the
        generated variables with <code>fill=&quot;var(--color-revenue)&quot;</code>.
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
        The same wrapper works for every Recharts chart — swap{" "}
        <code>AreaChart</code>/<code>Area</code> for{" "}
        <code>BarChart</code>/<code>Bar</code>,{" "}
        <code>LineChart</code>/<code>Line</code>, or{" "}
        <code>PieChart</code>/<code>Pie</code>. For a pie, color each slice with a{" "}
        <code>Cell</code> and key the config by slice name so the tooltip and
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

      <DocPager
        prev={{ label: "Data table", href: "/docs/data-table" }}
        next={{ label: "Contributing", href: "/docs/contributing" }}
      />
    </article>
  );
}
