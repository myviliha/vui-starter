import type { Metadata } from "next";

import { PageTitle, H2, P, DocPager } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/typeset/" },
  title: "Typeset",
  description:
    "The documentation typography — the Geist type scale used across these docs.",
};

const SCALE = [
  { cls: "text-5xl font-semibold tracking-tight", label: "Display / 5xl" },
  { cls: "text-3xl font-semibold tracking-tight", label: "Heading 1 / 3xl" },
  { cls: "text-xl font-semibold tracking-tight", label: "Heading 2 / xl" },
  { cls: "text-base font-medium", label: "Heading 3 / base medium" },
  { cls: "text-sm text-muted-foreground", label: "Body / sm muted" },
];

export default function TypesetPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Typeset"
        lead="These docs are set in Geist (Sans + Mono), scoped to the documentation section. The admin app keeps its own brand typography. Below is the type scale used here."
      />

      <H2>Type scale</H2>
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        {SCALE.map((s) => (
          <div key={s.label}>
            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className={s.cls}>The quick brown fox jumps over the lazy dog</p>
          </div>
        ))}
      </div>

      <H2>Weights</H2>
      <div className="space-y-2 rounded-lg border border-border bg-card p-6 text-lg">
        <p className="font-normal">Regular — 400</p>
        <p className="font-medium">Medium — 500</p>
        <p className="font-semibold">Semibold — 600</p>
        <p className="font-bold">Bold — 700</p>
      </div>

      <H2>Monospace</H2>
      <P>
        Code uses Geist Mono. Inline:{" "}
        <code className="rounded-[4px] border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em]">
          @viliha/vui-ui
        </code>
        .
      </P>
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{`import { Button } from "@viliha/vui-ui/button";

export function Save() {
  return <Button variant="primary">Save</Button>;
}`}</code>
      </pre>

      <DocPager
        prev={{ label: "Theming", href: "/docs/theming" }}
        next={{ label: "Layout & patterns", href: "/docs/layout" }}
      />
    </article>
  );
}
