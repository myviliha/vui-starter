"use client";

import * as React from "react";
import {
  CodeIcon as Code,
  DownloadIcon as Download,
  FileTextIcon as FileText,
  ReaderIcon as Reader,
  TableIcon as SheetIcon,
  UploadIcon as Upload,
  ArrowDownIcon as ArrowDown,
  ArrowTopRightIcon as ArrowUpRight,
  ArrowUpIcon as ArrowUp,
  CaretSortIcon as ArrowUpDown,
  CheckIcon as Check,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  CircleIcon as Circle,
  CopyIcon as Copy,
  CopyIcon as CopyPlus,
  Cross2Icon as X,
  DotsHorizontalIcon as MoreHorizontal,
  DragHandleDots2Icon as GripVertical,
  EyeOpenIcon as Eye,
  InfoCircledIcon as Info,
  MagnifyingGlassIcon as Search,
  MixerHorizontalIcon as ListFilter,
  MixerHorizontalIcon as SlidersHorizontal,
  Pencil1Icon as Pencil,
  PlusIcon as Plus,
  RowsIcon as Rows3,
  TrashIcon as Trash2,
} from "@radix-ui/react-icons";

import { cn } from "./utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
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
import { ConfirmDialog } from "./confirm-dialog";
import { RequiredMark } from "./required-mark";
import {
  downloadFile,
  parseCSV,
  printTable,
  rowsToCSV,
  rowsToTableHTML,
  type IoColumn,
} from "./table-io";

type RowId = string | number;
type FieldGroup = "General" | "Work" | "Social" | "System";
const GROUP_ORDER: FieldGroup[] = ["General", "Work", "Social", "System"];

/** Fixed (non-resizable) leading/trailing column widths, in px. */
const CHECKBOX_W = 56;
const ACTIONS_W = 120;
const NAME_COL = "__name";
const NAME_DEFAULT_W = 190;
const MIN_COL_W = 80;
const PAGE_SIZES = [10, 25, 50, 100] as const;
/** Fallback column-header icon so every column title shows an icon. */
const DEFAULT_FIELD_ICON = Circle;

type ColAlign = "left" | "center" | "right";

/** Flexbox + text classes per alignment (for the cell content wrapper). */
const ALIGN_BOX: Record<ColAlign, string> = {
  left: "",
  center: "justify-center text-center",
  right: "justify-end text-right",
};
/** Text-align only (for inputs / render wrappers). */
const ALIGN_TEXT: Record<ColAlign, string> = {
  left: "",
  center: "text-center",
  right: "text-right",
};

/**
 * Auto-align columns from their data: numeric columns and short codes
 * (all values ≤ 4 chars, e.g. "USD", "EN") center; everything else stays left.
 * An explicit `field.align` always wins.
 */
function computeColumnAligns<T extends { id: RowId }>(
  fields: RecordField<T>[],
  data: T[],
): Record<string, ColAlign> {
  const map: Record<string, ColAlign> = {};
  for (const f of fields) {
    if (f.align) {
      map[f.key] = f.align;
      continue;
    }
    const vals = data
      .map((r) => r[f.key])
      .filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
    if (vals.length === 0) {
      map[f.key] = "left";
      continue;
    }
    const allNumeric = vals.every(
      (v) =>
        typeof v === "number" ||
        (typeof v === "string" && !Number.isNaN(Number(v))),
    );
    const allShort = vals.every((v) => String(v).trim().length <= 4);
    map[f.key] = allNumeric || allShort ? "center" : "left";
  }
  return map;
}

function fieldDefaultWidth<T>(field: RecordField<T>): number {
  return field.width ?? (field.align && field.align !== "left" ? 110 : 160);
}

/** Shared icon component type (all Radix icons share this shape). */
export type IconType = typeof Circle;

export type PageMeta = { title: string; icon?: IconType };

const PageChromeContext = React.createContext<{
  titleLeading?: React.ReactNode;
  /** Current page's title/icon, registered by the active view (e.g. RecordView). */
  page: PageMeta | null;
  setPage: (page: PageMeta | null) => void;
}>({ page: null, setPage: () => {} });

/**
 * Shares page chrome across the app shell: a leading node for the header
 * (e.g. a sidebar-expand toggle) plus the current page's title/icon so a global
 * top bar can display it. Wrap the top bar AND the page content with this.
 */
