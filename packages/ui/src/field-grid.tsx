import * as React from "react";

import { cn } from "./utils";
import { RequiredMark } from "./required-mark";

/**
 * The form design standard — **two columns: label │ control, one row per
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
 * column 1 and its control in column 2. **Must be a direct child of
 * {@link FieldGrid}** — it uses `display: contents` so the label and control
 * become the grid's own cells and align across every row.
 */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** Helper text under the control. */
  hint?: string;
  /** Extra classes on the control cell (column 2). */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // display:contents → label + control cell become direct FieldGrid cells.
    <div className="contents">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 whitespace-nowrap text-sm font-medium leading-relaxed"
      >
        {label}
        {required && <RequiredMark />}
      </label>
      <div className={cn("min-w-0", className)}>
        {children}
        {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
