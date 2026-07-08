import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@repo/ui/card";

type Trend = "up" | "down" | "flat";

type StatCardProps = {
  label: string;
  value: string | number;
  delta: string;
  trend: Trend;
};

const trendIcon: Record<Trend, typeof ArrowRight> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
};

const trendColor: Record<Trend, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

export function StatCard({ label, value, delta, trend }: StatCardProps) {
  const TrendIcon = trendIcon[trend];
  return (
    <Card className="p-4">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1 text-[12px] font-medium",
          trendColor[trend],
        )}
      >
        <TrendIcon className="size-3.5" aria-hidden="true" />
        {delta}
      </p>
    </Card>
  );
}
