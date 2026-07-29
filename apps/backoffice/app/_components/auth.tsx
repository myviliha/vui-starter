import * as React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { RequiredMark } from "@viliha/vui-ui/required-mark";
import { Tooltip } from "@viliha/vui-ui/tooltip";

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

/**
 * Two-column layout for a set of `Field`s: labels align in column 1, inputs in
 * column 2, so every input starts at the same x (a clean table look). Wrap a
 * form's fields in this. Column 1 is `max-content` (as wide as the longest
 * label), column 2 fills the rest.
 */
export function FieldGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[max-content_1fr] items-center gap-x-3 gap-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Labeled form field with optional required marker / hint / error text. Must
 *  be rendered inside a {@link FieldGrid} — it emits its label and input as two
 *  grid cells (`display: contents`) so labels/inputs line up across rows.
 *
 *  A validation `error` does NOT push layout: the input border turns red and an
 *  alert icon inside the input carries the message in a tooltip (the full text
 *  is also announced to screen readers via `aria-describedby`). */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const errorId = React.useId();
  // Auto-clear on edit (built in, so pages get it for free): the moment the user
  // changes the field, hide the error — red border AND icon — instead of leaving
  // it up until the next submit. It re-arms when a new validation result arrives
  // (the `error` value changes) or on the next form submit, so resubmitting a
  // still-invalid value shows the error again even if the message is identical.
  const [edited, setEdited] = React.useState(false);
  React.useEffect(() => setEdited(false), [error]);
  const showError = Boolean(error) && !edited;

  // Re-validate on submit: reset the edited flag when the enclosing form submits,
  // so `showError` reflects the parent's fresh validation.
  const anchorRef = React.useRef<HTMLLabelElement>(null);
  React.useEffect(() => {
    const form = anchorRef.current?.closest("form");
    if (!form) return;
    const rearm = () => setEdited(false);
    form.addEventListener("submit", rearm);
    return () => form.removeEventListener("submit", rearm);
  }, []);

  // Wire aria-invalid / aria-describedby onto the control, and intercept its
  // onChange to trigger the auto-clear — the caller wires nothing.
  const el = React.isValidElement(children)
    ? (children as React.ReactElement<{
        "aria-invalid"?: boolean;
        "aria-describedby"?: string;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
      }>)
    : null;
  const control = el
    ? React.cloneElement(el, {
        "aria-invalid": showError ? true : undefined,
        "aria-describedby": showError ? errorId : undefined,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (error) setEdited(true); // hide the error as soon as they type
          el.props.onChange?.(e);
        },
      })
    : children;

  return (
    // display:contents → the label + input become direct cells of the parent
    // FieldGrid (column 1 = label, column 2 = input), not a nested box.
    <div className="contents">
      <label
        ref={anchorRef}
        htmlFor={htmlFor}
        className="flex items-center gap-1 whitespace-nowrap font-medium leading-relaxed"
      >
        {label}
        {required && <RequiredMark />}
      </label>
      <div className="min-w-0">
        {/* The red border/ring comes from the Input's own `aria-invalid` styling
            (set on `control` above); here we just leave room for the alert icon. */}
        <div className={cn("relative", showError && "[&_input]:pr-8")}>
          {control}
          {showError && (
            <Tooltip
              content={error}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-destructive"
            >
              <ExclamationTriangleIcon className="size-4" aria-hidden="true" />
            </Tooltip>
          )}
        </div>
        {/* Full message for screen readers (visual users get the tooltip). */}
        {showError && (
          <span id={errorId} className="sr-only">
            {error}
          </span>
        )}
        {hint && !showError && (
          <p className="mt-1.5 text-muted-foreground">{hint}</p>
        )}
      </div>
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
  return (
    <div className={cn("space-y-4 px-5 py-6 leading-relaxed", className)}>
      {children}
    </div>
  );
}

/** Secondary nav row in a footer (e.g. "New here? Sign up") — set off from the
 *  primary action by its own top divider for a clean, consistent hierarchy. */
export function AuthCardAside({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-4 space-y-3 border-t border-border pt-4 text-center leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
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
