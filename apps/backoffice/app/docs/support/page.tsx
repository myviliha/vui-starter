import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  InlineCode,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/support/" },
  title: "Support & ticketing",
  description:
    "A support-desk page — ticket list with status/priority, a detail pane with a reply thread, and status/priority controls — built from Input, Select, Button and cn on VUI tokens.",
};

export default function SupportDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Support & ticketing"
        lead="A help-desk ticketing system at /support: a searchable, status-filtered ticket queue on the left; a detail pane with the original request and its activity timeline in the middle; and a properties rail — status, priority, requester, assignee — on the right. This isn&apos;t a chat; it&apos;s a ticket workspace."
      />

      <H2>See it live</H2>
      <P>
        Open <a href="/support" className="font-medium text-foreground underline">/support</a>{" "}
        (sidebar → shadcn/ui → Support). Pick a ticket, change its status or
        priority in the properties rail, then reply — a reply flips the ticket to{" "}
        <em>Pending</em>.
      </P>

      <H2>Anatomy</H2>
      <Ul>
        <li>
          <strong>Ticket queue</strong> — a search <InlineCode>Input</InlineCode>{" "}
          (matches subject, ref, or requester) + a status filter{" "}
          <InlineCode>Select</InlineCode> over a scrollable list. Each row shows a
          status badge, priority dot, ref, requester, and last-updated.
        </li>
        <li>
          <strong>Detail + activity</strong> — a header (status badge, ref,
          subject), then the original request followed by a stacked{" "}
          <strong>activity timeline</strong> (avatar + author + role + time +
          text). A reply <InlineCode>textarea</InlineCode> with a Send button sits
          at the bottom.
        </li>
        <li>
          <strong>Properties rail</strong> — editable status &amp; priority{" "}
          <InlineCode>Select</InlineCode>s plus requester, assignee, and last
          updated (hidden below <InlineCode>lg</InlineCode>).
        </li>
      </Ul>

      <H2>Data</H2>
      <CodeBlock title="model">{`type Status = "open" | "pending" | "resolved";
type Priority = "low" | "medium" | "high" | "urgent";
type Comment = { id: number; author: string; role: "agent" | "customer"; text: string; time: string };
type Ticket = {
  id: number;
  ref: string;          // e.g. "TCK-1042"
  subject: string;
  requester: string;
  assignee: string;
  status: Status;
  priority: Priority;
  updated: string;
  description: string;  // the original request
  comments: Comment[];  // the activity timeline
};`}</CodeBlock>

      <H3>Status & priority colors</H3>
      <P>
        Badges and dots use static Tailwind classes keyed by value — the same
        convention as the calendar color labels — so they read consistently in
        both light and dark themes.
      </P>
      <CodeBlock title="badges">{`const STATUS_BADGE: Record<Status, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};`}</CodeBlock>

      <Note title="Wire it to your backend">
        Tickets live in local state. Replace <InlineCode>setTickets</InlineCode>{" "}
        with your API and the queue, detail, and timeline all keep working
        unchanged. A reply sets the status to <em>Pending</em>; adjust that rule
        to match your SLA workflow. When you need sorting, columns, or bulk
        actions, swap the queue for{" "}
        <a href="/docs/data-table" className="font-medium text-foreground underline">RecordView</a>.
      </Note>

      <DocPager
        prev={{ label: "Chat", href: "/docs/chat" }}
        next={{ label: "Auth screens", href: "/docs/auth" }}
      />
    </article>
  );
}
