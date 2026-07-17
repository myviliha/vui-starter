import {
  ArrowBottomRightIcon as ArrowDownRight,
  ArrowRightIcon as ArrowRight,
  ArrowTopRightIcon as ArrowUpRight,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

type StatCardProps = {
  label: string;
  value: string | number;
  delta: string;
  trend: Trend;
  className?: string;
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

export function StatCard({
  label,
  value,
  delta,
  trend,
  className,
}: StatCardProps) {
  const TrendIcon = trendIcon[trend];
  return (
    <div className={cn("p-4", className)}>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1 font-medium",
          trendColor[trend],
        )}
      >
        <TrendIcon className="size-3.5" aria-hidden="true" />
        {delta}
      </p>
    </div>
  );
}
