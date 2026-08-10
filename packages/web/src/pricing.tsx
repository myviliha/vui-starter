"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/* Pricing: the cards, the billing toggle, and the full comparison table. */

export interface PricingPlan {
  name: string;
  /** Shown when the toggle is on "monthly". A string, so "Free" works too. */
  price: string;
  /** Shown when the toggle is on "yearly". Falls back to `price`. */
  priceYearly?: string;
  /** "per user, per month". Rendered next to the price. */
  cadence?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  /** Draws the highlight ring and the badge. Exactly one plan should set it. */
  featured?: boolean;
  badge?: string;
}

export interface PricingProps {
  plans: PricingPlan[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  /** Shows the monthly/yearly switch. Only useful if plans set `priceYearly`. */
  showToggle?: boolean;
  /** "Save 20%" next to the yearly option. */
  yearlyNote?: string;
  /** Rendered under the cards: an enterprise line, a note about VAT. */
  footnote?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}

export function Pricing({
  plans,
  title,
  eyebrow,
  lead,
  showToggle,
  yearlyNote,
  footnote,
  tone,
  className,
}: PricingProps) {
  const [yearly, setYearly] = React.useState(false);

  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-8" />}

      {showToggle && (
        // A radio group rather than a checkbox: two named choices, both visible,
        // both reachable with the arrow keys.
        <div className="mb-10 flex justify-center">
          <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-lg bg-muted p-1">
            {([false, true] as const).map((isYear) => (
              <button
                key={String(isYear)}
                type="button"
                role="radio"
                aria-checked={yearly === isYear}
                onClick={() => setYearly(isYear)}
                className={cn(
                  "cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  yearly === isYear
                    ? "bg-background text-foreground shadow-[var(--shadow-1)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isYear ? "Yearly" : "Monthly"}
                {isYear && yearlyNote && (
                  <span className="ms-1.5 text-caption text-[var(--button-primary)]">{yearlyNote}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "grid items-start gap-6",
          plans.length === 2 && "sm:grid-cols-2",
          plans.length === 3 && "lg:grid-cols-3",
          plans.length >= 4 && "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex h-full flex-col gap-5 rounded-xl border bg-card p-6",
              plan.featured
                ? "border-[var(--button-primary)]/60 shadow-[var(--shadow-3)] ring-1 ring-[var(--button-primary)]/20"
                : "border-border shadow-[var(--shadow-1)]",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-h4 font-semibold tracking-tight">{plan.name}</h3>
              {(plan.badge || plan.featured) && (
                <span className="rounded-full bg-[var(--button-primary)]/10 px-2.5 py-0.5 text-caption font-medium text-[var(--button-primary)]">
                  {plan.badge ?? "Most popular"}
                </span>
              )}
            </div>

            <p className="flex items-baseline gap-1.5">
              <span className="text-h2 font-semibold tracking-tight">
                {yearly ? (plan.priceYearly ?? plan.price) : plan.price}
              </span>
              {plan.cadence && <span className="text-sm text-muted-foreground">{plan.cadence}</span>}
            </p>

            {plan.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
            )}

            <ul className="flex flex-1 flex-col gap-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-4 shrink-0 fill-[var(--button-primary)]">
                    <path d="M7.6 13.4L4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={plan.cta.href}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                plan.featured
                  ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]"
                  : "border border-border bg-background text-foreground hover:bg-accent",
              )}
            >
              {plan.cta.label}
            </a>
          </div>
        ))}
      </div>

      {footnote && <p className="mt-8 text-center text-sm text-muted-foreground">{footnote}</p>}
    </Section>
  );
}

export interface ComparisonRow {
  label: string;
  /** One entry per plan, in the same order as `plans`. `true`/`false` render marks. */
  values: (string | boolean)[];
  /** Groups consecutive rows under a heading. */
  group?: string;
}

export interface ComparisonTableProps {
  plans: string[];
  rows: ComparisonRow[];
  title?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}

/** The full feature matrix. Scrolls horizontally rather than shrinking to unreadable. */
export function ComparisonTable({ plans, rows, title, lead, tone, className }: ComparisonTableProps) {
  let lastGroup: string | undefined;
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader title={title} lead={lead} align="center" className="mb-10" />}
      <div className="vui-scroll overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start">
              <th scope="col" className="px-4 py-3 text-start font-medium">Feature</th>
              {plans.map((p) => (
                <th key={p} scope="col" className="px-4 py-3 text-start font-medium whitespace-nowrap">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const heading = row.group && row.group !== lastGroup ? row.group : null;
              lastGroup = row.group ?? lastGroup;
              return (
                <React.Fragment key={i}>
                  {heading && (
                    <tr className="border-b border-border bg-muted/20">
                      <th scope="colgroup" colSpan={plans.length + 1} className="px-4 py-2 text-start text-caption font-semibold tracking-wide uppercase">
                        {heading}
                      </th>
                    </tr>
                  )}
                  <tr className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-4 py-2.5 text-start font-normal">{row.label}</th>
                    {row.values.map((v, j) => (
                      <td key={j} className="px-4 py-2.5 text-muted-foreground">
                        {typeof v === "boolean" ? (
                          v ? (
                            <>
                              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-[var(--button-primary)]">
                                <path d="M7.6 13.4L4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                              </svg>
                              <span className="sr-only">Included</span>
                            </>
                          ) : (
                            <>
                              <span aria-hidden>&ndash;</span>
                              <span className="sr-only">Not included</span>
                            </>
                          )
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
