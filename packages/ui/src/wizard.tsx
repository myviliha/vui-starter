"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "./utils";
import { Button } from "./button";
import { Steps, type Step } from "./steps";

export type { Step as WizardStep } from "./steps";

/** Icon component accepted by {@link WizardSection}. */
type IconType = React.ComponentType<{ className?: string }>;

export interface WizardProps {
  /** Named steps ("workflows") — drives the stepper. One entry per step. */
  steps: Step[];
  /** Zero-based index of the active step (you own this state + all logic). */
  current: number;
  /** The active step's body — compose it from {@link WizardSection}s. */
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  /** Footer button contents — pass a node to fully customise (e.g. the final
   *  step's "Create account"). Defaults include Back/Next arrows. */
  backLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  /** Replace the whole Back/Next footer. */
  footer?: React.ReactNode;
  /** Hide the footer (e.g. on a success screen). */
  hideFooter?: boolean;
  className?: string;
}

/**
 * A multi-step **wizard scaffold** — the layout only. It renders the stepper
 * (from `steps` + `current`), a scrolling body for the active step, and a
 * Back/Next footer; you own the step index, the field state, and all logic, and
 * you drop your own components inside {@link WizardSection}s. Fields inside a
 * section should use `FieldGrid` / `Field` (`@viliha/vui-ui/field-grid`) so they
 * follow the two-column design standard.
 *
 * ```tsx
 * <Wizard steps={STEPS} current={step}
 *   onBack={() => setStep((s) => s - 1)}
 *   onNext={() => (last ? submit() : setStep((s) => s + 1))}
 *   backDisabled={step === 0}
 *   nextLabel={last ? "Create account" : undefined}
 * >
 *   <WizardSection title="Basic Information" icon={Building}>
 *     <FieldGrid>
 *       <Field label="Name" htmlFor="name" required>
 *         <Input id="name" value={name} onChange={…} />
 *       </Field>
 *     </FieldGrid>
 *   </WizardSection>
 * </Wizard>
 * ```
 */
export function Wizard({
  steps,
  current,
  children,
  onBack,
  onNext,
  backLabel,
  nextLabel,
  backDisabled,
  nextDisabled,
  footer,
  hideFooter,
  className,
}: WizardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      {/* Stepper — fixed at the top. */}
      <div className="shrink-0 border-b border-border p-4 md:p-6">
        <Steps steps={steps} current={current} />
      </div>

      {/* Active step body — the only scrolling region. */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-4">{children}</div>
      </div>

      {!hideFooter &&
        (footer ?? (
          <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/40 px-4 py-3">
            <Button onClick={onBack} disabled={backDisabled}>
              {backLabel ?? (
                <>
                  <ArrowLeftIcon className="size-4" />
                  Back
                </>
              )}
            </Button>
            <Button variant="primary" onClick={onNext} disabled={nextDisabled}>
              {nextLabel ?? (
                <>
                  Next
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </Button>
          </div>
        ))}
    </div>
  );
}

/**
 * A bordered section inside a wizard step — an optional muted header
 * (title + icon + description) over a padded body. Put one or many per step;
 * fill the body with `FieldGrid` / `Field` rows or any content.
 */
export function WizardSection({
  title,
  description,
  icon: Icon,
  className,
  children,
}: {
  title?: string;
  description?: string;
  icon?: IconType;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      {title && (
        <div className="border-b border-border bg-muted/40 px-3 py-2">
          <h3 className="flex items-center gap-2 font-semibold text-[var(--button-primary)]">
            {Icon && <Icon className="size-4 text-[var(--button-primary)]" />}
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
