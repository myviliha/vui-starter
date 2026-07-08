"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Copy,
  CopyPlus,
  GripVertical,
  ListFilter,
  type LucideIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Rows3,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Dropdown, DropdownItem, DropdownLabel } from "./dropdown-menu";

type RowId = string | number;
type FieldGroup = "General" | "Work" | "Social" | "System";
const GROUP_ORDER: FieldGroup[] = ["General", "Work", "Social", "System"];

/** Fixed (non-resizable) leading/trailing column widths, in px. */
const CHECKBOX_W = 44;
const ACTIONS_W = 80;
const NAME_COL = "__name";
const NAME_DEFAULT_W = 190;
const MIN_COL_W = 80;
const PAGE_SIZES = [10, 25, 50, 100] as const;
/** Fallback column-header icon so every column title shows an icon. */
const DEFAULT_FIELD_ICON = Circle;

function fieldDefaultWidth<T>(field: RecordField<T>): number {
  return field.width ?? (field.align === "right" ? 110 : 160);
}

const PageChromeContext = React.createContext<{
  titleLeading?: React.ReactNode;
}>({});

/**
 * Provides a node rendered immediately before the page title in every
 * RecordView header (e.g. a sidebar-expand toggle shown only when collapsed).
 */
export function PageChromeProvider({
  titleLeading,
  children,
}: {
  titleLeading?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PageChromeContext.Provider value={{ titleLeading }}>
      {children}
    </PageChromeContext.Provider>
  );
}

export interface RecordField<T> {
  key: Extract<keyof T, string>;
  label: string;
  icon?: LucideIcon;
  editable?: boolean;
  align?: "left" | "right";
  group?: FieldGroup;
  /** Initial column width in px (user-resizable via the header handle). */
  width?: number;
  /** Show a copy-to-clipboard action on hover (e.g. email, phone). */
  copyable?: boolean;
  /** Show in the detail panel only, not as a table column (e.g. first/last name). */
  hideInTable?: boolean;
  /** Custom, non-editable cell/value renderer. */
  render?: (row: T) => React.ReactNode;
}

interface RecordViewProps<T extends { id: RowId }> {
  title: string;
  singular: string;
  icon?: LucideIcon;
  fields: RecordField<T>[];
  initialData: T[];
  makeEmptyRow: () => T;
  getPrimary: (row: T) => {
    title: string;
    initials: string;
    subtitle?: string;
  };
}

