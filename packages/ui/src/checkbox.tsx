import * as React from "react";

import { cn } from "./utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "size-4 shrink-0 cursor-pointer rounded border-input accent-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      className,
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
