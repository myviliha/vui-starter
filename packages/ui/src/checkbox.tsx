import * as React from "react";

import { CHECKBOX } from "./class-variants";
import { cn } from "./utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(CHECKBOX, className)}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
