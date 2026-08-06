import { type ReactNode } from "react";

import { SITE } from "@/lib/seo";

/** Shared typography for the legal pages, so Terms and Privacy match. */
export function LegalTitle({
  title,
  updated,
  lead,
}: {
  title: string;
  updated: string;
  lead: string;
}) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Last updated {updated} · Applies to {SITE.name}
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">{lead}</p>
    </header>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-20 first:mt-0">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * These pages ship as a starting point, not as advice. Saying so on the page is
 * the honest thing to do, and it tells whoever clones this repo that the text is
 * theirs to replace.
 */
export function TemplateNotice() {
  return (
    <aside className="mt-10 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      <p>
        <strong className="text-foreground">Template text.</strong> This page
        ships with {SITE.name} as a working starting point. It is not legal
        advice. Replace it with terms your own lawyer has reviewed before you put
        this in front of customers.
      </p>
    </aside>
  );
}
