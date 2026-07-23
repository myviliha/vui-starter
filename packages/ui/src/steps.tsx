import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "./utils";

export type Step = {
  /** Short title shown under the marker. */
  label: string;
  /** Optional secondary line under the label. */
  description?: string;
};

/**
 * A horizontal, numbered step indicator for multi-step forms / wizards.
 * Presentational and controlled: pass the steps and the current index. Completed
 * steps fill with the brand primary and a check; the current step is ringed;
 * upcoming steps are muted. All color comes from theme tokens.
 *
 * ```tsx
 * <Steps
 *   current={step}
 *   steps={[
 *     { label: "Organization", description: "Business details" },
 *     { label: "Account", description: "Your credentials" },
 *     { label: "Review", description: "Confirm details" },
 *   ]}
 * />
 * ```
 */
export function Steps({
  steps,
  current,
  className,
}: {
  steps: Step[];
  /** Zero-based index of the active step. */
  current: number;
  className?: string;
}) {
  return (
    <ol
      className={cn("flex items-start", className)}
      aria-label={`Step ${current + 1} of ${steps.length}`}
    >
      {steps.map((step, i) => {
        const state =
          i < current ? "complete" : i === current ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={step.label}>
            <li
              className="flex flex-col items-center gap-2 text-center"
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold transition-colors",
                  state === "complete" &&
                    "border-transparent bg-[var(--button-primary)] text-[var(--button-primary-foreground)]",
                  state === "current" &&
                    "border-[var(--button-primary)] text-[var(--button-primary)]",
                  state === "upcoming" &&
                    "border-border bg-background text-muted-foreground",
                )}
              >
                {state === "complete" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm font-medium leading-none",
                    state === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </span>
            </li>
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "mt-4 h-0.5 min-w-6 flex-1 rounded-full transition-colors",
                  i < current ? "bg-[var(--button-primary)]" : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}
