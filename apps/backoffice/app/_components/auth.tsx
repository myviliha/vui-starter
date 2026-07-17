import * as React from "react";

import { cn } from "@/lib/utils";

/** Multicolor Google "G" (brand mark — colors are intentional). */
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.38Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.1 0 5.7-1.03 7.6-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.88 1.1-2.98 0-5.5-2.01-6.4-4.72H1.75v2.97A11.5 11.5 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.71a6.9 6.9 0 0 1 0-4.42V7.32H1.75a11.5 11.5 0 0 0 0 10.36l3.85-2.97Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.68 0 3.19.58 4.38 1.71l3.28-3.28C17.7 1.19 15.1 0 12 0 7.44 0 3.5 2.62 1.75 6.42l3.85 2.97C6.5 6.76 9.02 4.75 12 4.75Z"
      />
    </svg>
  );
}

/** "or" separator between provider buttons and the email form. */
export function OrDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-1 text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Labeled form field with optional hint / error text. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** Circular icon badge used on confirmation screens ("check your email"). */
export function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
      {children}
    </div>
  );
}

/**
 * Sectioned auth card — the same header / body / footer treatment as the app's
 * dialogs (bordered sections), so every auth screen is consistent and reusable.
 * Compose: <AuthCard><AuthCardHeader …/><AuthCardBody>…</AuthCardBody>
 * <AuthCardFooter>…</AuthCardFooter></AuthCard>.
 */
export function AuthCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Bordered header section: optional icon badge, title, optional description. */
export function AuthCardHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-muted/40 px-5 py-4 text-center">
      {icon && (
        <div className="mb-3">
          <IconBadge>{icon}</IconBadge>
        </div>
      )}
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/** Content section. */
export function AuthCardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-5 py-5", className)}>{children}</div>;
}

/** Bordered actions/footer section. */
export function AuthCardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-t border-border bg-muted/40 px-5 py-4", className)}>
      {children}
    </div>
  );
}
