"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/**
 * What it will cost, before anyone talks to sales.
 *
 * Usage-based pricing is the one place a marketing page has to do arithmetic in
 * front of the visitor. The rule that keeps it honest: every number on screen
 * comes from the tiers you pass in, so the page cannot quote a price the
 * billing system will not charge.
 *
 * Tiers are graduated by default, the way metered billing usually works: the
 * first 1,000 units are charged at the first tier's rate, the next band at the
 * next rate, and so on. Set `mode="flat"` when the whole volume is charged at
 * the rate of the band it lands in, which is the other common contract.
 */

export interface UsageTier {
  /** First unit in the band, inclusive. The first tier should start at 0. */
  from: number;
  /** Price per unit in this band, in the major currency unit. */
  rate: number;
  /** Overrides the row label. Defaults to "1,000 – 10,000". */
  label?: string;
}

export interface UsageMetric {
  id: string;
  /** "API calls", "Seats", "GB stored". */
  label: string;
  /** Singular unit, used in the summary line. */
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  /** Units included before anything is charged. */
  included?: number;
  tiers: UsageTier[];
  /** Shown under the slider. */
  help?: string;
}

export interface PricingCalculatorProps {
  metrics: UsageMetric[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  /** Charged every month regardless of usage. */
  basePrice?: number;
  /** ISO currency code, for `Intl.NumberFormat`. */
  currency?: string;
  locale?: string;
  /** Under the total. "Billed monthly. Cancel any time." */
  note?: React.ReactNode;
  actions?: React.ReactNode;
  mode?: "graduated" | "flat";
  tone?: SectionTone;
  className?: string;
}

/** Exported because a host that needs the same number server-side should not
 *  reimplement it: quoting one price on the page and another in the invoice is
 *  the failure this whole block exists to avoid. */
export function usageCost(
  units: number,
  tiers: UsageTier[],
  { included = 0, mode = "graduated" }: { included?: number; mode?: "graduated" | "flat" } = {},
): number {
  const billable = Math.max(0, units - included);
  if (billable === 0 || tiers.length === 0) return 0;

  const sorted: UsageTier[] = [...tiers].sort((a, b) => a.from - b.from);
  const first = sorted[0]!;

  if (mode === "flat") {
    const tier = [...sorted].reverse().find((t) => billable >= t.from) ?? first;
    return billable * tier.rate;
  }

  let total = 0;
  for (let i = 0; i < sorted.length; i++) {
    const tier = sorted[i]!;
    const next = sorted[i + 1];
    const end = next ? next.from : Infinity;
    if (billable <= tier.from) break;
    total += (Math.min(billable, end) - tier.from) * tier.rate;
  }
  return total;
}

export function PricingCalculator({
  metrics,
  title,
  eyebrow,
  lead,
  basePrice = 0,
  currency = "USD",
  locale,
  note,
  actions,
  mode = "graduated",
  tone,
  className,
}: PricingCalculatorProps) {
  const [values, setValues] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(metrics.map((m) => [m.id, m.defaultValue ?? m.min ?? 0])),
  );

  const money = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }),
    [locale, currency],
  );
  const number = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const lines = metrics.map((m) => ({
    metric: m,
    units: values[m.id] ?? 0,
    cost: usageCost(values[m.id] ?? 0, m.tiers, { included: m.included, mode }),
  }));
  const total = basePrice + lines.reduce((sum, l) => sum + l.cost, 0);

  return (
    <Section tone={tone} className={className}>
      {title && (
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-1)] sm:p-8">
          {metrics.map((m) => {
            const min = m.min ?? 0;
            const max = m.max ?? 100_000;
            const value = values[m.id] ?? min;
            return (
              <div key={m.id} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={`usage-${m.id}`} className="font-medium">
                    {m.label}
                  </label>
                  <output htmlFor={`usage-${m.id}`} className="text-h4 font-semibold tabular-nums">
                    {number.format(value)}
                  </output>
                </div>
                <input
                  id={`usage-${m.id}`}
                  type="range"
                  min={min}
                  max={max}
                  step={m.step ?? Math.max(1, Math.round((max - min) / 100))}
                  value={value}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [m.id]: Number(e.target.value) }))
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--button-primary)]"
                />
                <div className="flex justify-between text-caption text-muted-foreground">
                  <span>{number.format(min)}</span>
                  <span>{m.help ?? (m.included ? `${number.format(m.included)} included` : "")}</span>
                  <span>{number.format(max)}+</span>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="vui-ring-gradient flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-3)] lg:sticky lg:top-24">
          <p className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
            Estimate
          </p>
          <p className="flex items-baseline gap-1.5">
            <span className="text-display font-semibold tracking-tight tabular-nums">
              {money.format(total)}
            </span>
            <span className="text-muted-foreground">/mo</span>
          </p>
          <ul className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            {basePrice > 0 && (
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Platform fee</span>
                <span className="tabular-nums">{money.format(basePrice)}</span>
              </li>
            )}
            {lines.map((l) => (
              <li key={l.metric.id} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {number.format(l.units)} {l.metric.unit ?? l.metric.label.toLowerCase()}
                </span>
                <span className="tabular-nums">{money.format(l.cost)}</span>
              </li>
            ))}
          </ul>
          {actions && <div className="flex flex-col gap-2 pt-1">{actions}</div>}
          {note && <p className="text-caption text-muted-foreground">{note}</p>}
        </aside>
      </div>
    </Section>
  );
}

/** The tiers behind the estimate, written out. A calculator that will not show
 *  its rate card reads as a sales tactic. */
export function UsagePricingTable({
  metrics,
  currency = "USD",
  locale,
  title,
  eyebrow,
  lead,
  tone,
  className,
}: {
  metrics: UsageMetric[];
  currency?: string;
  locale?: string;
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  const number = new Intl.NumberFormat(locale);
  const rate = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 4,
  });

  return (
    <Section tone={tone} width="lg" className={className}>
      {title && (
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {metrics.map((m) => {
          const sorted = [...m.tiers].sort((a, b) => a.from - b.from);
          return (
            <div key={m.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <p className="font-semibold">{m.label}</p>
                {m.included ? (
                  <p className="text-caption text-muted-foreground">
                    First {number.format(m.included)} free
                  </p>
                ) : null}
              </div>
              <table className="w-full text-sm">
                <caption className="sr-only">{m.label} rates</caption>
                <thead>
                  <tr className="text-caption text-muted-foreground">
                    <th scope="col" className="px-5 py-2 text-start font-medium">Volume</th>
                    <th scope="col" className="px-5 py-2 text-end font-medium">
                      Per {m.unit ?? "unit"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((t, i) => {
                    const next = sorted[i + 1];
                    return (
                      <tr key={t.from} className="border-t border-border">
                        <td className="px-5 py-2.5">
                          {t.label ??
                            (next
                              ? `${number.format(t.from)} – ${number.format(next.from)}`
                              : `${number.format(t.from)}+`)}
                        </td>
                        <td className="px-5 py-2.5 text-end tabular-nums">{rate.format(t.rate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
