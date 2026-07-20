import * as React from "react";

import { cn } from "./utils";

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

// Standard button: white background + border; on hover only the icon activates
// (muted → foreground). Shared by default/secondary/outline for one consistent look.
const NEUTRAL =
  "border border-border bg-background text-foreground [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground";

const VARIANTS: Record<ButtonVariant, string> = {
  default: NEUTRAL,
  primary:
    "border border-transparent bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)] [&_svg]:border-[var(--button-primary-hover)]",
  secondary: NEUTRAL,
  outline: NEUTRAL,
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const SIZES: Record<ButtonSize, string> = {
  default: "h-8 px-3",
  sm: "h-7 rounded-sm px-2.5",
  lg: "h-9 px-4",
  icon: "size-8",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";
