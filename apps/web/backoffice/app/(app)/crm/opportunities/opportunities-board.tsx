"use client";

import * as React from "react";
import {
  Building2,
  CalendarDays,
  Coins,
  GripVertical,
  ListFilter,
  Plus,
  Search,
  Target,
  Trash2,
  User,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  OPPORTUNITY_STAGES,
  opportunities as initialOpportunities,
  type Opportunity,
  type OpportunityStage,
} from "@/lib/crm-data";
import { Dropdown, DropdownItem, DropdownLabel } from "@repo/ui/dropdown-menu";
import { SidebarExpandButton } from "@/app/_components/app-sidebar";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STAGE_BADGE: Record<
  OpportunityStage,
  "muted" | "secondary" | "warning" | "default" | "success"
> = {
  Lead: "muted",
  Qualified: "secondary",
  Proposal: "warning",
  Negotiation: "default",
  Won: "success",
};

let idCounter = 1_000_000;

export function OpportunitiesBoard() {
  const [items, setItems] = React.useState<Opportunity[]>(initialOpportunities);
  const [filter, setFilter] = React.useState("");
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const [dragId, setDragId] = React.useState<number | null>(null);
  const [dropStage, setDropStage] = React.useState<OpportunityStage | null>(null);

  const q = filter.trim().toLowerCase();
  const visible = q
    ? items.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q) ||
          o.owner.toLowerCase().includes(q),
      )
    : items;

  const byStage = (stage: OpportunityStage) =>
    visible.filter((item) => item.stage === stage);

  const activeItem = items.find((o) => o.id === activeId) ?? null;
  const totalValue = visible.reduce((sum, o) => sum + o.amount, 0);

  function createInStage(stage: OpportunityStage) {
    const row: Opportunity = {
      id: idCounter++,
      name: "Untitled opportunity",
      company: "",
      amount: 0,
      stage,
      owner: "",
      closeDate: "",
    };
    setItems((prev) => [...prev, row]);
    setActiveId(row.id);
  }

  function updateItem(id: number, patch: Partial<Opportunity>) {
    setItems((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    );
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((o) => o.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function moveToStage(id: number, stage: OpportunityStage) {
    updateItem(id, { stage });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SidebarExpandButton />
          <Target className="size-5 text-muted-foreground" />
          <h1 className="text-[12px] font-semibold tracking-tight">Opportunities</h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] font-medium tabular-nums text-muted-foreground">
            {visible.length}
          </span>
          <span className="text-[12px] tabular-nums text-muted-foreground">
            · {formatCurrency(totalValue)} pipeline
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search…"
              aria-label="Search opportunities"
              className="h-8 w-40 pl-7 text-[12px] sm:w-56"
            />
          </div>
          <Button size="sm" onClick={() => createInStage(OPPORTUNITY_STAGES[0])}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New opportunity</span>
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {OPPORTUNITY_STAGES.map((stage) => {
          const stageItems = byStage(stage);
          const total = stageItems.reduce((sum, item) => sum + item.amount, 0);
          const isDropTarget = dropStage === stage;
          return (
            <section
              key={stage}
              className="flex w-72 shrink-0 flex-col gap-3"
              aria-label={stage}
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Badge variant={STAGE_BADGE[stage]}>{stage}</Badge>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[12px] tabular-nums text-muted-foreground">
                    {stageItems.length}
                  </span>
                </div>
                <span className="text-[12px] tabular-nums text-muted-foreground">
                  {formatCurrency(total)}
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropStage(stage);
                }}
                onDragLeave={(e) => {
                  // Only clear when leaving the column, not entering a child.
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDropStage((prev) => (prev === stage ? null : prev));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId !== null) moveToStage(dragId, stage);
                  setDragId(null);
                  setDropStage(null);
                }}
                className={cn(
                  "flex min-h-32 flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-2 transition-colors",
                  isDropTarget && "border-ring/60 bg-accent/50",
                )}
              >
                {stageItems.length ? (
                  stageItems.map((item) => (
                    <OpportunityCard
                      key={item.id}
                      item={item}
                      dragging={dragId === item.id}
                      onOpen={() => setActiveId(item.id)}
                      onDragStart={() => setDragId(item.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setDropStage(null);
                      }}
                    />
                  ))
                ) : (
                  <p className="px-2 py-6 text-center text-[12px] text-muted-foreground">
                    No opportunities
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => createInStage(stage)}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-3.5" />
                  Add opportunity
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {activeItem && (
        <OpportunityDetailPanel
          item={activeItem}
          onChange={(patch) => updateItem(activeItem.id, patch)}
          onDelete={() => deleteItem(activeItem.id)}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}

function OpportunityCard({
  item,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  item: Opportunity;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(item.id));
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group cursor-grab rounded-md border border-border bg-card p-3 shadow-sm transition-colors hover:border-ring/40 active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left focus-visible:outline-none"
        >
          <p className="truncate text-[12px] font-medium hover:underline">
            {item.name || "Untitled opportunity"}
          </p>
          <p className="truncate text-[12px] text-muted-foreground">
            {item.company || "No company"}
          </p>
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between pl-5">
        <span className="text-[12px] font-semibold tabular-nums">
          {formatCurrency(item.amount)}
        </span>
        <span className="truncate text-[12px] text-muted-foreground">
          {item.owner || "Unassigned"}
        </span>
      </div>
    </article>
  );
}

interface DetailProps {
  item: Opportunity;
  onChange: (patch: Partial<Opportunity>) => void;
  onDelete: () => void;
  onClose: () => void;
}

function OpportunityDetailPanel({
  item,
  onChange,
  onDelete,
  onClose,
}: DetailProps) {
  return (
    <aside
      aria-label="Opportunity details"
      className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l border-border bg-background shadow-xl sm:w-[380px] sm:max-w-[90vw]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <Target className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-[12px] font-semibold">
          {item.name || "Untitled opportunity"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
          className="ml-auto"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <div className="space-y-3">
          <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
            Fields
          </p>

          <Field label="Name">
            <Input
              value={item.name}
              onChange={(e) => onChange({ name: e.target.value })}
              aria-label="Name"
              className="h-8 text-[12px]"
            />
          </Field>

          <Field label="Company" icon={Building2}>
            <Input
              value={item.company}
              onChange={(e) => onChange({ company: e.target.value })}
              aria-label="Company"
              className="h-8 text-[12px]"
            />
          </Field>

          <Field label="Amount" icon={Coins}>
            <Input
              type="number"
              min={0}
              value={item.amount}
              onChange={(e) => onChange({ amount: Number(e.target.value) || 0 })}
              aria-label="Amount"
              className="h-8 text-[12px] tabular-nums"
            />
          </Field>

          <Field label="Stage" icon={ListFilter}>
            <Dropdown label={item.stage} align="start" active>
              <DropdownLabel>Move to stage</DropdownLabel>
              {OPPORTUNITY_STAGES.map((s) => (
                <DropdownItem
                  key={s}
                  checked={item.stage === s}
                  onSelect={() => onChange({ stage: s })}
                >
                  {s}
                </DropdownItem>
              ))}
            </Dropdown>
          </Field>

          <Field label="Owner" icon={User}>
            <Input
              value={item.owner}
              onChange={(e) => onChange({ owner: e.target.value })}
              aria-label="Owner"
              className="h-8 text-[12px]"
            />
          </Field>

          <Field label="Close date" icon={CalendarDays}>
            <Input
              type="date"
              value={item.closeDate}
              onChange={(e) => onChange({ closeDate: e.target.value })}
              aria-label="Close date"
              className="h-8 text-[12px]"
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="w-full"
        >
          <Trash2 className="size-4" />
          Delete opportunity
        </Button>
      </div>
    </aside>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </span>
      {children}
    </div>
  );
}
