import * as React from "react";

import {
  BADGE_BASE,
  BADGE_VARIANTS,
  type BadgeVariant,
} from "./class-variants";
import { cn } from "./utils";

export type { BadgeVariant };

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(BADGE_BASE, BADGE_VARIANTS[variant], className)}
      {...props}
    />
  );
}
