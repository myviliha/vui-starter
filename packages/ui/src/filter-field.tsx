import * as React from "react";

import { cn } from "./utils";

/**
 * The theme's filter layout — **two columns: label │ control, one row per
 * field**, with labels aligned across every row. This is the enforced default
 * for every filter panel; compose filters with these instead of hand-rolling a
 * layout, so the design principle can't be styled away.
 *
 * `RecordView`'s Filter panel renders its `filterable` fields with these, and
 * you can add your own rows via `RecordView`'s `filterExtras` prop (or build a
 * standalone panel):
 *
 * ```tsx
 * <FilterGrid>
 *   <FilterField label="Name"><Input … /></FilterField>
 *   <FilterField label="Country"><Select … /></FilterField>
 * </FilterGrid>
 * ```
 */
export function FilterGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(4.5rem,max-content)_1fr] items-center gap-x-3 gap-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One filter row: a label and its control side by side. **Must be a direct
 * child of {@link FilterGrid}** — it uses `display: contents` so the label and
 * control become the grid's own cells (column 1 = label, column 2 = control),
 * lining up across every row.
 */
export function FilterField({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  /** Extra classes on the control cell (column 2). */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // display:contents → label + control cell become direct FilterGrid cells.
    <div className="contents">
      <label
        htmlFor={htmlFor}
        className="whitespace-nowrap text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      <div className={cn("min-w-0", className)}>{children}</div>
    </div>
  );
}