export function PageChromeProvider({
  titleLeading,
  children,
}: {
  titleLeading?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [page, setPage] = React.useState<PageMeta | null>(null);
  return (
    <PageChromeContext.Provider value={{ titleLeading, page, setPage }}>
      {children}
    </PageChromeContext.Provider>
  );
}

/** Read the current page chrome (title/icon, leading node). */
export function usePageChrome() {
  return React.useContext(PageChromeContext);
}

/** Register the current page's title/icon into the shell (clears on unmount). */
export function usePageTitle(title: string, icon?: IconType) {
  const { setPage } = React.useContext(PageChromeContext);
  React.useEffect(() => {
    setPage({ title, icon });
    return () => setPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);
}

export interface RecordField<T> {
  key: Extract<keyof T, string>;
  label: string;
  /** Help text shown in the page-form documentation panel. */
  description?: string;
  icon?: IconType;
  editable?: boolean;
  /** Mark the field mandatory — shows a `*` next to its label. */
  required?: boolean;
  /** Column alignment. Omit to auto-align: numbers and short codes (≤ 4 chars)
   *  center, everything else stays left. Set explicitly to override. */
  align?: "left" | "center" | "right";
  group?: FieldGroup;
  /** Initial column width in px (user-resizable via the header handle). */
  width?: number;
  /** Show a copy-to-clipboard action on hover (e.g. email, phone). */
  copyable?: boolean;
  /** Show in the detail panel only, not as a table column (e.g. first/last name). */
  hideInTable?: boolean;
  /** Custom, non-editable cell/value renderer. */
  render?: (row: T) => React.ReactNode;
  /** If set, the field becomes a choice field: the selection toolbar offers a
   *  "Set {label}" bulk action listing these values. */
  options?: { value: string; label: string }[];
}

interface RecordViewProps<T extends { id: RowId }> {
  title: string;
  singular: string;
  icon?: IconType;
  fields: RecordField<T>[];
  initialData: T[];
  makeEmptyRow: () => T;
  getPrimary: (row: T) => {
    title: string;
    initials: string;
    subtitle?: string;
  };
  /** Add/Edit form presentation: "panel" slide-over (default) or "page" full-page. */
  formMode?: "panel" | "page";
  /** Full-page form column count (page mode only). Default 1. */
  formColumns?: 1 | 2;
  /** Navigate to Home from the page-form breadcrumb (e.g. router.push). */
  onHome?: () => void;
  /** Intro text for the page-form documentation panel ("about this form"). */
  formDescription?: string;
  /** Controlled rows. When set, RecordView renders these and reports edits via
   *  onDataChange instead of holding rows in internal state. */
  data?: T[];
  /** Receives the next rows array in controlled mode. */
  onDataChange?: (rows: T[]) => void;
  /** When set, the "add" button calls this (e.g. navigate to a create route)
   *  instead of opening the built-in form. */
  onCreate?: () => void;
  /** When set, opening/editing a row navigates (e.g. to an edit route) instead
   *  of opening the built-in overlay form. */
  onView?: (id: RowId) => void;
  onEdit?: (id: RowId) => void;
}

export function RecordView<T extends { id: RowId }>({
  title,
  singular,
  icon: TitleIcon,
  fields,
  initialData,
  makeEmptyRow,
  getPrimary,
  formMode = "panel",
  formColumns = 1,
  onHome,
  formDescription,
  data,
  onDataChange,
  onCreate,
  onView,
  onEdit,
}: RecordViewProps<T>) {
  const { titleLeading } = React.useContext(PageChromeContext);
  // Surface the page title/icon in the app's global top bar.
  usePageTitle(title, TitleIcon);
  // Rows are either controlled (data + onDataChange) or held internally.
  const [internalRows, setInternalRows] = React.useState<T[]>(initialData);
  const controlled = data !== undefined;
  const rows = controlled ? data : internalRows;
  const setRows = React.useCallback(
    (updater: React.SetStateAction<T[]>) => {
      if (controlled) {
        const next =
          typeof updater === "function"
            ? (updater as (prev: T[]) => T[])(data as T[])
            : updater;
        onDataChange?.(next);
      } else {
        setInternalRows(updater);
      }
    },
    [controlled, data, onDataChange],
  );
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
  // A row created via "add" but not yet saved — Cancel/close removes it.
  const [newRowId, setNewRowId] = React.useState<RowId | null>(null);
  // Row pending delete confirmation.
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<RowId | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  // Whether the detail panel opened read-only (View) or editable (Edit / Add).
  const [panelReadOnly, setPanelReadOnly] = React.useState(false);
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
  // Empty by default: columns auto-size to their header text via CSS (`w-max`).
  // A key is only set once the user drags a column's resize handle.
  const [colWidths, setColWidths] = React.useState<Record<string, number>>({});

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
  const deleteTarget =
    confirmDeleteId != null
      ? (rows.find((r) => r.id === confirmDeleteId) ?? null)
      : null;

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
  /** Bulk-set a choice field on every selected row (keeps the selection). */
  function bulkSetField(key: keyof T, value: string) {
    setRows((prev) =>
      prev.map((r) => (selected.has(r.id) ? ({ ...r, [key]: value } as T) : r)),
    );
  }
  /** Delete every selected row, then clear the selection. */
  function bulkDelete() {
    setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    if (activeId != null && selected.has(activeId)) setActiveId(null);
    setSelected(new Set());
    setBulkDeleteOpen(false);
  }
  function addRow() {
    // Routed create: delegate to the caller (e.g. navigate to /new).
    if (onCreate) {
      onCreate();
      return;
    }
    const row = { ...makeEmptyRow(), id: nextId.current++ };
    // Prepend so the new record is immediately visible at the top…
    setRows((prev) => [row, ...prev]);
    setPage(1);
    setPanelReadOnly(false);
    setActiveId(row.id);
    setNewRowId(row.id);
  }
  /** Open the detail panel read-only (View). */
  function openView(id: RowId) {
    if (onView) {
      onView(id);
      return;
    }
    setPanelReadOnly(true);
    setActiveId(id);
  }
  /** Open the detail panel editable (Edit). */
  function openEdit(id: RowId) {
    if (onEdit) {
      onEdit(id);
      return;
    }
    setPanelReadOnly(false);
    setActiveId(id);
  }
  /** Commit the form's buffered draft back into the table. */
  function saveForm(updated: T) {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    // Flash the saved row so the change is unmistakable.
    setFlashId(updated.id);
    window.setTimeout(() => {
      setFlashId((current) => (current === updated.id ? null : current));
    }, 1600);
    setNewRowId(null);
    setActiveId(null);
  }
  /** Discard the form; drop the row entirely if it was never saved. */
  function cancelForm() {
    if (activeId != null && activeId === newRowId) {
      setRows((prev) => prev.filter((r) => r.id !== activeId));
    }
    setNewRowId(null);
    setActiveId(null);
  }

  const importRef = React.useRef<HTMLInputElement>(null);
  const ioColumns: IoColumn[] = fields.map((f) => ({
    key: f.key,
    label: f.label,
  }));
  /** Export the currently filtered/sorted rows in the chosen format. */
  function exportData(format: "csv" | "excel" | "json" | "pdf") {
    const data = processed as Record<string, unknown>[];
    const base = title.toLowerCase().replace(/\s+/g, "-") || "export";
    if (format === "csv")
      downloadFile(`${base}.csv`, rowsToCSV(ioColumns, data), "text/csv;charset=utf-8");
    else if (format === "json")
      downloadFile(`${base}.json`, JSON.stringify(data, null, 2), "application/json");
    else if (format === "excel")
      downloadFile(`${base}.xls`, rowsToTableHTML(ioColumns, data), "application/vnd.ms-excel");
    else printTable(title, rowsToTableHTML(ioColumns, data));
  }
  /** Parse an imported CSV/JSON file and prepend the rows to the table. */
  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    let records: Record<string, unknown>[] = [];
    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        const parsed: unknown = JSON.parse(text);
        records = Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [];
      } else {
        records = parseCSV(text);
      }
    } catch {
      return;
    }
    const byKey = new Map(fields.map((f) => [f.key.toLowerCase(), f.key]));
    const byLabel = new Map(fields.map((f) => [f.label.toLowerCase(), f.key]));
    const imported = records.map((rec) => {
      const row = { ...makeEmptyRow(), id: nextId.current++ } as Record<
        string,
        unknown
      >;
      for (const [k, v] of Object.entries(rec)) {
        const key = byKey.get(k.toLowerCase()) ?? byLabel.get(k.toLowerCase());
        if (key) row[key] = v;
      }
      return row as T;
    });
    if (imported.length) {
      setRows((prev) => [...imported, ...prev]);
      setPage(1);
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
  // Choice fields (with `options`) power the "Set …" bulk actions.
  const bulkFields = fields.filter((f) => f.options && f.options.length > 0);
  // Per-column alignment (auto: numbers + short codes center).
  const columnAligns = React.useMemo(
    () => computeColumnAligns(fields, initialData),
    [fields, initialData],
  );
  const alignOf = (key: string): ColAlign => columnAligns[key] ?? "left";

  function renderCellValue(row: T, field: RecordField<T>) {
    const isEditing = editing?.id === row.id && editing.key === field.key;
    if (field.render) {
      return (
        <div className={cn("px-3 py-1.5", ALIGN_TEXT[alignOf(field.key)])}>
          {field.render(row)}
        </div>
      );
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
            "h-8 w-full bg-background px-3 outline-none ring-2 ring-inset ring-ring",
            ALIGN_TEXT[alignOf(field.key)],
          )}
        />
      );
    }
    const value = String(row[field.key] ?? "");
    const cellKey = `${row.id}:${field.key}`;
    const hoverActions =
      (field.editable || (field.copyable && value)) ? (
        <span className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center divide-x divide-border overflow-hidden rounded-sm bg-background shadow-sm ring-1 ring-border opacity-0 transition-opacity group-hover/cell:opacity-100 focus-within:opacity-100">
          {field.copyable && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void copyValue(cellKey, value);
              }}
              aria-label={`Copy ${field.label}`}
              title={`Copy ${field.label}`}
              className="grid size-6 place-items-center text-muted-foreground hover:bg-muted hover:text-foreground"
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
              className="grid size-6 place-items-center text-muted-foreground hover:bg-muted hover:text-foreground"
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
              ALIGN_BOX[alignOf(field.key)],
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
          ALIGN_BOX[alignOf(field.key)],
        )}
      >
        <span className="truncate">{value}</span>
        {hoverActions}
      </div>
    );
  }

  // Full-page form mode: replace the table chrome entirely while adding/editing
  // (this also hides the import/export/add actions, which live in that chrome).
  if (formMode === "page" && activeRow) {
    return (
      <RecordDetailPanel
        layout="page"
        columns={formColumns}
        isNew={activeId === newRowId}
        title={title}
        onHome={onHome}
        formDescription={formDescription}
        fields={fields}
        row={activeRow}
        singular={singular}
        icon={TitleIcon}
        getPrimary={getPrimary}
        readOnly={panelReadOnly}
        onEdit={() => setPanelReadOnly(false)}
        onSave={saveForm}
        onCancel={cancelForm}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header — title/icon now live in the global top bar; this row holds the
          per-record actions (add / import / export). */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">{titleLeading}</div>
        <div className="flex items-center gap-1.5">
          <input
            ref={importRef}
            type="file"
            accept=".csv,.json"
            onChange={onImportFile}
            className="hidden"
            aria-hidden="true"
          />
          <Dropdown
            label="Import"
            labelClassName="hidden sm:inline"
            icon={<Upload className="size-3.5 text-sky-500" />}
            align="end"
          >
            <DropdownLabel>Import from</DropdownLabel>
            <DropdownItem onSelect={() => importRef.current?.click()}>
              <span className="flex items-center gap-2">
                <FileText className="size-3.5" /> CSV
              </span>
            </DropdownItem>
            <DropdownItem onSelect={() => importRef.current?.click()}>
              <span className="flex items-center gap-2">
                <Code className="size-3.5" /> JSON
              </span>
            </DropdownItem>
            <DropdownItem onSelect={() => importRef.current?.click()}>
              <span className="flex items-center gap-2">
                <SheetIcon className="size-3.5" /> Excel
              </span>
            </DropdownItem>
          </Dropdown>

          <Dropdown
            label="Export"
            labelClassName="hidden sm:inline"
            icon={<Download className="size-3.5 text-violet-500" />}
            align="end"
          >
            <DropdownLabel>Export as</DropdownLabel>
            <DropdownItem onSelect={() => exportData("csv")}>
              <span className="flex items-center gap-2">
                <FileText className="size-3.5" /> CSV
              </span>
            </DropdownItem>
            <DropdownItem onSelect={() => exportData("excel")}>
              <span className="flex items-center gap-2">
                <SheetIcon className="size-3.5" /> Excel
              </span>
            </DropdownItem>
            <DropdownItem onSelect={() => exportData("json")}>
              <span className="flex items-center gap-2">
                <Code className="size-3.5" /> JSON
              </span>
            </DropdownItem>
            <DropdownItem onSelect={() => exportData("pdf")}>
              <span className="flex items-center gap-2">
                <Reader className="size-3.5" /> PDF
              </span>
            </DropdownItem>
          </Dropdown>

          <Dropdown
            label=""
            ariaLabel="More actions"
            icon={<MoreHorizontal className="size-4 text-slate-500" />}
            align="end"
          >
            <DropdownItem onSelect={() => setSelected(new Set())}>
              Clear selection
            </DropdownItem>
            <DropdownItem onSelect={() => setHidden(new Set())}>
              Show all columns
            </DropdownItem>
          </Dropdown>

          <Button variant="primary" size="sm" onClick={addRow} className="ml-1">
            <Plus className="size-4" />
            <span className="hidden sm:inline">{singular}</span>
          </Button>
        </div>
      </div>

      {/* Content — padded, bordered card (matches the settings-page layout) */}
      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Sub-toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-1.5">
        <div className="flex items-center gap-2">
          <ListFilter className="size-4 text-muted-foreground" />
          {selected.size > 0 ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selected.size} selected</span>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Clear
              </button>
            </span>
          ) : (
            <span className="font-medium">All {title}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {/* Bulk actions — mirror the Options dropdown; shown only with a selection. */}
          {selected.size > 0 && (
            <Dropdown
              label="Actions"
              icon={<MoreHorizontal className="size-3.5 text-violet-500" />}
            >
              <DropdownLabel>{selected.size} selected</DropdownLabel>
              {bulkFields.map((f) => (
                <React.Fragment key={f.key}>
                  <DropdownLabel>Set {f.label}</DropdownLabel>
                  {f.options?.map((o) => (
                    <DropdownItem
                      key={o.value}
                      onSelect={() => bulkSetField(f.key, o.value)}
                    >
                      {o.label}
                    </DropdownItem>
                  ))}
                </React.Fragment>
              ))}
              <DropdownItem onSelect={() => setBulkDeleteOpen(true)}>
                <span className="flex items-center gap-2 text-destructive">
                  <Trash2 className="size-3.5" /> Delete {selected.size} selected
                </span>
              </DropdownItem>
            </Dropdown>
          )}
          <Dropdown label="Filter" icon={<ListFilter className="size-3.5 text-amber-500" />}>
            <DropdownLabel>Filter by keyword</DropdownLabel>
            <div className="p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Contains…"
                  aria-label="Filter"
                  className="h-8 pl-9"
                />
              </div>
            </div>
          </Dropdown>

          <Dropdown label="Sort" icon={<ArrowUpDown className="size-3.5 text-blue-500" />}>
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
                  ) : undefined
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
            icon={<SlidersHorizontal className="size-3.5 text-fuchsia-500" />}
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
          <div className="ml-1 flex items-center gap-1 border-l border-border pl-2 text-muted-foreground">
            <Dropdown
              label={`${pageSize} / page`}
              icon={<Rows3 className="size-3.5 text-teal-500" />}
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
          style={{ minWidth: totalWidth, tableLayout: "auto" }}
          className="w-full"
        >
          <TableHeader className="sticky top-0 z-20 bg-background [&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-background">
            <TableRow className="hover:bg-transparent">
              <TableHead style={{ width: CHECKBOX_W }} className="p-0">
                <div className="flex h-8 items-center gap-2 pl-2 pr-3">
                  {/* Spacer matching the row drag-grip slot so this checkbox
                      lines up vertically with the row checkboxes below. */}
                  <span aria-hidden="true" className="h-6 w-4 shrink-0" />
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </div>
              </TableHead>
              <TableHead className="relative w-max" style={{ width: colWidths[NAME_COL] }}>
                <span className="flex h-8 items-center gap-1.5 whitespace-nowrap">
                  {TitleIcon ? (
                    <TitleIcon className="size-3.5 shrink-0 text-foreground" />
                  ) : (
                    <DEFAULT_FIELD_ICON className="size-3.5 shrink-0 text-foreground" />
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
                    className="relative w-max"
                    style={{ width: colWidths[f.key] }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(f.key)}
                      className={cn(
                        "flex h-8 w-full items-center gap-1.5 whitespace-nowrap hover:text-foreground",
                        ALIGN_BOX[alignOf(f.key)],
                      )}
                    >
                      <HeadIcon className="size-3.5 shrink-0 text-foreground" />
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        {f.label}
                        {f.required && <RequiredMark />}
                      </span>
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
              {/* Flex spacer absorbs leftover width so data columns keep their
                  natural size AND the Actions column stays pinned to the right
                  edge. Borderless so no stray divider shows in the gap. */}
              <TableHead aria-hidden="true" className="w-full border-r-0" />
              <TableHead
                style={{ width: ACTIONS_W }}
                className="sticky right-0 z-30 border-l border-border text-right shadow-[-8px_0_12px_-8px_rgb(0_0_0/0.12)]"
              >
                <span className="flex h-8 items-center justify-center whitespace-nowrap px-2">
                  Actions
                </span>
              </TableHead>
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
                    <TableCell className="p-0" style={{ width: CHECKBOX_W }}>
                      <div className="flex h-8 items-center gap-2 pl-2 pr-3">
                        {/* Drag grip — always visible in a light color (so the
                            reorder affordance is discoverable), darkening on
                            hover. Inline before the checkbox; plain glyph (no
                            icon-chip border) so it doesn't read as a box. */}
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
                          className="flex h-6 w-4 shrink-0 cursor-grab items-center justify-center text-muted-foreground/40 transition-colors hover:text-foreground active:cursor-grabbing"
                        >
                          <GripVertical className="size-3.5 border-transparent bg-transparent" />
                        </div>
                        <Checkbox
                          checked={selected.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                          aria-label={`Select ${primary.title}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      className="p-0"
                      style={{ maxWidth: colWidths[NAME_COL] ?? NAME_DEFAULT_W }}
                    >
                      <button
                        type="button"
                        onClick={() => openView(row.id)}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-muted/60"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted font-medium text-muted-foreground">
                          {primary.initials}
                        </span>
                        <span className="truncate">
                          {primary.title || "—"}
                        </span>
                      </button>
                    </TableCell>
                    {visibleFields.map((f) => (
                      <TableCell
                        key={f.key}
                        className="p-0"
                        style={{ maxWidth: colWidths[f.key] ?? fieldDefaultWidth(f) }}
                      >
                        {renderCellValue(row, f)}
                      </TableCell>
                    ))}
                    <TableCell aria-hidden="true" className="w-full border-r-0" />
                    <TableCell
                      className="sticky right-0 z-10 border-l border-border bg-card p-0 shadow-[-8px_0_12px_-8px_rgb(0_0_0/0.12)]"
                      style={{ width: ACTIONS_W }}
                    >
                      <div className="flex items-center justify-center gap-0.5 px-2">
                        <button
                          type="button"
                          onClick={() => openView(row.id)}
                          aria-label={`View ${primary.title || singular}`}
                          title="View"
                          className="grid size-7 cursor-pointer place-items-center rounded-sm hover:bg-muted"
                        >
                          <Eye className="size-4 text-blue-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(row.id)}
                          aria-label={`Edit ${primary.title || singular}`}
                          title="Edit"
                          className="grid size-7 cursor-pointer place-items-center rounded-sm hover:bg-muted"
                        >
                          <Pencil className="size-4 text-amber-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(row.id)}
                          aria-label={`Delete ${primary.title || singular}`}
                          title="Delete"
                          className="grid size-7 cursor-pointer place-items-center rounded-sm hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleFields.length + 4}
                  className="h-32 text-center text-muted-foreground"
                >
                  {filter ? `No results for “${filter}”.` : "No records yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
        </div>
      </div>

      {/* Record detail panel */}
      {activeRow && (
        <RecordDetailPanel
          fields={fields}
          row={activeRow}
          singular={singular}
          icon={TitleIcon}
          getPrimary={getPrimary}
          readOnly={panelReadOnly}
          onEdit={() => setPanelReadOnly(false)}
          onSave={saveForm}
          onCancel={cancelForm}
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
              openView(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground"
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
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground"
          >
            <CopyPlus className="size-3.5" />
            Duplicate
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setConfirmDeleteId(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId != null}
        title={`Delete ${singular.toLowerCase()}?`}
        description={
          <>
            This permanently removes{" "}
            <span className="font-medium text-foreground">
              {deleteTarget ? getPrimary(deleteTarget).title || "this record" : "this record"}
            </span>
            . This can’t be undone.
          </>
        }
        destructive
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDeleteId != null) deleteRow(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title={`Delete ${selected.size} ${
          selected.size === 1 ? singular.toLowerCase() : `${title.toLowerCase()}`
        }?`}
        description={
          <>
            This permanently removes the{" "}
            <span className="font-medium text-foreground">
              {selected.size} selected
            </span>{" "}
            record{selected.size === 1 ? "" : "s"}. This can’t be undone.
          </>
        }
        destructive
        confirmLabel="Delete"
        onConfirm={bulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
}

interface DetailPanelProps<T extends { id: RowId }> {
  fields: RecordField<T>[];
  /** Initial values; the panel edits a local buffered copy until Save. */
  row: T;
  singular: string;
  icon?: IconType;
  getPrimary: (row: T) => { title: string; initials: string; subtitle?: string };
  /** Read-only (View) vs editable (Edit / Add). */
  readOnly?: boolean;
  /** Switch a read-only panel into edit mode. */
  onEdit?: () => void;
  /** Commit the buffered draft to the table. */
  onSave: (row: T) => void;
  /** Discard the draft (and drop the row if it was never saved). */
  onCancel: () => void;
  /** "panel" = slide-over (default); "page" = full-page form. */
  layout?: "panel" | "page";
  /** Full-page form column count. Default 1. */
  columns?: 1 | 2;
  /** New (unsaved) record — drives the "Create new …" breadcrumb. */
  isNew?: boolean;
  /** Plural collection title (e.g. "Organizations") — the clickable parent crumb. */
  title?: string;
  /** Navigate to Home from the breadcrumb. */
  onHome?: () => void;
  /** Intro text for the documentation panel. */
  formDescription?: string;
}

function RecordDetailPanel<T extends { id: RowId }>({
  fields,
  row,
  singular,
  icon: TitleIcon,
  getPrimary,
  readOnly = false,
  onEdit,
  onSave,
  onCancel,
  layout = "panel",
  columns = 1,
  isNew = false,
  title,
  onHome,
  formDescription,
}: DetailPanelProps<T>) {
  const [draft, setDraft] = React.useState<T>(row);
  // Reset the buffered form when a different record is opened.
  React.useEffect(() => {
    setDraft(row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.id]);

  const primary = getPrimary(draft);
  const HeaderIcon = TitleIcon ?? DEFAULT_FIELD_ICON;

  // Required-field validation: keys with an error get a red border on Save.
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    setErrors(new Set());
  }, [row.id]);

  const setField = (key: keyof T, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((prev) => {
      if (!prev.has(key as string)) return prev;
      const next = new Set(prev);
      next.delete(key as string);
      return next;
    });
  };

  // Play the exit animation, then run the actual close/save when it ends.
  const [closing, setClosing] = React.useState(false);
  const pending = React.useRef<(() => void) | null>(null);
  const requestClose = (action: () => void) => {
    pending.current = action;
    setClosing(true);
  };
  // The page layout has no slide-out animation — run the action immediately.
  const dismiss = (action: () => void) =>
    layout === "page" ? action() : requestClose(action);

  const handleSave = () => {
    const missing = fields.filter(
      (f) =>
        f.required &&
        f.editable &&
        !f.render &&
        String(draft[f.key as keyof T] ?? "").trim() === "",
    );
    if (missing.length > 0) {
      setErrors(new Set(missing.map((f) => f.key)));
      return;
    }
    dismiss(() => onSave(draft));
  };

  // Grouped field sections — shared by the slide-over and full-page layouts.
  const formBody = GROUP_ORDER.map((group) => {
    const groupFields = fields.filter((f) => (f.group ?? "General") === group);
    if (groupFields.length === 0) return null;
    return (
      <section
        key={group}
        className="overflow-hidden rounded-lg border border-border"
      >
        <h3 className="border-b border-border bg-muted/40 px-3 py-2 font-semibold text-[var(--button-primary)]">
          {group}
        </h3>
        <dl className="divide-y divide-border">
          {groupFields.map((f) => (
            <div
              key={f.key}
              className="flex items-start gap-3 px-3 py-3 leading-relaxed"
            >
              <dt className="flex w-28 shrink-0 items-center gap-1.5 pt-1.5 text-muted-foreground">
                {f.icon && (
                  <f.icon className="size-3.5 text-[var(--button-primary)]" />
                )}
                {f.label}
                {f.required && <RequiredMark />}
              </dt>
              <dd className="min-w-0 flex-1">
                {f.render ? (
                  <div className="pt-0.5">{f.render(draft)}</div>
                ) : !readOnly && f.editable ? (
                  <textarea
                    value={String(draft[f.key as keyof T] ?? "")}
                    onChange={(e) => setField(f.key as keyof T, e.target.value)}
                    aria-label={f.label}
                    aria-invalid={errors.has(f.key) || undefined}
                    placeholder={`Add ${f.label.toLowerCase()}`}
                    rows={1}
                    // field-sizing grows the box to fit long/wrapped text
                    className={cn(
                      "w-full resize-none rounded-sm border bg-background px-2 py-1.5 outline-none [field-sizing:content] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-inset",
                      errors.has(f.key)
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-input focus-visible:ring-ring",
                    )}
                  />
                ) : (
                  <span className="block whitespace-pre-wrap break-words px-2 pt-1.5">
                    {String(draft[f.key as keyof T] ?? "") || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  });

  // Footer actions — View shows Close/Edit; Add/Edit shows Cancel/Save.
  const formFooter = (
    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-3">
      {readOnly ? (
        <>
          <Button onClick={() => dismiss(onCancel)}>
            <X className="size-4" />
            Close
          </Button>
          {onEdit && (
            <Button variant="primary" onClick={onEdit}>
              <Pencil className="size-4" />
              Edit
            </Button>
          )}
        </>
      ) : (
        <>
          <Button onClick={() => dismiss(onCancel)}>
            <X className="size-4" />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Check className="size-4" />
            Save
          </Button>
        </>
      )}
    </div>
  );

  // Full-page form: breadcrumb header → scrollable single column → fixed actions.
  if (layout === "page") {
    const crumb = readOnly
      ? primary.title || `View ${singular.toLowerCase()}`
      : isNew
        ? `Create new ${singular.toLowerCase()}`
        : `Update ${singular.toLowerCase()}`;
    // AWS-style documentation column: an intro plus per-field help text.
    const documentedFields = fields.filter((f) => f.description);
    const docPanel =
      formDescription || documentedFields.length > 0 ? (
        <aside
          aria-label={`${title ?? singular} help`}
          className="hidden w-80 shrink-0 overflow-y-auto rounded-lg border border-border bg-muted/20 lg:block"
        >
          <div className="space-y-4 p-4 text-sm">
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-1.5 font-semibold text-[var(--button-primary)]">
                <Info className="size-4 text-[var(--button-primary)]" />
                About {title ?? singular}
              </h2>
              {formDescription && (
                <p className="leading-relaxed text-muted-foreground">
                  {formDescription}
                </p>
              )}
            </div>
            {documentedFields.length > 0 && (
              <dl className="divide-y divide-border border-t border-border">
                {documentedFields.map((f) => (
                  <div key={f.key} className="space-y-0.5 py-3 first:pt-4">
                    <dt className="font-medium text-foreground">{f.label}</dt>
                    <dd className="leading-relaxed text-muted-foreground">
                      {f.description}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </aside>
      ) : null;
    return (
      <div className="flex h-full flex-col">
        {/* Breadcrumb — the shared Breadcrumbs component (consistent app-wide). */}
        <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
          <Breadcrumbs
            onBack={onCancel}
            crumbs={[
              ...(onHome ? [{ label: "Home", onClick: onHome }] : []),
              { label: title ?? singular, onClick: onCancel },
              { label: crumb },
            ] as Crumb[]}
          />
        </div>
        {/* Content — form card (left) + optional documentation panel (right). */}
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <div className="flex h-full gap-4">
            {/* Padded, bordered card — matches the datatable content container. */}
            <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
              <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
                <div
                  className={cn(
                    "w-full",
                    columns === 2
                      ? "mx-auto grid max-w-5xl grid-cols-1 items-start gap-4 md:grid-cols-2"
                      : // One column: sections span the full container width.
                        "space-y-4",
                  )}
                >
                  {formBody}
                </div>
              </div>
              {formFooter}
            </div>
            {docPanel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dimmed backdrop — click to close. */}
      <div
        className={cn(
          "fixed inset-0 z-[55] bg-foreground/25",
          closing ? "vui-overlay-out" : "vui-overlay-in",
        )}
        onClick={() => requestClose(onCancel)}
        aria-hidden="true"
      />
      <aside
        aria-label={`${singular} form`}
        className={cn(
          "fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l border-border bg-background shadow-xl sm:w-[380px] sm:max-w-[90vw]",
          closing ? "vui-panel-out" : "vui-panel-in",
        )}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && closing && pending.current) {
            const run = pending.current;
            pending.current = null;
            run();
          }
        }}
      >
        {/* Header — icon + title (placeholder when new); matches the page header. */}
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
            <HeaderIcon className="size-3.5" />
          </span>
          <span
            className={cn(
              "truncate font-semibold",
              !primary.title && "text-muted-foreground",
            )}
          >
            {primary.title || `New ${singular}`}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => requestClose(onCancel)}
            aria-label="Close"
            className="ml-auto"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Body — one bordered section per field group. */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {formBody}
        </div>

        {formFooter}
      </aside>
    </>
  );
}

/**
 * Standalone full-page record form for a dedicated route (e.g. `/…/new`).
 * Wraps the page layout of the detail panel so the same form/breadcrumb/doc
 * chrome is reused outside the table.
 */
export function RecordForm<T extends { id: RowId }>(
  props: Omit<DetailPanelProps<T>, "layout">,
) {
  return <RecordDetailPanel layout="page" {...props} />;
}
