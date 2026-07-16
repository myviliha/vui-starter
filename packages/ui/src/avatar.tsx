import * as React from "react";

import { cn } from "./utils";

export const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-md",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

export const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-muted font-medium text-muted-foreground",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
