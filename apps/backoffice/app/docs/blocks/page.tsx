import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { PlanBadge } from "@/components/plan-matrix";
import { PageTitle, H2, P, DocPager } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/blocks/" },
  title: "Blocks",
  description:
    "Prebuilt, full-page compositions: the five VUI page types you assemble screens from.",
};

/** Every shipped block is free. The planned Pro ones are listed separately
 *  below, so "what do I get" is answerable from this page alone. */
const PRO_BLOCKS = [
  "Billing and subscriptions",
  "Roles and permissions",
  "Audit log",
  "Inbox and threads",
];

const BLOCKS = [
  {
    title: "Data table",
    body: "A list of records: RecordView + a fields array. Sorting, filtering, pagination, bulk actions, import/export.",
    href: "/organizations",
  },
  {
    title: "Record form",
    body: "Add / Edit / View a record (slide-over or full-page) generated from the same fields array.",
    href: "/branches",
  },
  {
    title: "Dashboard",
    body: "An overview screen: a StatCard grid over bordered-card sections and charts.",
    href: "/dashboard",
  },
  {
    title: "Settings",
    body: "A single bordered card of sections with a fixed Save footer: a form with a Save button, not a list.",
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
        lead="Blocks are full-page compositions: the five page types you assemble real screens from. Each one is a documented pattern in the reference app; copy it and swap in your data."
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
            <span className="mt-3">
              <PlanBadge plan="free" />
            </span>
          </Link>
        ))}
      </div>

      <H2>Planned for Pro</H2>
      <P>
        Every block above is free and MIT, including the datatable. These four do
        not exist yet and are what VUI Pro would add. They are listed here so the
        line is visible from the page you would look at first, rather than only
        on a pricing page.
      </P>
      <ul className="mb-5 grid gap-2 sm:grid-cols-2">
        {PRO_BLOCKS.map((title) => (
          <li
            key={title}
            className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
          >
            {title}
            <PlanBadge plan="pro" />
          </li>
        ))}
      </ul>
      <P>
        <a href="/docs/free-and-pro" className="font-medium text-foreground underline">
          The full free-versus-Pro breakdown
        </a>{" "}
        covers the theme, layout and components too.
      </P>

      <DocPager
        prev={{ label: "Overview", href: "/docs/components" }}
        next={{ label: "Website blocks", href: "/docs/website" }}
      />
    </article>
  );
}
