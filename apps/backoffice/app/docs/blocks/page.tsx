import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { PageTitle, H2, P, DocPager } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/blocks/" },
  title: "Blocks",
  description:
    "Prebuilt, full-page compositions — the five VUI page types you assemble screens from.",
};

const BLOCKS = [
  {
    title: "Data table",
    body: "A list of records: RecordView + a fields array. Sorting, filtering, pagination, bulk actions, import/export.",
    href: "/organizations",
  },
  {
    title: "Record form",
    body: "Add / Edit / View a record — slide-over or full-page — generated from the same fields array.",
    href: "/branches",
  },
  {
    title: "Dashboard",
    body: "An overview screen: a StatCard grid over bordered-card sections and charts.",
    href: "/dashboard",
  },
  {
    title: "Settings",
    body: "A single bordered card of sections with a fixed Save footer — a form with a Save button, not a list.",
    href: "/settings",
  },
  {
    title: "Board (Kanban)",
    body: "A horizontal row of fixed-width column sections for stage/status pipelines.",
    href: "/crm/opportunities",
  },
];

export default function BlocksPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Blocks"
        lead="Blocks are full-page compositions — the five page types you assemble real screens from. Each one is a documented pattern in the reference app; copy it and swap in your data."
      />

      <H2>Page types</H2>
      <P>
        Pick the block the requirement calls for rather than inventing a sixth.
        Each links to a live example in the demo app.
      </P>
      <div className="grid gap-4 sm:grid-cols-2">
        {BLOCKS.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-[var(--button-primary)]/50 hover:bg-accent/40"
          >
            <span className="flex items-center justify-between">
              <span className="font-medium text-foreground">{b.title}</span>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-colors group-hover:text-[var(--button-primary)]" />
            </span>
            <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {b.body}
            </span>
          </Link>
        ))}
      </div>

      <DocPager
        prev={{ label: "Overview", href: "/docs/components" }}
        next={{ label: "Data table", href: "/docs/data-table" }}
      />
    </article>
  );
}
