"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/* Content blocks: how it works, the milestones, the people, the stories. */

export interface StepItem {
  title: React.ReactNode;
  body?: React.ReactNode;
  icon?: React.ReactNode;
}

const STEP_COLUMNS: Record<1 | 2 | 3 | 4, string> = {
  1: "",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export interface ProcessStepsProps {
  items: StepItem[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  /** `horizontal` numbers across a row; `vertical` stacks with a connector. */
  variant?: "horizontal" | "vertical";
  tone?: SectionTone;
  className?: string;
}

/**
 * "How it works": numbered steps in order.
 *
 * The number is in the markup rather than a CSS counter, because a screen
 * reader should hear "Step 2" and a counter is invisible to it.
 */
export function ProcessSteps({
  items,
  title,
  eyebrow,
  lead,
  variant = "horizontal",
  tone,
  className,
}: ProcessStepsProps) {
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-12" />}
      <ol
        className={cn(
          // A lookup, never a constructed string: Tailwind scans source text, so
          // `"lg:grid-cols-" + n` produces a class that is never generated.
          variant === "horizontal" ? cn("grid gap-8 sm:grid-cols-2", STEP_COLUMNS[Math.min(items.length, 4) as 1 | 2 | 3 | 4]) : "flex flex-col gap-8",
        )}
      >
        {items.map((step, i) => (
          <li
            key={i}
            className={cn("flex gap-4", variant === "horizontal" && "flex-col")}
          >
            <span className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--button-primary)] text-sm font-semibold text-[var(--button-primary-foreground)]">
                <span className="sr-only">Step </span>
                {i + 1}
              </span>
              {step.icon && <span className="text-muted-foreground">{step.icon}</span>}
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="text-h4 font-semibold tracking-tight">{step.title}</span>
              {step.body && <span className="leading-relaxed text-muted-foreground">{step.body}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export interface TimelineItem {
  date: string;
  title: React.ReactNode;
  body?: React.ReactNode;
}

/** Company or product milestones, oldest first unless you reverse the array. */
export function Timeline({
  items,
  title,
  eyebrow,
  lead,
  tone,
  className,
}: {
  items: TimelineItem[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} width="lg" className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} className="mb-12" />}
      <ol className="relative flex flex-col gap-10 border-s border-border ps-8">
        {items.map((item, i) => (
          <li key={i} className="relative">
            {/* The dot sits on the rule, so the line reads as a spine. */}
            <span
              aria-hidden
              className="absolute -start-[2.05rem] top-1.5 size-3 rounded-full border-2 border-background bg-[var(--button-primary)]"
            />
            <p className="text-caption font-medium tracking-wide text-[var(--button-primary)] uppercase">
              {item.date}
            </p>
            <p className="mt-1 text-h4 font-semibold tracking-tight">{item.title}</p>
            {item.body && <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.body}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}

export interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
  links?: { label: string; href: string; icon?: React.ReactNode }[];
}

/** Team or leadership cards. */
export function TeamGrid({
  items,
  title,
  eyebrow,
  lead,
  columns = 4,
  tone,
  className,
}: {
  items: TeamMember[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  columns?: 2 | 3 | 4;
  tone?: SectionTone;
  className?: string;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />}
      <ul className={cn("grid gap-8", cols)}>
        {items.map((m) => (
          <li key={m.name} className="flex flex-col gap-3">
            {m.photo ? (
              <img
                src={m.photo}
                alt=""
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div aria-hidden className="grid aspect-square w-full place-items-center rounded-xl bg-muted text-h2 font-semibold text-muted-foreground">
                {m.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">{m.name}</p>
              {m.role && <p className="text-sm text-muted-foreground">{m.role}</p>}
            </div>
            {m.bio && <p className="text-sm leading-relaxed text-muted-foreground">{m.bio}</p>}
            {m.links && (
              <ul className="flex items-center gap-1">
                {m.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-label={`${m.name} on ${l.label}`}
                      className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {l.icon ?? l.label[0]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export interface TabItem {
  label: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  visual?: React.ReactNode;
}

/**
 * Features behind tabs, for when three or four capabilities each deserve a
 * paragraph and a screenshot.
 *
 * Follows the tab pattern: arrow keys move between tabs, each panel is labelled
 * by its tab, and only the selected tab is in the tab order.
 */
export function FeatureTabs({
  items,
  title,
  eyebrow,
  lead,
  tone,
  className,
}: {
  items: TabItem[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  const id = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  const current = items[active];

  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />}
      <div
        role="tablist"
        aria-label={typeof title === "string" ? title : "Features"}
        onKeyDown={onKeyDown}
        className="vui-scroll mb-8 flex justify-start gap-1 overflow-x-auto rounded-lg bg-muted p-1 sm:justify-center"
      >
        {items.map((item, i) => (
          <button
            key={item.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "cursor-pointer rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              active === i
                ? "bg-background text-foreground shadow-[var(--shadow-1)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {current && (
        <div
          role="tabpanel"
          id={`${id}-panel-${active}`}
          aria-labelledby={`${id}-tab-${active}`}
          className="grid items-center gap-10 md:grid-cols-2"
        >
          <div className="flex flex-col gap-3">
            {current.title && <h3 className="text-h3 font-semibold tracking-tight">{current.title}</h3>}
            {current.body && <p className="leading-relaxed text-muted-foreground">{current.body}</p>}
          </div>
          {current.visual && <div className="min-w-0">{current.visual}</div>}
        </div>
      )}
    </Section>
  );
}

export interface CaseStudyItem {
  title: React.ReactNode;
  /** "How Acme cut onboarding from days to minutes". */
  summary?: React.ReactNode;
  company?: string;
  logo?: React.ReactNode;
  image?: string;
  href: string;
  /** "3× faster", "40% fewer tickets". */
  results?: { value: string; label: string }[];
}

/** Customer stories as cards, with their headline numbers. */
export function CaseStudyGrid({
  items,
  title,
  eyebrow,
  lead,
  tone,
  className,
}: {
  items: CaseStudyItem[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} className="mb-10" />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-1)] transition-colors hover:border-[var(--button-primary)]/50"
          >
            {item.image && (
              <img src={item.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
            )}
            <div className="flex flex-1 flex-col gap-3 p-6">
              {(item.logo || item.company) && (
                <div className="text-sm font-medium text-muted-foreground">{item.logo ?? item.company}</div>
              )}
              <h3 className="text-h4 font-semibold tracking-tight">{item.title}</h3>
              {item.summary && <p className="leading-relaxed text-muted-foreground">{item.summary}</p>}
              {item.results && (
                <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
                  {item.results.map((r) => (
                    <div key={r.label}>
                      <dd className="text-h4 font-semibold tracking-tight">{r.value}</dd>
                      <dt className="text-caption text-muted-foreground">{r.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

/** Benefits: outcome-led rows, phrased for the reader rather than the product. */
export function Benefits({
  items,
  title,
  eyebrow,
  lead,
  tone,
  className,
}: {
  items: { title: React.ReactNode; body?: React.ReactNode; icon?: React.ReactNode }[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} className="mb-10" />}
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {items.map((b, i) => (
          <li key={i} className="flex gap-4">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--button-primary)]/10 text-[var(--button-primary)]">
              {b.icon ?? (
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
                  <path d="M7.6 13.4L4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                </svg>
              )}
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-semibold">{b.title}</span>
              {b.body && <span className="leading-relaxed text-muted-foreground">{b.body}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
