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

/**
 * The picture, when there is one. It sits over the fallback, so a slow or broken
 * image shows the initials rather than an empty box: on error the image removes
 * itself and whatever is underneath is what you see.
 */
export const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, onError, src, alt = "", ...props }, ref) => {
  const [failed, setFailed] = React.useState(false);
  // A new src deserves a fresh attempt, even if the previous one failed.
  React.useEffect(() => setFailed(false), [src]);
  if (!src || failed) return null;
  return (
    // A plain <img>: the package is framework-agnostic, so a host that wants
    // next/image composes its own on top of Avatar.
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("absolute inset-0 z-10 size-full object-cover", className)}
      {...props}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

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
