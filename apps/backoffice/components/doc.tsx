import * as React from "react";

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
        <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {lead && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
    </header>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 scroll-mt-20 border-b border-border pb-2 text-lg font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 text-sm font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed text-foreground">{children}</p>;
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 ml-5 list-disc space-y-1.5 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
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
    <div className="mb-5 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-1.5">
        <span className="truncate font-mono text-[12px] text-muted-foreground">
          {title}
        </span>
        <CopyButton text={children} className="shrink-0" />
      </div>
      <pre className="overflow-x-auto bg-card p-4 font-mono text-[13px] leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** Callout / note box. */
export function Note({
  title,
  children,
  variant = "info",
}: {
  title?: string;
  children: React.ReactNode;
  /** "warning" renders an amber caution callout. */
  variant?: "info" | "warning";
}) {
  const warn = variant === "warning";
  return (
    <div
      className={cn(
        "mb-5 rounded-lg border px-4 py-3 text-sm leading-relaxed",
        warn
          ? "border-amber-500/40 bg-amber-500/10"
          : "border-border bg-muted/40",
      )}
    >
      {title && (
        <p
          className={cn(
            "mb-1 font-medium",
            warn && "text-amber-700 dark:text-amber-400",
          )}
        >
          {warn && "⚠️ "}
          {title}
        </p>
      )}
      <div className="text-muted-foreground">{children}</div>
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
    <nav className="mt-12 flex items-center justify-between border-t border-border pt-6 text-sm">
      {prev ? (
        <a
          href={prev.href}
          className="flex flex-col rounded-md px-3 py-2 transition-colors hover:bg-accent"
        >
          <span className="text-[12px] text-muted-foreground">Previous</span>
          <span className="font-medium">{prev.label}</span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          href={next.href}
          className="flex flex-col rounded-md px-3 py-2 text-right transition-colors hover:bg-accent"
        >
          <span className="text-[12px] text-muted-foreground">Next</span>
          <span className="font-medium">{next.label}</span>
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
