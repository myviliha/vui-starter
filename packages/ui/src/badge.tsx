import * as React from "react";

import { cn } from "./utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "muted"
  | "success"
  | "warning"
  | "destructive";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  outline: "border-border text-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
  success:
    "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  warning:
    "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  destructive:
    "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[12px] font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
