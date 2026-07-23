"use client";

import * as React from "react";
import { format } from "date-fns";
import { PaperPlaneIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { Select } from "@viliha/vui-ui/select";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

type Status = "open" | "pending" | "resolved";
type Priority = "low" | "medium" | "high" | "urgent";
type Comment = {
  id: number;
  author: string;
  role: "agent" | "customer";
  text: string;
  time: string;
};
type Ticket = {
  id: number;
  ref: string;
  subject: string;
  requester: string;
  assignee: string;
  status: Status;
  priority: Priority;
  updated: string;
  description: string;
  comments: Comment[];
};

// Status + priority colors — static Tailwind (content colors, not chrome).
const STATUS_BADGE: Record<Status, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};
const PRIORITY_DOT: Record<Priority, string> = {
  low: "bg-slate-400",
  medium: "bg-sky-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};
const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];
const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const FIRST_TICKET: Ticket = {
  id: 1,
  ref: "TCK-1042",
  subject: "Invoice not received for June",
  requester: "Ava Chen",
  assignee: "You",
  status: "open",
  priority: "high",
  updated: "10 min ago",
  description:
    "Hi, I haven't received my June invoice yet. My billing email is ava@acme.co. Can you resend it and confirm the amount?",
  comments: [
    { id: 1, author: "You", role: "agent", text: "Hi Ava — checking now, I'll resend within the hour.", time: "9:20 AM" },
  ],
};

const SEED: Ticket[] = [
  FIRST_TICKET,
  {
    id: 2,
    ref: "TCK-1041",
    subject: "Cannot reset my password",
    requester: "Marcus Reed",
    assignee: "Unassigned",
    status: "pending",
    priority: "urgent",
    updated: "1 hr ago",
    description: "The reset link says expired every time I click it, even immediately after requesting a new one.",
    comments: [],
  },
  {
    id: 3,
    ref: "TCK-1038",
    subject: "Feature request: CSV export",
    requester: "Priya Nair",
    assignee: "You",
    status: "resolved",
    priority: "low",
    updated: "Yesterday",
    description: "Would love a CSV export on the reports page for offline analysis.",
    comments: [
      { id: 1, author: "You", role: "agent", text: "Shipped in 1.1.7 🎉", time: "Yesterday" },
    ],
  },
];

export default function SupportPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>(SEED);
  const [activeId, setActiveId] = React.useState(FIRST_TICKET.id);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [draft, setDraft] = React.useState("");

  const active = tickets.find((t) => t.id === activeId) ?? FIRST_TICKET;
  const q = query.trim().toLowerCase();
  const filtered = tickets.filter(
    (t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (t.subject.toLowerCase().includes(q) ||
        t.ref.toLowerCase().includes(q) ||
        t.requester.toLowerCase().includes(q)),
  );

  const patch = (data: Partial<Ticket>) =>
    setTickets((prev) => prev.map((t) => (t.id === activeId ? { ...t, ...data } : t)));

  const addReply = () => {
    const text = draft.trim();
    if (!text) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              status: "pending",
              updated: "just now",
              comments: [
                ...t.comments,
                { id: Date.now(), author: "You", role: "agent", text, time: format(new Date(), "h:mm a") },
              ],
            }
          : t,
      ),
    );
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Support" icon={QuestionMarkCircledIcon} />
      <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
        <Breadcrumbs />
      </div>

      <div className="flex min-h-0 flex-1 p-4">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card">
          {/* Ticket queue */}
          <aside className="flex w-80 shrink-0 flex-col border-r border-border">
            <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tickets…"
                aria-label="Search tickets"
              />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={[{ value: "all", label: "All statuses" }, ...STATUS_OPTIONS]}
                ariaLabel="Filter by status"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-accent/40",
                    t.id === activeId && "bg-accent/60",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{t.subject}</span>
                    <StatusBadge status={t.status} />
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn("size-2 shrink-0 rounded-full", PRIORITY_DOT[t.priority])} />
                    <span className="tabular-nums">{t.ref}</span>
                    <span>·</span>
                    <span className="truncate">{t.requester}</span>
                    <span className="ml-auto shrink-0">{t.updated}</span>
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No tickets found.
                </p>
              )}
            </div>
          </aside>

          {/* Ticket detail */}
          <section className="flex min-w-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={active.status} />
                <span className="text-xs tabular-nums text-muted-foreground">
                  {active.ref}
                </span>
              </div>
              <h2 className="mt-1 truncate text-base font-semibold">{active.subject}</h2>
            </header>

            <div className="flex min-h-0 flex-1">
              {/* Conversation + activity */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
                  {/* Original request */}
                  <Entry
                    author={active.requester}
                    kind="customer"
                    time="Opened this ticket"
                    text={active.description}
                  />
                  {active.comments.map((c) => (
                    <Entry key={c.id} author={c.author} kind={c.role} time={c.time} text={c.text} />
                  ))}
                </div>
                {/* Reply */}
                <div className="shrink-0 border-t border-border p-4">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a reply…"
                    aria-label="Reply"
                    rows={3}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button variant="primary" onClick={addReply} disabled={!draft.trim()}>
                      <PaperPlaneIcon className="size-4" />
                      Send reply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Properties */}
              <aside className="hidden w-60 shrink-0 flex-col gap-4 border-l border-border p-4 lg:flex">
                <Prop label="Status">
                  <Select
                    value={active.status}
                    onValueChange={(v) => patch({ status: v as Status })}
                    options={STATUS_OPTIONS}
                    ariaLabel="Status"
                  />
                </Prop>
                <Prop label="Priority">
                  <Select
                    value={active.priority}
                    onValueChange={(v) => patch({ priority: v as Priority })}
                    options={PRIORITY_OPTIONS}
                    ariaLabel="Priority"
                  />
                </Prop>
                <Prop label="Requester">
                  <p className="text-sm">{active.requester}</p>
                </Prop>
                <Prop label="Assignee">
                  <p className="text-sm">{active.assignee}</p>
                </Prop>
                <Prop label="Last updated">
                  <p className="text-sm text-muted-foreground">{active.updated}</p>
                </Prop>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function Entry({
  author,
  kind,
  time,
  text,
}: {
  author: string;
  kind: "agent" | "customer";
  time: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-white",
          kind === "agent" ? "bg-[var(--button-primary)]" : "bg-slate-500",
        )}
      >
        {initials(author)}
      </span>
      <div className="min-w-0 flex-1 rounded-lg border border-border bg-background p-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-muted-foreground">
            {kind === "agent" ? "Agent" : "Customer"} · {time}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        STATUS_BADGE[status],
      )}
    >
      {status}
    </span>
  );
}
