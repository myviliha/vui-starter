"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@myviliha/vui-ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@myviliha/vui-ui/chart";

const revenue = [
  { month: "Jan", revenue: 18600, expenses: 12400 },
  { month: "Feb", revenue: 30500, expenses: 13900 },
  { month: "Mar", revenue: 23700, expenses: 9800 },
  { month: "Apr", revenue: 27300, expenses: 15200 },
  { month: "May", revenue: 41900, expenses: 18100 },
  { month: "Jun", revenue: 38400, expenses: 16700 },
];

const deals = [
  { stage: "Lead", deals: 42 },
  { stage: "Qualified", deals: 31 },
  { stage: "Proposal", deals: 24 },
  { stage: "Negotiation", deals: 15 },
  { stage: "Won", deals: 9 },
];

const traffic = [
  { name: "Direct", value: 4200, color: "var(--chart-1)" },
  { name: "Referral", value: 3100, color: "var(--chart-2)" },
  { name: "Organic", value: 5400, color: "var(--chart-3)" },
  { name: "Social", value: 2200, color: "var(--chart-4)" },
  { name: "Email", value: 1600, color: "var(--chart-5)" },
];

const areaConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-3)" },
};
const barConfig: ChartConfig = {
  deals: { label: "Deals", color: "var(--chart-2)" },
};
const lineConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-4)" },
};
const pieConfig: ChartConfig = Object.fromEntries(
  traffic.map((t) => [t.name, { label: t.name, color: t.color }]),
);

const axis = { tickLine: false, axisLine: false, tickMargin: 8 } as const;

export default function ChartsContent() {
  return (
    <div className="grid gap-4 p-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs. expenses</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaConfig}>
            <AreaChart data={revenue} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis width={56} {...axis} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="revenue"
                type="natural"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                dataKey="expenses"
                type="natural"
                stroke="var(--color-expenses)"
                fill="var(--color-expenses)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deals by stage</CardTitle>
          <CardDescription>Current pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barConfig}>
            <BarChart data={deals} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="stage" {...axis} />
              <YAxis width={32} {...axis} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="deals" fill="var(--color-deals)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trend</CardTitle>
          <CardDescription>Revenue vs. expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineConfig}>
            <LineChart data={revenue} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis width={56} {...axis} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="expenses"
                type="monotone"
                stroke="var(--color-expenses)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic sources</CardTitle>
          <CardDescription>Sessions this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieConfig}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Pie
                data={traffic}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                strokeWidth={2}
              >
                {traffic.map((t) => (
                  <Cell key={t.name} fill={t.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