export function RecordView<T extends { id: RowId }>({
  title,
  singular,
  icon: TitleIcon,
  fields,
  initialData,
  makeEmptyRow,
  getPrimary,
}: RecordViewProps<T>) {
  const { titleLeading } = React.useContext(PageChromeContext);
  const [rows, setRows] = React.useState<T[]>(initialData);
  const [filter, setFilter] = React.useState("");
  const [sort, setSort] = React.useState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(null);
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const [selected, setSelected] = React.useState<Set<RowId>>(new Set());
  const [editing, setEditing] = React.useState<{
    id: RowId;
    key: string;
  } | null>(null);
  const [draft, setDraft] = React.useState("");
  const [activeId, setActiveId] = React.useState<RowId | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(25);
  const [flashId, setFlashId] = React.useState<RowId | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<RowId | null>(null);
  const [dragOverId, setDragOverId] = React.useState<RowId | null>(null);
  const [menu, setMenu] = React.useState<{
    id: RowId;
    x: number;
    y: number;
  } | null>(null);
  const [colWidths, setColWidths] = React.useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = { [NAME_COL]: NAME_DEFAULT_W };
      for (const f of fields) {
        if (!f.hideInTable) initial[f.key] = fieldDefaultWidth(f);
      }
      return initial;
    },
  );

  const inputRef = React.useRef<HTMLInputElement>(null);
  const nextId = React.useRef(1_000_000);
  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  React.useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const tableFields = fields.filter((f) => !f.hideInTable);
  const visibleFields = tableFields.filter((f) => !hidden.has(f.key));

  const nameWidth = colWidths[NAME_COL] ?? NAME_DEFAULT_W;
  const totalWidth =
    CHECKBOX_W +
    ACTIONS_W +
    nameWidth +
    visibleFields.reduce(
      (sum, f) => sum + (colWidths[f.key] ?? fieldDefaultWidth(f)),
      0,
    );

  const resizeHandle = (col: string, label: string) => (
    <button
      type="button"
      aria-label={`Resize ${label} column`}
      title="Drag to resize"
      onMouseDown={(e) => startResize(col, e)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          nudgeColumn(col, -1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nudgeColumn(col, 1);
        }
      }}
      className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-primary/40 focus-visible:bg-primary/60 focus-visible:outline-none"
    />
  );

  const processed = React.useMemo(() => {
    let out = rows;
    const q = filter.trim().toLowerCase();
    if (q) {
      out = out.filter((row) => {
        const primary = getPrimary(row).title.toLowerCase();
        if (primary.includes(q)) return true;
        return fields.some((f) =>
          String(row[f.key] ?? "")
            .toLowerCase()
            .includes(q),
        );
      });
    }
    if (sort) {
      const { key, dir } = sort;
      out = [...out].sort((a, b) => {
        const av = a[key as keyof T];
        const bv = b[key as keyof T];
        let cmp: number;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av ?? "").localeCompare(String(bv ?? ""));
        }
        return dir === "asc" ? cmp : -cmp;
      });
    }
    return out;
  }, [rows, filter, sort, fields, getPrimary]);

  const activeRow = rows.find((r) => r.id === activeId) ?? null;

  // Pagination (derived; `page` is clamped so it never points past the last page).
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const rangeStart = processed.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, processed.length);
  const paged = processed.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset to the first page when the filter or page size changes.
  React.useEffect(() => {
    setPage(1);
  }, [filter, pageSize]);

  function startEdit(row: T, key: string) {
    setEditing({ id: row.id, key });
    setDraft(String(row[key as keyof T] ?? ""));
  }
  function commit() {
    if (!editing) return;
    setRows((prev) =>
      prev.map((row) =>
        row.id === editing.id ? { ...row, [editing.key]: draft } : row,
      ),
    );
    setEditing(null);
  }
  function startResize(key: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = colWidths[key] ?? 160;
    const onMove = (ev: MouseEvent) => {
      setColWidths((prev) => ({
        ...prev,
        [key]: Math.max(MIN_COL_W, startW + (ev.clientX - startX)),
      }));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  }
  function nudgeColumn(key: string, dir: -1 | 1) {
    setColWidths((prev) => ({
      ...prev,
      [key]: Math.max(MIN_COL_W, (prev[key] ?? 160) + dir * 16),
    }));
  }
  function toggleSort(key: string) {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  }
  function toggleHidden(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function toggleSelect(id: RowId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    setSelected((prev) =>
      prev.size === processed.length
        ? new Set()
        : new Set(processed.map((r) => r.id)),
    );
  }
  function addRow() {
    const row = { ...makeEmptyRow(), id: nextId.current++ };
    // Prepend so the new record is immediately visible at the top…
    setRows((prev) => [row, ...prev]);
    setPage(1);
    setActiveId(row.id);
    // …and flash it briefly so the create action is unmistakable.
    setFlashId(row.id);
    window.setTimeout(() => {
      setFlashId((current) => (current === row.id ? null : current));
    }, 1600);
    const firstEditable = fields.find((f) => f.editable);
    if (firstEditable) {
      setEditing({ id: row.id, key: firstEditable.key });
      setDraft("");
    }
  }
  function deleteRow(id: RowId) {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setSelected((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (activeId === id) setActiveId(null);
  }
  function duplicateRow(id: RowId) {
    const copyId = nextId.current++;
    setRows((prev) => {
      const index = prev.findIndex((row) => row.id === id);
      if (index < 0) return prev;
      const original = prev[index];
      if (!original) return prev;
      const next = [...prev];
      next.splice(index + 1, 0, { ...original, id: copyId } as T);
      return next;
    });
    setActiveId(copyId);
  }
  function reorder(sourceId: RowId, targetId: RowId) {
    if (sourceId === targetId) return;
    // Manual ordering only makes sense without an active sort.
    setSort(null);
    setRows((prev) => {
      const from = prev.findIndex((row) => row.id === sourceId);
      const to = prev.findIndex((row) => row.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      if (!moved) return prev;
      next.splice(to, 0, moved);
      return next;
    });
  }
  async function copyValue(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        1200,
      );
    } catch {
      // Clipboard unavailable (insecure context / denied) — no-op.
    }
  }

  const allSelected =
    processed.length > 0 && selected.size === processed.length;

  function renderCellValue(row: T, field: RecordField<T>) {
    const isEditing = editing?.id === row.id && editing.key === field.key;
    if (field.render) {
      return <div className="px-3 py-1.5">{field.render(row)}</div>;
    }
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(null);
          }}
          aria-label={`Edit ${field.label}`}
          className={cn(
            "h-8 w-full bg-background px-3 text-[12px] outline-none ring-2 ring-inset ring-ring",
            field.align === "right" && "text-right",
          )}
        />
      );
    }
    const value = String(row[field.key] ?? "");
    const cellKey = `${row.id}:${field.key}`;
    const hoverActions =
      (field.editable || (field.copyable && value)) ? (
        <span className="absolute inset-y-0 right-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/cell:opacity-100 focus-within:opacity-100">
          {field.copyable && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void copyValue(cellKey, value);
              }}
              aria-label={`Copy ${field.label}`}
              title={`Copy ${field.label}`}
              className="grid size-6 place-items-center rounded-sm bg-background text-muted-foreground shadow-sm ring-1 ring-border hover:text-foreground"
            >
              {copiedKey === cellKey ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          )}
          {field.editable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(row, field.key);
              }}
              aria-label={`Edit ${field.label}`}
              title={`Edit ${field.label}`}
              className="grid size-6 place-items-center rounded-sm bg-background text-muted-foreground shadow-sm ring-1 ring-border hover:text-foreground"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
        </span>
      ) : null;

    if (field.editable) {
      return (
        <div className="group/cell relative flex h-8 w-full items-center">
          <button
            type="button"
            onClick={() => startEdit(row, field.key)}
            className={cn(
              "flex h-8 w-full items-center overflow-hidden px-3 text-left hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              field.align === "right" && "justify-end text-right",
            )}
          >
            <span className="truncate">
              {value || <span className="text-muted-foreground">—</span>}
            </span>
          </button>
          {hoverActions}
        </div>
      );
    }
    return (
      <div
        className={cn(
          "group/cell relative flex h-8 items-center px-3",
          field.align === "right" && "justify-end text-right",
        )}
      >
        <span className="truncate">{value}</span>
        {hoverActions}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          {titleLeading}
          {TitleIcon && <TitleIcon className="size-4 text-muted-foreground" />}
          <h1 className="text-[12px] font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" onClick={addRow}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New {singular}</span>
          </Button>
          <Dropdown
            label=""
            ariaLabel="More actions"
            icon={<MoreHorizontal className="size-4" />}
            align="end"
          >
            <DropdownItem onSelect={() => setSelected(new Set())}>
              Clear selection
            </DropdownItem>
            <DropdownItem onSelect={() => setHidden(new Set())}>
              Show all columns
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Sub-toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
        <div className="flex items-center gap-2 text-[12px]">
          <ListFilter className="size-4 text-muted-foreground" />
          <span className="font-medium">All {title}</span>
          <span className="text-muted-foreground">· {processed.length}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Dropdown label="Filter" icon={<ListFilter className="size-3.5" />}>
            <DropdownLabel>Filter by keyword</DropdownLabel>
            <div className="p-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Contains…"
                  aria-label="Filter"
                  className="h-7 pl-7 text-[12px]"
                />
              </div>
            </div>
          </Dropdown>

          <Dropdown label="Sort" icon={<ArrowUpDown className="size-3.5" />}>
            <DropdownLabel>Sort by</DropdownLabel>
            {tableFields.map((f) => (
              <DropdownItem
                key={f.key}
                onSelect={() => toggleSort(f.key)}
                icon={
                  sort?.key === f.key ? (
                    sort.dir === "asc" ? (
                      <ArrowUp className="size-3.5" />
                    ) : (
                      <ArrowDown className="size-3.5" />
                    )
                  ) : (
                    <span className="size-3.5" />
                  )
                }
              >
                {f.label}
              </DropdownItem>
            ))}
            {sort && (
              <DropdownItem onSelect={() => setSort(null)}>
                Clear sort
              </DropdownItem>
            )}
          </Dropdown>

          <Dropdown
            label="Options"
            icon={<SlidersHorizontal className="size-3.5" />}
            align="end"
          >
            <DropdownLabel>Visible columns</DropdownLabel>
            {tableFields.map((f) => (
              <DropdownItem
                key={f.key}
                checked={!hidden.has(f.key)}
                onSelect={() => toggleHidden(f.key)}
              >
                {f.label}
              </DropdownItem>
            ))}
          </Dropdown>

          {/* Pagination */}
          <div className="ml-1 flex items-center gap-1 border-l border-border pl-2 text-[12px] text-muted-foreground">
            <Dropdown
              label={`${pageSize} / page`}
              icon={<Rows3 className="size-3.5" />}
              align="end"
            >
              <DropdownLabel>Rows per page</DropdownLabel>
              {PAGE_SIZES.map((n) => (
                <DropdownItem
                  key={n}
                  checked={pageSize === n}
                  onSelect={() => setPageSize(n)}
                >
                  {n} per page
                </DropdownItem>
              ))}
            </Dropdown>
            <span className="whitespace-nowrap px-1 tabular-nums">
              {rangeStart}–{rangeEnd} of {processed.length}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Previous page"
              className="grid size-7 place-items-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              aria-label="Next page"
              className="grid size-7 place-items-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <Table
          style={{ minWidth: totalWidth, tableLayout: "fixed" }}
          className="w-full"
        >
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="hover:bg-transparent">
              <TableHead style={{ width: CHECKBOX_W }} className="p-0">
                <div className="flex h-8 items-center pl-4">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </div>
              </TableHead>
              <TableHead className="relative" style={{ width: nameWidth }}>
                <span className="flex h-8 items-center gap-1.5">
                  {TitleIcon ? (
                    <TitleIcon className="size-3.5 shrink-0" />
                  ) : (
                    <DEFAULT_FIELD_ICON className="size-3.5 shrink-0" />
                  )}
                  Name
                </span>
                {resizeHandle(NAME_COL, "Name")}
              </TableHead>
              {visibleFields.map((f) => {
                const HeadIcon = f.icon ?? DEFAULT_FIELD_ICON;
                return (
                  <TableHead
                    key={f.key}
                    className="relative"
                    style={{ width: colWidths[f.key] ?? fieldDefaultWidth(f) }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(f.key)}
                      className="flex h-8 max-w-full items-center gap-1.5 truncate hover:text-foreground"
                    >
                      <HeadIcon className="size-3.5 shrink-0" />
                      <span className="truncate">{f.label}</span>
                      {sort?.key === f.key &&
                        (sort.dir === "asc" ? (
                          <ArrowUp className="size-3 shrink-0" />
                        ) : (
                          <ArrowDown className="size-3 shrink-0" />
                        ))}
                    </button>
                    {resizeHandle(f.key, f.label)}
                  </TableHead>
                );
              })}
              <TableHead
                style={{ width: ACTIONS_W }}
                className="border-r-0 text-right"
              >
                <span className="sr-only">Actions</span>
              </TableHead>
              {/* Filler so row borders reach the right edge of the page. */}
              <TableHead aria-hidden="true" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {processed.length ? (
              paged.map((row) => {
                const primary = getPrimary(row);
                return (
                  <TableRow
                    key={row.id}
                    data-active={row.id === activeId}
                    data-flash={row.id === flashId}
                    data-dragover={row.id === dragOverId && dragId !== row.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({ id: row.id, x: e.clientX, y: e.clientY });
                    }}
                    onDragOver={(e) => {
                      if (dragId === null) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setDragOverId(row.id);
                    }}
                    onDrop={(e) => {
                      if (dragId === null) return;
                      e.preventDefault();
                      reorder(dragId, row.id);
                      setDragId(null);
                      setDragOverId(null);
                    }}
                    className="group data-[active=true]:bg-accent/60 data-[dragover=true]:border-t-2 data-[dragover=true]:border-t-primary data-[flash=true]:bg-primary/10"
                  >
                    <TableCell className="p-0">
                      <div className="relative flex h-8 items-center pl-4">
                        {/* Drag grip — overlaid in the left gutter on hover,
                            so it never shifts the checkbox's alignment. */}
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", String(row.id));
                            setDragId(row.id);
                          }}
                          onDragEnd={() => {
                            setDragId(null);
                            setDragOverId(null);
                          }}
                          aria-label={`Drag ${primary.title || singular} to reorder`}
                          title="Drag to reorder"
                          className="absolute left-0 top-1/2 flex h-6 w-4 -translate-y-1/2 cursor-grab items-center justify-center text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 active:cursor-grabbing"
                        >
                          <GripVertical className="size-3.5" />
                        </div>
                        <Checkbox
                          checked={selected.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                          aria-label={`Select ${primary.title}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-0">
                      <button
                        type="button"
                        onClick={() => setActiveId(row.id)}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-muted/60"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[12px] font-medium text-muted-foreground">
                          {primary.initials}
                        </span>
                        <span className="truncate font-medium">
                          {primary.title || "—"}
                        </span>
                      </button>
                    </TableCell>
                    {visibleFields.map((f) => (
                      <TableCell key={f.key} className="p-0">
                        {renderCellValue(row, f)}
                      </TableCell>
                    ))}
                    <TableCell className="w-20 border-r-0 p-0">
                      <div className="flex items-center justify-end gap-0.5 pr-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 group-data-[active=true]:opacity-100">
                        <button
                          type="button"
                          onClick={() => setActiveId(row.id)}
                          aria-label={`Open ${primary.title || singular}`}
                          title="Open record"
                          className="grid size-7 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <ArrowUpRight className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRow(row.id)}
                          aria-label={`Delete ${primary.title || singular}`}
                          title="Delete record"
                          className="grid size-7 place-items-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell aria-hidden="true" />
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleFields.length + 4}
                  className="h-32 text-center text-[12px] text-muted-foreground"
                >
                  {filter ? `No results for “${filter}”.` : "No records yet."}
                </TableCell>
              </TableRow>
            )}
            {/* Add new row */}
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={visibleFields.length + 4} className="p-0">
                <button
                  type="button"
                  onClick={addRow}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] text-muted-foreground hover:bg-muted/50"
                >
                  <Plus className="size-4" />
                  Add {singular}
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Record detail panel */}
      {activeRow && (
        <RecordDetailPanel
          fields={fields}
          row={activeRow}
          primary={getPrimary(activeRow)}
          editing={editing}
          draft={draft}
          onEditStart={startEdit}
          onDraftChange={setDraft}
          onCommit={commit}
          onCancel={() => setEditing(null)}
          onClose={() => setActiveId(null)}
          inputRef={inputRef}
        />
      )}

      {menu && (
        <div
          role="menu"
          aria-label="Record actions"
          tabIndex={-1}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            top: Math.min(menu.y, window.innerHeight - 140),
            left: Math.min(menu.x, window.innerWidth - 200),
          }}
          className="fixed z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setActiveId(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12px] hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowUpRight className="size-3.5" />
            Open record
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              duplicateRow(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12px] hover:bg-accent hover:text-accent-foreground"
          >
            <CopyPlus className="size-3.5" />
            Duplicate
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              deleteRow(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12px] text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

interface DetailPanelProps<T extends { id: RowId }> {
  fields: RecordField<T>[];
  row: T;
  primary: { title: string; initials: string; subtitle?: string };
  editing: { id: RowId; key: string } | null;
  draft: string;
  onEditStart: (row: T, key: string) => void;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function RecordDetailPanel<T extends { id: RowId }>({
  fields,
  row,
  primary,
  editing,
  draft,
  onEditStart,
  onDraftChange,
  onCommit,
  onCancel,
  onClose,
  inputRef,
}: DetailPanelProps<T>) {
  return (
    <aside
      aria-label="Record details"
      className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l border-border bg-background shadow-xl sm:w-[380px] sm:max-w-[90vw]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[12px] font-medium text-muted-foreground">
          {primary.initials}
        </span>
        <span className="truncate text-[12px] font-semibold">
          {primary.title || "Untitled"}
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

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          Fields
        </p>
        {GROUP_ORDER.map((group) => {
          const groupFields = fields.filter(
            (f) => (f.group ?? "General") === group,
          );
          if (groupFields.length === 0) return null;
          return (
            <div key={group} className="mb-4">
              <p className="mb-1 text-[12px] font-medium text-muted-foreground">
                {group}
              </p>
              <dl className="space-y-0.5">
                {groupFields.map((f) => {
                  const isEditing =
                    editing?.id === row.id && editing.key === f.key;
                  return (
                    <div
                      key={f.key}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
                    >
                      <dt className="flex w-28 shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground">
                        {f.icon && <f.icon className="size-3.5" />}
                        {f.label}
                      </dt>
                      <dd className="min-w-0 flex-1 text-[12px]">
                        {f.render ? (
                          f.render(row)
                        ) : isEditing ? (
                          <input
                            ref={inputRef}
                            value={draft}
                            onChange={(e) => onDraftChange(e.target.value)}
                            onBlur={onCommit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") onCommit();
                              if (e.key === "Escape") onCancel();
                            }}
                            aria-label={`Edit ${f.label}`}
                            className="h-7 w-full rounded-sm bg-background px-2 outline-none ring-2 ring-inset ring-ring"
                          />
                        ) : f.editable ? (
                          <button
                            type="button"
                            onClick={() => onEditStart(row, f.key)}
                            className="w-full truncate rounded-sm px-2 py-0.5 text-left hover:bg-muted"
                          >
                            {String(row[f.key as keyof T] ?? "") || (
                              <span className="text-muted-foreground">
                                Empty
                              </span>
                            )}
                          </button>
                        ) : (
                          <span className="px-2">
                            {String(row[f.key as keyof T] ?? "") || (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
