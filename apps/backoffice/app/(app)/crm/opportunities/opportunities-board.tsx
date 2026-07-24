"use client";

import * as React from "react";
import {
  CalendarIcon as CalendarDays,
  CubeIcon as Building2,
  DragHandleDots2Icon as GripVertical,
  MagnifyingGlassIcon as Search,
  MixerHorizontalIcon as ListFilter,
  PersonIcon as User,
  PlusIcon as Plus,
  TargetIcon as Target,
  TokensIcon as Coins,
  TrashIcon as Trash2,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@viliha/vui-ui/badge";
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { RecordFormPanel, type RecordField } from "@viliha/vui-ui/record-view";
import {
  OPPORTUNITY_STAGES,
  opportunities as initialOpportunities,
  type Opportunity,
  type OpportunityStage,
} from "@/lib/crm-data";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

/** The Add/Edit slide-over is designed from this array — never hand-rolled. */
const OPPORTUNITY_FIELDS: RecordField<Opportunity>[] = [
  { key: "name", label: "Name", icon: Target, editable: true, required: true },
  { key: "company", label: "Company", icon: Building2, editable: true },
  { key: "amount", label: "Amount", icon: Coins, editable: true, input: "number" },
  {
    key: "stage",
    label: "Stage",
    icon: ListFilter,
    editable: true,
    options: OPPORTUNITY_STAGES.map((s) => ({ value: s, label: s })),
  },
  { key: "owner", label: "Owner", icon: User, editable: true },
  { key: "closeDate", label: "Close date", icon: CalendarDays, editable: true, input: "date" },
];

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

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
  // A card created via "add" but not yet saved — Cancel/close removes it.
  const [newId, setNewId] = React.useState<number | null>(null);
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
    setNewId(row.id);
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
    <div className="flex h-full flex-col">
      <SetPageTitle title="Opportunities" icon={Target} />
      {/* Actions row — breadcrumbs (left) + actions (right) */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <Breadcrumbs />
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search…"
              aria-label="Search opportunities"
              className="h-7 w-40 pl-7 sm:w-56"
            />
          </div>
          <Button size="sm" onClick={() => createInStage(OPPORTUNITY_STAGES[0])}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Opportunity</span>
          </Button>
        </div>
      </div>

      {/* Summary bar — a bordered box whose left/right edges line up with the
          board padding below; metrics separated by icons + dividers. */}
      <div className="shrink-0 px-4 pt-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <ListFilter className="size-4 text-muted-foreground" />
            All opportunities
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <span className="flex items-center gap-1.5 tabular-nums text-foreground">
            <Target className="size-3.5 text-muted-foreground" />
            {visible.length}
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <span className="flex items-center gap-1.5 tabular-nums text-foreground">
            <Coins className="size-3.5 text-muted-foreground" />
            {formatCurrency(totalValue)} pipeline
          </span>
        </div>
      </div>

      {/* Board — full-bleed with a 5px gutter */}
      <div className="min-h-0 flex-1 overflow-x-auto p-4">
        <div className="flex h-full gap-4">
        {OPPORTUNITY_STAGES.map((stage) => {
          const stageItems = byStage(stage);
          const total = stageItems.reduce((sum, item) => sum + item.amount, 0);
          const isDropTarget = dropStage === stage;
          return (
            <section
              key={stage}
              className="flex h-full w-72 shrink-0 flex-col gap-3"
              aria-label={stage}
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Badge variant={STAGE_BADGE[stage]}>{stage}</Badge>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 tabular-nums text-muted-foreground">
                    {stageItems.length}
                  </span>
                </div>
                <span className="tabular-nums text-muted-foreground">
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
                  "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg border border-dashed border-border bg-muted/30 p-2 transition-colors",
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
                      onDelete={() => deleteItem(item.id)}
                      onDragStart={() => setDragId(item.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setDropStage(null);
                      }}
                    />
                  ))
                ) : (
                  <p className="px-2 py-6 text-center text-muted-foreground">
                    No opportunities
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => createInStage(stage)}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-3.5" />
                  Add opportunity
                </button>
              </div>
            </section>
          );
        })}
        </div>
      </div>

      {activeItem && (
        <RecordFormPanel<Opportunity>
          fields={OPPORTUNITY_FIELDS}
          row={activeItem}
          singular="Opportunity"
          title="Opportunities"
          icon={Target}
          isNew={activeItem.id === newId}
          getPrimary={(o) => ({
            title: o.name || "Untitled opportunity",
            initials: initials(o.name || "Opportunity"),
            subtitle: o.company || undefined,
          })}
          onSave={(draft) => {
            // The panel edits values as strings; coerce the numeric field back.
            updateItem(activeItem.id, {
              ...draft,
              amount: Number(draft.amount) || 0,
            });
            setNewId(null);
            setActiveId(null);
          }}
          onCancel={() => {
            // Discard a never-saved new card entirely.
            if (activeItem.id === newId) deleteItem(activeItem.id);
            setNewId(null);
            setActiveId(null);
          }}
        />
      )}
    </div>
  );
}

function OpportunityCard({
  item,
  dragging,
  onOpen,
  onDelete,
  onDragStart,
  onDragEnd,
}: {
  item: Opportunity;
  dragging: boolean;
  onOpen: () => void;
  onDelete: () => void;
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
        "group relative cursor-grab rounded-md border border-border bg-card p-3 shadow-sm transition-colors hover:border-ring/40 active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`Delete ${item.name || "opportunity"}`}
        title="Delete"
        className="absolute right-1 top-1 grid size-6 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>
      <div className="flex items-start gap-1.5 pr-5">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left focus-visible:outline-none"
        >
          <p className="truncate font-medium hover:underline">
            {item.name || "Untitled opportunity"}
          </p>
          <p className="truncate text-muted-foreground">
            {item.company || "No company"}
          </p>
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between pl-5">
        <span className="font-semibold tabular-nums">
          {formatCurrency(item.amount)}
        </span>
        <span className="truncate text-muted-foreground">
          {item.owner || "Unassigned"}
        </span>
      </div>
    </article>
  );
}
