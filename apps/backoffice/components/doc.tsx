import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { CopyButton } from "@/components/copy-button";

/** Lightweight documentation prose primitives (Tailwind typography not required). */

export function PageTitle({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      {eyebrow && (
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--button-primary)]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </h1>
      {lead && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
    </header>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 scroll-mt-20 border-b border-border pb-2 text-lg font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 scroll-mt-20 text-sm font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed text-foreground">{children}</p>;
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 ml-5 list-disc space-y-1.5 text-sm leading-relaxed text-foreground marker:text-[var(--button-primary)]">
      {children}
    </ul>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[4px] border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  title,
}: {
  children: string;
  title?: string;
}) {
  return (
    <div className="mb-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-4 py-2">
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-[var(--button-primary)]/70"
            />
            <span className="truncate font-mono text-[12px] text-muted-foreground">
              {title}
            </span>
          </span>
          <CopyButton text={children} className="shrink-0" />
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{children}</code>
      </pre>
    </div>
  );
}

type NoteVariant = "info" | "warning" | "tip" | "danger";

const NOTE_STYLES: Record<
  NoteVariant,
  { box: string; bar: string; title: string; badge: string }
> = {
  info: {
    box: "border-border bg-muted/40",
    bar: "bg-[var(--button-primary)]",
    title: "text-foreground",
    badge: "",
  },
  warning: {
    box: "border-amber-500/40 bg-amber-500/10",
    bar: "bg-amber-500",
    title: "text-amber-700 dark:text-amber-400",
    badge: "⚠️ ",
  },
  tip: {
    box: "border-emerald-500/40 bg-emerald-500/10",
    bar: "bg-emerald-500",
    title: "text-emerald-700 dark:text-emerald-400",
    badge: "💡 ",
  },
  danger: {
    box: "border-red-500/40 bg-red-500/10",
    bar: "bg-red-500",
    title: "text-red-700 dark:text-red-400",
    badge: "⛔ ",
  },
};

/** Callout / note box with a leading accent bar. */
export function Note({
  title,
  children,
  variant = "info",
}: {
  title?: string;
  children: React.ReactNode;
  variant?: NoteVariant;
}) {
  const s = NOTE_STYLES[variant];
  return (
    <div
      className={cn(
        "mb-5 flex gap-3 overflow-hidden rounded-lg border py-3 pl-3 pr-4 text-sm leading-relaxed",
        s.box,
      )}
    >
      <span aria-hidden className={cn("w-1 shrink-0 rounded-full", s.bar)} />
      <div className="min-w-0">
        {title && (
          <p className={cn("mb-1 font-semibold", s.title)}>
            {s.badge}
            {title}
          </p>
        )}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

/** Next/prev footer navigation between doc pages. */
export function DocPager({
  prev,
  next,
}: {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}) {
  return (
    <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-border pt-6 text-sm">
      {prev ? (
        <a
          href={prev.href}
          className="group flex flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2.5 transition-colors hover:border-[var(--button-primary)]/50 hover:bg-accent"
        >
          <ChevronLeftIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--button-primary)]" />
          <span className="flex flex-col">
            <span className="text-[12px] text-muted-foreground">Previous</span>
            <span className="font-medium text-foreground">{prev.label}</span>
          </span>
        </a>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <a
          href={next.href}
          className="group flex flex-1 items-center justify-end gap-2 rounded-lg border border-border px-3 py-2.5 text-right transition-colors hover:border-[var(--button-primary)]/50 hover:bg-accent"
        >
          <span className="flex flex-col">
            <span className="text-[12px] text-muted-foreground">Next</span>
            <span className="font-medium text-foreground">{next.label}</span>
          </span>
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--button-primary)]" />
        </a>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
