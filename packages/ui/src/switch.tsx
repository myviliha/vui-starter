"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { SWITCH_ROOT, SWITCH_THUMB } from "./class-variants";
import { cn } from "./utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(SWITCH_ROOT, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(SWITCH_THUMB)}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
