"use client";

import dynamic from "next/dynamic";
import { BarChartIcon } from "@radix-ui/react-icons";

import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

// Recharts is heavy and measures the DOM (no SSR benefit), so defer it: the page
// shell paints immediately and the chart bundle loads on the client.
const ChartsContent = dynamic(() => import("./charts-content"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 p-4 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-lg border border-border bg-muted/40"
        />
      ))}
    </div>
  ),
});

export default function ChartsPage() {
  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Charts" icon={BarChartIcon} />

      {/* Action header — breadcrumbs (left) + note (right) */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <Breadcrumbs />
        <span className="hidden truncate text-muted-foreground md:block">
          Themed Recharts examples driven by the --chart-* tokens.
        </span>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChartsContent />
      </div>
    </div>
  );
}
