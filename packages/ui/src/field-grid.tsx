"use client";

import * as React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { cn } from "./utils";
import { RequiredMark } from "./required-mark";
import { Tooltip } from "./tooltip";

/**
 * The form design standard: **two columns, label │ control, one row per
 * field**, labels left-aligned and sized to the longest label (`max-content`)
 * so the control sits right beside the label with no dead space, and every
 * label lines up across rows. Wrap a group of {@link Field}s in it.
 *
 * ```tsx
 * <FieldGrid>
 *   <Field label="Name" htmlFor="name" required>
 *     <Input id="name" … />
 *   </Field>
 * </FieldGrid>
 * ```
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
        "grid grid-cols-[max-content_1fr] items-center gap-x-4 gap-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One field row: a left-aligned label (with an optional required mark) in
 * column 1 and its control (`Input`, `Textarea`, `Select`, …) in column 2.
 * **Must be a direct child of {@link FieldGrid}.**
 *
 * Pass `error` to show the theme's inline validation: the control border turns
 * red (via its `aria-invalid` styling) and an alert-triangle carries the message
 * in a tooltip, with **no layout shift** and the full text announced to screen
 * readers. The error **clears the moment the user edits the field** and re-arms
 * on the next blur or form submit, so pages just set `error` and never clear it
 * on change. Pair it with `useFormFields` for the validation itself. Set
 * `multiline` when the control is a `Textarea` so the icon sits at the top.
 */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  multiline,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** Helper text under the control (hidden while an error shows). */
  hint?: string;
  /** Inline validation message. Falsy = valid. */
  error?: string;
  /** Position the alert icon at the top (for a `Textarea`) instead of centered. */
  multiline?: boolean;
  /** Extra classes on the control cell (column 2). */
  className?: string;
  children: React.ReactNode;
}) {
  const errorId = React.useId();

  // Auto-clear on edit: hide the error the moment the user changes the field,
  // instead of leaving it up until the next validation. It re-arms when a new
  // error arrives (the `error` value changes) or the enclosing form submits.
  const [edited, setEdited] = React.useState(false);
  React.useEffect(() => setEdited(false), [error]);
  const showError = Boolean(error) && !edited;

  const anchorRef = React.useRef<HTMLLabelElement>(null);
  React.useEffect(() => {
    const form = anchorRef.current?.closest("form");
    if (!form) return;
    const rearm = () => setEdited(false);
    form.addEventListener("submit", rearm);
    return () => form.removeEventListener("submit", rearm);
  }, []);

  // Wire aria-invalid / aria-describedby onto the control and intercept its
  // onChange to trigger the auto-clear. The control's own onChange still runs.
  const el = React.isValidElement(children)
    ? (children as React.ReactElement<{
        "aria-invalid"?: boolean;
        "aria-describedby"?: string;
        onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
      }>)
    : null;
  const control = el
    ? React.cloneElement(el, {
        "aria-invalid": showError ? true : undefined,
        "aria-describedby": showError ? errorId : undefined,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          if (error) setEdited(true);
          el.props.onChange?.(e);
        },
      })
    : children;

  return (
    // display:contents → label + control cell become direct FieldGrid cells.
    <div className="contents">
      <label
        ref={anchorRef}
        htmlFor={htmlFor}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap text-sm font-medium leading-relaxed",
          multiline && "self-start pt-1.5",
        )}
      >
        {label}
        {required && <RequiredMark />}
      </label>
      <div className={cn("min-w-0", className)}>
        {/* Leave room for the alert icon so it never overlaps the text. */}
        <div
          className={cn(
            "relative",
            showError && "[&_input]:pr-8 [&_textarea]:pr-8",
          )}
        >
          {control}
          {showError && (
            <Tooltip
              content={error}
              className={cn(
                "absolute right-2 text-destructive",
                multiline ? "top-2.5" : "top-1/2 -translate-y-1/2",
              )}
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
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}
