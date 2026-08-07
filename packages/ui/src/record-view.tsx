"use client";

import * as React from "react";
import {
  CodeIcon as Code,
  DownloadIcon as Download,
  FileTextIcon as FileText,
  ReaderIcon as Reader,
  TableIcon as SheetIcon,
  UploadIcon as Upload,
  ArrowTopRightIcon as ArrowUpRight,
  CaretDownIcon as CaretDown,
  CaretSortIcon as CaretSort,
  CaretUpIcon as CaretUp,
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
  ResetIcon as Restore,
  RowsIcon as Rows3,
  TrashIcon as Trash2,
} from "@radix-ui/react-icons";

import { cn } from "./utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
export type { Crumb } from "./breadcrumbs";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Select } from "./select";
import { Skeleton } from "./skeleton";
import {
  useResolved,
  type BehaviourConfig,
  type FormSection,
  type SectionColumns,
  type FormAction,
  type FormActionContext,
  type FormActionOutcome,
  type FormActionsConfig,
  type FormSlot,
} from "./config";
export type {
  BehaviourConfig,
  FormSection,
  SectionColumns,
  FormActionOutcome,
  FormSlot,
  FormAction,
  FormActionContext,
  FormActionsConfig,
  FormConfig,
  VuiConfig,
} from "./config";
import {
  actionRequiresValid,
  defaultFormActions,
  FormFooter,
  resolveFormActions,
  saveOutcome,
} from "./form-actions";
import { Combobox } from "./combobox";
import { MultiCombobox } from "./multi-combobox";
import { FilterGrid, FilterField } from "./filter-field";
import {
  useAsyncOptions,
  type AsyncOption,
  type AsyncOptionSource,
} from "./use-async-options";

export type { AsyncOption } from "./use-async-options";
import { Tooltip } from "./tooltip";
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
// A form section title. Any string works — sections render in the order their
// fields first appear. The four below are the common defaults; a form can use
// its own (e.g. "Organization information", "Brand assets").
type FieldGroup = string;

/** Distinct field groups in first-appearance order (ungrouped → "General"). */
export function orderedGroups<T>(fields: RecordField<T>[]): string[] {
  const seen: string[] = [];
  for (const f of fields) {
    const g = f.group ?? "General";
    if (!seen.includes(g)) seen.push(g);
  }
  return seen;
}

/**
 * The sections to render, in order. Declared sections come first in the order
 * you wrote them; any group that only exists on the fields is appended, so
 * adding a field with a new group never makes it disappear.
 *
 * Exported for testing.
 */
export function orderedSections<T>(
  fields: RecordField<T>[],
  declared: FormSection[] | undefined,
): FormSection[] {
  const groups = orderedGroups(fields);
  if (!declared?.length) return groups.map((group) => ({ group }));
  const named = new Set(declared.map((d) => d.group));
  return [
    ...declared.filter((d) => groups.includes(d.group)),
    ...groups.filter((g) => !named.has(g)).map((group) => ({ group })),
  ];
}

/** Fixed (non-resizable) leading/trailing column widths, in px. */
const CHECKBOX_W = 56;
const ACTIONS_W = 120;
const NAME_COL = "__name";
const NAME_DEFAULT_W = 190;
// Marks the identity (Name/Title) column's slot in the ordered column list, so
// header/skeleton/body render it wherever `identityColumn` places it.
const IDENTITY_COL = Symbol("identity");
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

/** Control kinds the Filter panel can render for a `filterable` field. Omitted
 *  or unknown kinds render a text input — extend this union as you add controls
 *  (e.g. `"daterange"`, `"multiselect"`). */
export type FilterControl =
  | "text"
  | "number"
  | "date"
  | "select"
  | "combobox"
  | "checkbox";

/** Per-field Filter-panel config. `filterable: true` is shorthand for
 *  `{ control: "text" }`; pass an object to pick the control and shape it, so
 *  the front end can compose a different filter form per request (Name + Code as
 *  text for one screen, a status dropdown + tag checkboxes for another). */
export interface FieldFilter<T = Record<string, unknown>> {
  /** Which control to render. Default `"text"`. */
  control?: FilterControl;
  /** Label above the control. Defaults to the field's `label`. */
  label?: string;
  /** Placeholder for text / number / combobox inputs. */
  placeholder?: string;
  /** Choices for `select` / `combobox` / `checkbox`. A static array, or a
   *  function of the current filter values for cascading filters (e.g. Country
   *  options derived from the selected Region) — the panel recomputes it on every
   *  change and clears a value that's no longer valid. Falls back to the field's
   *  own (static) `options` when omitted. */
  options?:
    | { value: string; label: string }[]
    | ((values: FilterValues<T>) => { value: string; label: string }[]);
  /** Async option source — lazy-load filter options on open + debounced search
   *  instead of a static array. `values` is the current filter values (read a
   *  cascade parent from it). Only for `select` / `combobox` controls. */
  loadOptions?: (args: {
    search: string;
    signal: AbortSignal;
    values: FilterValues<T>;
  }) => Promise<AsyncOption[]>;
  /** Resolve one already-set value's label without loading the full list. */
  resolveOption?: (value: string) => Promise<AsyncOption | null>;
  /** Sibling field keys this filter cascades from; a change clears its options +
   *  value and the next open re-runs `loadOptions`. */
  dependsOn?: Extract<keyof T, string>[];
}

/** Values collected by the Filter panel, keyed by field. Single-value controls
 *  yield a `string`; multi-select `checkbox` yields a `string[]`. This object is
 *  the contract you hand to your own query / refetch via {@link RecordView}'s
 *  `onFilter` — in per-field mode the panel gathers values but does not match
 *  rows itself, so the search is yours (client-side or server-side). */
export type FilterValues<T> = Partial<
  Record<Extract<keyof T, string>, string | string[]>
>;

/** Current sort — the field key and direction, or `null` for unsorted. */
export type SortState = { key: string; dir: "asc" | "desc" };

/** The full query state reported by `onQueryChange` in server (`manual`) mode —
 *  everything needed to build a request. `page` is 1-based. */
export type ServerQuery<T> = {
  page: number;
  pageSize: number;
  sort: SortState | null;
  /** The keyword box. */
  search: string;
  /** Per-field filter values (from `filterable` fields). */
  filters: FilterValues<T>;
  /** Trash view active — the host should return soft-deleted rows instead of
   *  live ones (only meaningful when `showTrash` is enabled). */
  trash: boolean;
};

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
  /** Form section this field belongs to. Any title works; sections render in
   *  the order their fields first appear (ungrouped fields fall under
   *  "General"). E.g. `"Organization information"`, `"Brand assets"`. */
  group?: FieldGroup;
  /** Initial column width in px (user-resizable via the header handle). */
  width?: number;
  /** Show a copy-to-clipboard action on hover (e.g. email, phone). */
  copyable?: boolean;
  /** Max characters this cell shows before truncating with an ellipsis + hover
   *  tooltip. Overrides the view's `maxCellChars`. Set `0` to never truncate. */
  maxChars?: number;
  /** Show in the detail panel only, not as a table column (e.g. first/last name). */
  hideInTable?: boolean;
  /** Whether this field can be sorted — decoupled from column visibility.
   *  Default: sortable iff it's a visible column (`!hideInTable`), the historic
   *  behavior. Set `true` to sort a field with no column (e.g. a `hideInTable`
   *  name shown via `getPrimary`); set `false` to keep a visible column
   *  unsortable. Controls both the Sort dropdown and the column-header toggle. */
  sortable?: boolean;
  /** Custom, non-editable cell/value renderer. */
  render?: (row: T) => React.ReactNode;
  /** If set, the field becomes a choice field: the Add/Edit form renders a
   *  `Select` (or `Combobox`), and the selection toolbar offers a "Set {label}"
   *  bulk action. A static array, or a function of the current draft for
   *  dependent/cascading options (e.g. Country choices derived from the selected
   *  Region) — the form recomputes it as the draft changes and clears the field
   *  when its value is no longer a valid option. (Bulk "Set {label}" only lists
   *  static-array option fields, since it has no single draft to resolve against.) */
  options?:
    | { value: string; label: string }[]
    | ((draft: Partial<T>) => { value: string; label: string }[]);
  /** Form control for the Add/Edit panel/page. Default `"text"` (auto-growing
   *  textarea). `"number"`/`"date"` render the matching native input,
   *  `"checkbox"` a boolean toggle. For a field with `options`: default renders a
   *  `Select`, and `"combobox"` renders a searchable `Combobox` (type-to-filter)
   *  — use it for long option lists. */
  input?: "text" | "number" | "date" | "combobox" | "checkbox";
  /** Minimum bound, enforced before Save. For `input:"number"` it's the min
   *  value; otherwise the min character length. */
  min?: number;
  /** Maximum bound, enforced before Save. For `input:"number"` it's the max
   *  value; otherwise the max character length. */
  max?: number;
  /** Regex the value must match (a `RegExp` or a source string). */
  pattern?: RegExp | string;
  /** Friendly message shown when `pattern`/`format` fails (else a default). */
  patternMessage?: string;
  /** Built-in format check: `"email"` or `"phone"` (US). `"phone"` also
   *  auto-formats the value as `(123) 456-7890` while typing. */
  format?: "email" | "phone";
  /** Custom rule. Return an error message to block Save, or `undefined`/`""`
   *  when valid. Receives the field value and the whole draft (cross-field). */
  validate?: (value: string, draft: T) => string | undefined;
  /** Trim leading/trailing whitespace from this field's value on Save. */
  trim?: boolean;
  /** Render a custom Add/Edit control — a checkbox, a radio group, a color
   *  picker, anything. Overrides the default control entirely (and takes
   *  priority over `options`/`input`). You get the current string value and an
   *  `onChange` to write it back; the surrounding label, required mark, and Save
   *  validation still come from the field. Read-only View uses `render`. */
  renderInput?: (props: {
    value: string;
    onChange: (value: string) => void;
    field: RecordField<T>;
    invalid?: boolean;
  }) => React.ReactNode;
  /** Async option source for a choice field — lazy-load options on form open +
   *  debounced search instead of a static `options` array. Use for large/remote
   *  reference lists (FK pickers): the form fetches only when opened, resolves a
   *  set value's label via one record (`resolveOption`), and searches server-side.
   *  `values` is the current draft (read a cascade parent from it). Pairs with
   *  `input: "combobox"` (searchable) or the default `Select`. */
  loadOptions?: (args: {
    search: string;
    signal: AbortSignal;
    values: Partial<T>;
  }) => Promise<AsyncOption[]>;
  /** Resolve one already-set value's label without loading the whole list
   *  (edit/view + preselected default). */
  resolveOption?: (value: string) => Promise<AsyncOption | null>;
  /** Multi-select: the field holds a **set** of option values (`T[key]` is a
   *  `string[]`). Pairs with `input:"combobox"` (searchable) or static `options`
   *  — the Add/Edit form renders a multi-select with removable chips, and the
   *  read cell shows the labels (up to `maxChipsInCell`, then "+N" in a popover).
   *  `required` means at least one selected. */
  multiple?: boolean;
  /** Batch companion to `resolveOption`: resolve the labels for all currently-set
   *  values in one call (never the whole list). Used for `multiple` fields, and
   *  for single-value read displays, where the values a table paints in one go
   *  are collected and asked for together — 50 rows become one request. */
  resolveOptions?: (values: string[]) => Promise<AsyncOption[]>;
  /** The label to show in read mode, straight from the row. Set this when your
   *  payload already carries the label next to the id (`{ countryId, country }`)
   *  and the field never resolves anything: it paints instantly, with no
   *  request. Unlike `render` it only supplies the text, so the cell keeps its
   *  alignment, copy button and truncation. Return `""` for "no value". Read
   *  displays only — the edit control is unaffected. */
  displayValue?: (row: Partial<T>) => string;
  /** Max chips shown in a `multiple` read cell before collapsing to "+N".
   *  Default 3. */
  maxChipsInCell?: number;
  /** Sibling field keys this choice cascades from. A change clears the cached
   *  options + this field's value; the next open re-runs `loadOptions`. */
  dependsOn?: Extract<keyof T, string>[];
  /** Expose this field in the Filter panel. When ANY field is filterable, the
   *  panel switches from the single keyword box to a labeled control per field
   *  plus Search / Clear. `true` = a text input; pass a {@link FieldFilter} to
   *  choose the control (dropdown, checkbox, combobox, number, date …) so the
   *  filter form is composed per request. The panel only gathers values — wire
   *  matching through RecordView's `onFilter`. Omit to leave the field out. */
  filterable?: boolean | FieldFilter<T>;
}

/**
 * `useState` that mirrors to `sessionStorage` under `key`, so a page's work
 * (table filters/sort/page, a form draft) survives leaving and returning — the
 * per-tab work-preservation behind the open-tabs strip. When `key` is undefined
 * it is a plain `useState`, so this is fully opt-in and backward compatible.
 * Restores on mount (client-only, so exported/SSR markup still matches) and
 * never clobbers stored data with the initial value.
 */
function usePersistentState<T>(
  key: string | undefined,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(initial);
  // Stable reference to the seeded value. The writer skips it by identity (not a
  // first-write flag) so the write is StrictMode-safe: dev double-invokes the
  // write effect while `state` is still `initial`, and a flag flips on the first
  // pass so the second pass would persist `initial` OVER a draft the restore
  // effect is about to bring back. Comparing to this ref never writes `initial`,
  // so it can't clobber the stored draft.
  const initialRef = React.useRef(initial);
  React.useEffect(() => {
    if (!key) return;
    try {
      const raw = sessionStorage.getItem(key);
      if (raw !== null) setState(JSON.parse(raw) as T);
    } catch {
      // ignore malformed storage
    }
  }, [key]);
  React.useEffect(() => {
    if (!key) return;
    // Nothing to save while still the untouched seed; only a restore or a user
    // edit diverges `state` from it, and both should persist.
    if (state === initialRef.current) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage failures (private mode, quota)
    }
  }, [key, state]);
  return [state, setState];
}

/** Drop a persisted key — e.g. once a form Save/Cancel discards its draft. */
function clearPersisted(key: string | undefined) {
  if (!key) return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Resolve a choice field's form options against the current draft: a static
 *  array, or a function of the draft (cascading pickers). */
function resolveOptions<T>(
  opts: RecordField<T>["options"],
  draft: Partial<T>,
): { value: string; label: string }[] {
  return typeof opts === "function" ? opts(draft) : (opts ?? []);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Format US phone digits progressively while typing: 1234567890 →
 *  (123) 456-7890. Partial input stays readable. Exported for testing. */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Validate a field value against its declarative rules — returns the first error
 * message, or `undefined` when valid. Order: required → min/max → pattern →
 * format → custom. Exported for testing.
 */
export function validateField<T>(
  field: RecordField<T>,
  raw: string,
  draft: T,
): string | undefined {
  const value = field.trim ? raw.trim() : raw;
  const label = field.label;
  // Multi-select holds a set (String([]) === ""); only `required` applies —
  // length/pattern/format bounds are for scalar text.
  if (field.multiple) {
    return field.required && value === "" ? `${label} is required` : undefined;
  }
  if (field.required && value === "") return `${label} is required`;
  if (value === "") return undefined; // optional + empty → nothing else to check
  if (field.input === "number") {
    const n = Number(value);
    if (!Number.isFinite(n)) return `${label} must be a number`;
    if (field.min != null && n < field.min)
      return `${label} must be at least ${field.min}`;
    if (field.max != null && n > field.max)
      return `${label} must be at most ${field.max}`;
  } else {
    if (field.min != null && value.length < field.min)
      return `${label} must be at least ${field.min} characters`;
    if (field.max != null && value.length > field.max)
      return `${label} must be at most ${field.max} characters`;
  }
  if (field.pattern) {
    // Drop any global flag so repeated `.test()` calls are stateless.
    const re =
      typeof field.pattern === "string"
        ? new RegExp(field.pattern)
        : new RegExp(field.pattern.source, field.pattern.flags.replace("g", ""));
    if (!re.test(value)) return field.patternMessage ?? `${label} is invalid`;
  }
  if (field.format === "email" && !EMAIL_RE.test(value))
    return field.patternMessage ?? "Enter a valid email address";
  if (field.format === "phone" && value.replace(/\D/g, "").length !== 10)
    return field.patternMessage ?? "Enter a valid US phone number";
  if (field.validate) return field.validate(value, draft) || undefined;
  return undefined;
}

/** A field whose stored value is an async id (from `loadOptions`/`resolveOption`
 *  with no static `options`) — its read display must resolve the id to a label. */
export function isAsyncLabeled<T>(f: RecordField<T>): boolean {
  return Boolean(f.loadOptions && f.resolveOption) && !Array.isArray(f.options);
}

/**
 * How many columns of the *section* grid a section takes. A span wider than the
 * grid is clamped by the grid itself, so `span: 3` in a two-column form simply
 * fills the row.
 */
const SECTION_SPAN = {
  1: { 1: "", 2: "", 3: "", full: "" },
  2: { 1: "", 2: "md:col-span-2", 3: "md:col-span-2", full: "md:col-span-2" },
  3: {
    1: "",
    2: "md:col-span-2",
    3: "md:col-span-2 xl:col-span-3",
    full: "md:col-span-2 xl:col-span-3",
  },
} as const;

/**
 * A trailing card that would leave a gap stretches to fill its row instead, so
 * a form with an odd number of sections doesn't end in white space.
 *
 * Only used when no section declares its own `span`: once spans are in play the
 * nth-child arithmetic no longer matches what's on screen, and a wrong guess
 * looks worse than the gap.
 */
const SECTION_STRETCH = {
  1: "",
  2: "md:[&:last-child:nth-child(odd)]:col-span-2",
  3: "md:[&:last-child:nth-child(odd)]:col-span-2 xl:[&:last-child:nth-child(3n+1)]:col-span-3 xl:[&:last-child:nth-child(3n+2)]:col-span-2",
} as const;

/** The section grid: cards across the form, wrapping onto as many rows as they
 *  need, and collapsing to one column on small screens. */
const SECTION_GRID = {
  1: "space-y-5",
  2: "grid grid-cols-1 items-start gap-5 md:grid-cols-2",
  3: "grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3",
} as const;

/**
 * Every section card is the same two columns: `[i] Label *` and the control,
 * one field per row. The label track is `max-content`, so it widens to the
 * longest label in the card and never wraps, and every control in that card
 * starts at the same x. A form is made wider by putting cards side by side
 * (`sectionColumns`), never by cramming more fields into a row.
 */
const FIELD_GRID = "grid-cols-[max-content_minmax(14rem,1fr)]";

/** Hairlines between the two columns and between the rows. Lighter than the
 *  card's own border: enough to read the grid, not enough to draw the eye. */
const RULE = "border-border/50";

/**
 * Place a form's slots within one section, keyed by the field each follows.
 * The `""` bucket holds the ones with nothing to follow, which close out the
 * section. `after` puts a slot in that field's own section, `group` names a
 * section directly, and neither means the default one. Exported for testing.
 */
export function groupSlots<T>(
  fields: RecordField<T>[],
  slots: FormSlot<T>[] | undefined,
  group: string,
): Map<string, FormSlot<T>[]> {
  const fieldGroup = (key: string) =>
    fields.find((f) => f.key === key)?.group ?? "General";
  const byAfter = new Map<string, FormSlot<T>[]>();
  for (const slot of slots ?? []) {
    const target =
      slot.group ?? (slot.after ? fieldGroup(slot.after) : "General");
    if (target !== group) continue;
    // Follow the named field only when it is actually in this section.
    const key = slot.after && fieldGroup(slot.after) === group ? slot.after : "";
    byAfter.set(key, [...(byAfter.get(key) ?? []), slot]);
  }
  return byAfter;
}

/** Read-mode label for an async-id field. Resolves the set value's label via
 *  `resolveOption` (one record, never the whole list) and renders it, showing a
 *  skeleton until it lands — never the raw id, which means nothing to a reader.
 *  A value that resolves to nothing reads "Unknown" (the id stays in the
 *  tooltip). Used wherever a value is *shown* (form read rows, detail panels,
 *  table cells) — the edit control already resolves its own label. */
function AsyncFieldValue<T>({
  field,
  value,
  values,
}: {
  field: RecordField<T>;
  value: string;
  values: Partial<T>;
}) {
  // Rebuilt each render (the hook holds it in a ref, so this never refetches);
  // `open: false` means `loadOptions` is never called — only `resolveOption` runs.
  const source = React.useMemo<AsyncOptionSource>(
    () => ({
      loadOptions: ({ search, signal }) =>
        field.loadOptions!({ search, signal, values }),
      // With `resolveOptions`, every cell of this column that paints in the same
      // tick is resolved by one call instead of one call each.
      resolveOptions: field.resolveOptions,
      resolveOption: field.resolveOption,
    }),
    [field, values],
  );
  const resetKey = (field.dependsOn ?? [])
    .map((k) => String((values as Record<string, unknown>)[k] ?? ""))
    .join(" ");
  // One resolveOption per distinct value: identical in-flight requests are
  // shared inside the hook, so N cells on the same id cost one round trip.
  const { options, resolving } = useAsyncOptions({
    source,
    open: false,
    search: "",
    value,
    resetKey,
  });
  const label = options.find((o) => o.value === value)?.label;
  if (label !== undefined) return <>{label}</>;
  if (resolving) return <Skeleton className="h-4 w-24" />;
  return <MissingValue />;
}

/** Nothing to show: an empty value, or a reference whose label never resolved
 *  (deleted record, failed request). Both are missing data, so both read the
 *  same. The id is never shown — it isn't a value a reader can use. */
export function MissingValue() {
  return <span className="text-muted-foreground">—</span>;
}

/** Read display for a `multiple` field: resolves each value's label (batch via
 *  the field's `resolveOptions`, or static `options`) and shows up to
 *  `maxChipsInCell` chips, then "+N" with the full list in a tooltip. */
function MultiFieldValue<T>({
  field,
  values,
  row,
}: {
  field: RecordField<T>;
  values: string[];
  row: Partial<T>;
}) {
  const source = React.useMemo<AsyncOptionSource | undefined>(
    () =>
      field.loadOptions
        ? {
            loadOptions: ({ search, signal }) =>
              field.loadOptions!({ search, signal, values: row }),
            resolveOptions: field.resolveOptions,
            resolveOption: field.resolveOption,
          }
        : undefined,
    [field, row],
  );
  const resetKey = (field.dependsOn ?? [])
    .map((k) => String((row as Record<string, unknown>)[k] ?? ""))
    .join(" ");
  const { options, resolving } = useAsyncOptions({
    source,
    open: false,
    search: "",
    value: values,
    resetKey,
  });
  const staticOpts = Array.isArray(field.options) ? field.options : [];
  const labelOf = (v: string) =>
    options.find((o) => o.value === v)?.label ??
    staticOpts.find((o) => o.value === v)?.label;
  const resolvedLabels = values.map(labelOf);
  if (!values.length) return <MissingValue />;
  // Same rule as the single value: a skeleton until the labels land, never ids.
  if (resolving && resolvedLabels.some((l) => l === undefined))
    return <Skeleton className="h-4 w-32" />;
  // A value that never resolved is dropped rather than shown as an id.
  const labels = resolvedLabels.filter((l): l is string => l !== undefined);
  if (!labels.length) return <MissingValue />;
  const max = field.maxChipsInCell ?? 3;
  const shown = labels.slice(0, max);
  const extra = labels.length - shown.length;
  const chip =
    "inline-flex max-w-[10rem] items-center truncate rounded-sm bg-accent px-1.5 py-0.5 text-xs text-accent-foreground";
  return (
    <span className="flex flex-wrap items-center gap-1">
      {shown.map((l, i) => (
        <span key={i} className={chip}>
          {l}
        </span>
      ))}
      {extra > 0 && (
        <Tooltip content={labels.join(", ")}>
          <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            +{extra}
          </span>
        </Tooltip>
      )}
    </span>
  );
}

// Module-scoped response cache for RecordView's `fetcher` mode. Namespaced by
// `cacheKey` and living outside any component, so a cached page survives a
// remount / tab switch — the return is instant with no refetch. LRU per
// namespace (insertion order = recency), optional TTL.
type RvCacheEntry = { rows: unknown[]; total: number; at: number };
const RV_CACHE = new Map<string, Map<string, RvCacheEntry>>();

// Minimum time the loading shimmer stays up per `fetcher` load, so a cache hit
// (instant, from memory) shows the same animation as a real fetch — consistent
// feedback instead of a blank flash. Real fetches longer than this are unaffected.
const RV_MIN_LOADING_MS = 300;

// `process.env.NEXT_PUBLIC_*` is statically inlined by the consumer's bundler
// (Next / Vite) at build; declare its shape so this source type-checks on its
// own (the package ships without @types/node).
declare const process: { env: Record<string, string | undefined> };

// Default max characters a table cell shows before truncating with an ellipsis
// (+ hover tooltip). From env (inlined at build), fallback 25. Override per-view
// with `maxCellChars`, or per-field with `maxChars` (0 = never truncate).
const MAX_CELL_CHARS = (() => {
  const n = Number(process.env.NEXT_PUBLIC_MAX_CELL_CHARS);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 25;
})();

// Rows-per-page defaults, from env (inlined at build). DEFAULT is the initial
// page size; MAX is the ceiling the page-size selector won't exceed. In `manual`
// / `fetcher` mode the DATA LAYER must independently clamp its returned page to
// MAX — the client's requested size can't be trusted. Override per-view with
// `defaultPageSize` / `maxPageSize`.
const DEFAULT_PAGE_SIZE = (() => {
  const n = Number(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 25;
})();
const MAX_PAGE_SIZE = (() => {
  const n = Number(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : Infinity;
})();

// User column resizing (drag a header's right edge to widen a column). On by
// default so long values in a narrow column are always reachable; from env
// (inlined at build) — set NEXT_PUBLIC_RESIZABLE_COLUMNS=0 (or false) to turn it
// off globally. Override per-view with the `resizableColumns` prop.
const RESIZABLE_COLUMNS = (() => {
  const v = process.env.NEXT_PUBLIC_RESIZABLE_COLUMNS;
  return v !== "0" && v !== "false";
})();

/** Clip a cell string to `max` characters. Returns the display text and, when
 *  clipped, the full text for a `title` (hover tooltip). */
function clipCell(value: string, max: number): { text: string; full?: string } {
  if (max <= 0 || value.length <= max) return { text: value };
  return { text: value.slice(0, max).trimEnd() + "…", full: value };
}

function rvQueryKey<T>(q: ServerQuery<T>): string {
  return JSON.stringify([q.page, q.pageSize, q.sort, q.search, q.filters, q.trash]);
}
function rvCacheGet(
  ns: string,
  key: string,
  ttlMs: number,
): RvCacheEntry | null {
  const bucket = RV_CACHE.get(ns);
  const hit = bucket?.get(key);
  if (!hit) return null;
  if (ttlMs > 0 && Date.now() - hit.at > ttlMs) {
    bucket!.delete(key);
    return null;
  }
  // Refresh recency.
  bucket!.delete(key);
  bucket!.set(key, hit);
  return hit;
}
function rvCacheSet(ns: string, key: string, entry: RvCacheEntry, max: number) {
  let bucket = RV_CACHE.get(ns);
  if (!bucket) {
    bucket = new Map();
    RV_CACHE.set(ns, bucket);
  }
  bucket.delete(key);
  bucket.set(key, entry);
  while (bucket.size > max) {
    const oldest = bucket.keys().next().value;
    if (oldest === undefined) break;
    bucket.delete(oldest);
  }
}

interface RecordViewProps<T extends { id: RowId }> {
  title: string;
  singular: string;
  icon?: IconType;
  fields: RecordField<T>[];
  /** Seed rows for a client-managed table. Optional — omit in `fetcher`/`manual`
   *  mode (the server owns the data) or for a read-only list. Defaults to `[]`. */
  initialData?: T[];
  /** Factory for a blank row, used by the Add action. Omit it (and `onCreate`)
   *  for a read-only list — the "+ New" button is then hidden. */
  makeEmptyRow?: () => T;
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
  /** Receives the next rows array after an add, edit, delete or restore.
   *
   *  In `manual`/`fetcher` mode this is your persist hook, and **returning a
   *  promise matters**: RecordView waits for it before reloading, so the reload
   *  sees your write instead of racing it. Return nothing and the reload fires
   *  immediately, which is only right when you persist elsewhere. */
  onDataChange?: (rows: T[]) => void | Promise<void>;
  /** When set, the "add" button calls this (e.g. navigate to a create route)
   *  instead of opening the built-in form. */
  onCreate?: () => void;
  /** When set, opening/editing a row navigates (e.g. to an edit route) instead
   *  of opening the built-in overlay form. */
  onView?: (id: RowId) => void;
  onEdit?: (id: RowId) => void;
  /** Notified whenever the Add / View / Edit form opens, so you can lazily load
   *  field data (e.g. FK/combobox option catalogs) only when a user actually
   *  opens a form — not on every table mount. Pure notification: it does **not**
   *  suppress the form (unlike `onCreate`/`onView`/`onEdit`, which redirect). In
   *  panel mode `row` is the record being opened (the fresh draft for "create");
   *  in page mode it fires alongside the redirect for symmetry. */
  onFormOpen?: (mode: "create" | "edit" | "view", row?: T) => void;
  /** Persist this view's filter / sort / page under this key (e.g. the route),
   *  so the work survives leaving and returning via the open-tabs strip. */
  persistKey?: string;
  /** Allow dragging a column's right edge to resize it. Defaults to
   *  `NEXT_PUBLIC_RESIZABLE_COLUMNS` (on unless set to `0`/`false`), so a long
   *  value in a narrow column is always reachable. Set `false` to force
   *  auto-sizing with no resize handle. */
  resizableColumns?: boolean;
  /** Called from the Filter panel's Search (and Clear) when fields are
   *  `filterable`. Receives the collected per-field values; run your own query
   *  or client-side filtering here. In per-field mode the panel does not match
   *  rows itself, so the behavior is entirely yours. */
  onFilter?: (values: FilterValues<T>) => void;
  /** Show animated skeleton rows instead of the table body while data loads
   *  from the server (an initial fetch or a filter/refetch). Set it around your
   *  async load; the toolbar stays usable. */
  loading?: boolean;
  /** Server-side mode. When `true`, RecordView does NOT filter, sort, or
   *  paginate `data` — it renders `data` as the current page verbatim and reports
   *  query state via `onQueryChange`, so your backend does the work. Pair with
   *  `rowCount` (for totals), `loading`, and `onQueryChange`. Default `false`
   *  (everything client-side). */
  manual?: boolean;
  /** Total row count on the server — drives the pagination footer and page count
   *  in `manual` mode (RecordView can't infer it from a single page of `data`). */
  rowCount?: number;
  /** Server mode: called with the full query whenever page, page size, sort, or
   *  the keyword changes (and on the per-field Filter Search/Clear). Fetch and
   *  update `data` + `rowCount` + `loading` in response. Fires once on mount for
   *  the initial load; debounce inside if keyword changes are chatty. */
  onQueryChange?: (query: ServerQuery<T>) => void;
  /** Server data source. Providing it turns on `manual` and hands RecordView
   *  ownership of the read path: it calls this on every query change and manages
   *  `data` / `rowCount` / `loading` + caching itself — so you don't wire those
   *  or `onQueryChange`. Return the current page plus the server total. The
   *  `signal` aborts superseded requests. Mutually exclusive with the
   *  consumer-managed props above (if both are set, `fetcher` wins). */
  fetcher?: (
    query: ServerQuery<T>,
    signal: AbortSignal,
  ) => Promise<{ rows: T[]; total: number }>;
  /** Namespaces the `fetcher` response cache (like `persistKey`). Responses are
   *  cached per query and survive remounts / tab switches, so returning to a tab
   *  is instant with no refetch. Omit → no caching (always refetch). */
  cacheKey?: string;
  /** `fetcher` cache tuning. Default `{ max: 50, ttlMs: 0 }` (LRU, no expiry). */
  cache?: { max?: number; ttlMs?: number };
  /** Called when a `fetcher` request rejects (non-abort). RecordView keeps the
   *  previously loaded data and clears the loading state. */
  onError?: (error: unknown, query: ServerQuery<T>) => void;
  /** Max characters any table cell shows before truncating to one line with an
   *  ellipsis + hover tooltip (long text never wraps). Defaults to
   *  `NEXT_PUBLIC_MAX_CELL_CHARS` (or 25). Per-field `maxChars` overrides it. */
  maxCellChars?: number;
  /** Initial rows per page. Defaults to `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` (or 25),
   *  clamped to `maxPageSize`. */
  defaultPageSize?: number;
  /** Ceiling for the page-size selector (options above it are hidden). Defaults
   *  to `NEXT_PUBLIC_MAX_PAGE_SIZE` (or unbounded). In server mode the data layer
   *  must enforce this too — the client's requested size isn't trusted. */
  maxPageSize?: number;
  /** Header for the leading identity column. Default "Name" — set e.g. "Title"
   *  for tables whose identity is a title field (regions, roles, …). */
  nameLabel?: string;
  /** Field key the identity column sorts by, so its header toggles sort + shows a
   *  caret like other columns. Defaults to the first `hideInTable` field marked
   *  `sortable` (the field that drives `getPrimary`). Unset + none found → the
   *  identity header stays static. */
  nameSortKey?: Extract<keyof T, string>;
  /** Where the leading identity (Name/Title) column sits among the field columns.
   *  `"first"` (default) | `"last"` | `"hidden"` (no identity column), or a number
   *  = how many field columns come before it (e.g. `1` → Region, Title, Code).
   *  Lets the app order reference tables like Country/State/City freely. */
  identityColumn?: number | "first" | "last" | "hidden";
  /** Toolbar feature toggles — each defaults to **on**, so leaving them unset
   *  keeps the full toolbar. Set one to `false` to remove that control.
   *  `filter` / `sort` / `pagination` are standard; `import` / `export` are the
   *  ones you'll typically turn off per page. */
  /** Show the Import (CSV/JSON/Excel) menu. Default `true`. */
  showImport?: boolean;
  /** Show the Export (CSV/Excel/JSON/PDF) menu. Default `true`. */
  showExport?: boolean;
  /** Show the "+ {singular}" add button (still also requires `onCreate` or
   *  `makeEmptyRow`). Default `true`. */
  showAdd?: boolean;
  /** Columns the add/edit form's **sections** flow across: 1, 2 or 3. The form
   *  is a grid of section cards, each itself a grid of fields. Falls back to
   *  `form.sectionColumns`, then 1. */
  sectionColumns?: SectionColumns;
  /** Declare the form's sections to fix their order, let one span the row, or
   *  give one its own field layout. Omit and they come from each field's
   *  `group`, in the order the groups first appear. */
  sections?: FormSection[];
  /** Behaviour overrides for this table only: what a row click does, whether
   *  delete confirms, how long the saved-row highlight lasts, and so on. Falls
   *  back to `VuiProvider`'s `behaviour`, then to the shipped defaults. */
  behaviour?: BehaviourConfig;
  /** Footer buttons for the add/edit/view form. An array replaces Cancel + Save
   *  (or Close + Edit in view mode); a function receives those defaults so you
   *  can add, reorder or swap one without restating the rest:
   *  `formActions={(d) => [...d, saveAndNew]}`. Falls back to `VuiProvider`'s
   *  `form.actions`, then to the shipped pair. */
  formActions?: FormActionsConfig<T>;
  /** Replace the form footer outright. The array covers almost everything, so
   *  reach for this only when it genuinely can't express what you need. */
  renderFooter?: (ctx: FormActionContext<T>) => React.ReactNode;
  /** Your own content between the form's fields — a callout, a preview, a pair
   *  of custom controls. Each slot renders as a full-width row inside its
   *  section, so it inherits the card, separators and padding. */
  formSlots?: FormSlot<T>[];
  /** Show the row Edit (pencil) action and the Edit button on the view panel.
   *  Defaults to whether any field is `editable`, so a read-only list (every
   *  field `editable: false`) gets no Edit affordance instead of one that opens
   *  an empty form. Set `false` to hide it on an otherwise editable table. */
  showEdit?: boolean;
  /** Show the Filter panel. Default `true`. */
  showFilter?: boolean;
  /** Extra rows to add to the Filter panel. Compose with `FilterField`
   *  (from `@viliha/vui-ui/filter-field`) so they inherit the two-column
   *  label │ control layout; render inside the same grid, below the
   *  `filterable` fields. Their state and matching are yours to manage. */
  filterExtras?: React.ReactNode;
  /** Show the Sort menu. Default `true`. */
  showSort?: boolean;
  /** Show the pagination footer. When `false` in client mode, all rows render
   *  (no page slicing). Default `true`. */
  showPagination?: boolean;
  /** Show row selection — the checkbox column, bulk Actions, and Clear
   *  selection. `false` also removes drag-to-reorder (it shares the leading
   *  column). Default `true`. */
  showSelection?: boolean;
  /** Show a **Trash** toggle in the header (left of the Filter control). Off by
   *  default. Enabling it lets RecordView switch the SAME table between live and
   *  soft-deleted rows. RecordView is display-only here — it never decides what
   *  "deleted" means; the host supplies the trashed rows (`trashedData` in client
   *  mode, or the `trash: true` query in `manual`/`fetcher` mode) and persists
   *  restores via `onRestore`. */
  showTrash?: boolean;
  /** Soft-deleted rows shown while Trash is active in **client mode** (`data` +
   *  `onDataChange`). Omit in `manual`/`fetcher` mode — there the host returns
   *  trashed rows for the `trash: true` query instead. */
  trashedData?: T[];
  /** Restore rows from Trash — one row (its Restore icon) or the current
   *  selection (bulk "Restore N selected"), after a confirm. The HOST persists
   *  the restore via its own API; RecordView clears the selection and refetches
   *  (`manual`) / expects the host to drop the rows from `trashedData` (client),
   *  so they leave Trash and return to Live. Providing this prop is what enables
   *  the Restore actions. Mirrors how `onDataChange` surfaces delete. */
  onRestore?: (rows: T[]) => void | Promise<void>;
}

/** Empty-table message: a keyword search, active per-field filters, or a
 *  genuinely empty list read differently. Exported for testing. */
export function emptyStateLabel<T>(
  filter: string,
  filterValues: FilterValues<T>,
): string {
  if (filter) return `No results for “${filter}”.`;
  const hasFieldFilter = Object.values(filterValues).some((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v),
  );
  return hasFieldFilter ? "No matching records." : "No records yet.";
}

/** Whether the Edit affordances (row pencil, view-panel Edit) show: the host's
 *  `showEdit` if given, else whether there is anything to edit. Exported for
 *  testing. */
export function showEditActions<T>(
  fields: RecordField<T>[],
  showEdit?: boolean,
): boolean {
  return showEdit ?? fields.some((f) => f.editable);
}

export function RecordView<T extends { id: RowId }>({
  title,
  singular,
  icon: TitleIcon,
  fields,
  initialData = [],
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
  onFormOpen,
  persistKey,
  resizableColumns = RESIZABLE_COLUMNS,
  onFilter,
  loading = false,
  manual = false,
  rowCount,
  onQueryChange,
  fetcher,
  cacheKey,
  cache,
  onError,
  maxCellChars = MAX_CELL_CHARS,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  maxPageSize = MAX_PAGE_SIZE,
  nameLabel = "Name",
  nameSortKey,
  identityColumn = "first",
  showImport = true,
  showExport = true,
  showAdd = true,
  sectionColumns,
  sections,
  behaviour: behaviourProp,
  formActions,
  renderFooter,
  formSlots,
  showEdit,
  showFilter = true,
  filterExtras,
  showSort = true,
  showPagination = true,
  showSelection = true,
  showTrash = false,
  trashedData,
  onRestore,
}: RecordViewProps<T>) {
  const behaviour = useResolved("behaviour", behaviourProp) ?? {};
  // No editable field means the Edit form would open empty, so the affordance
  // is hidden unless the host asks for it explicitly.
  const canEdit = showEditActions(fields, showEdit);
  const { titleLeading } = React.useContext(PageChromeContext);
  // Surface the page title/icon in the app's global top bar.
  usePageTitle(title, TitleIcon);
  // Rows: `fetcher`-owned (server), controlled (data + onDataChange), or held
  // internally. `fetcher` implies manual mode.
  const fetching = fetcher !== undefined;
  const isManual = manual || fetching;
  const [internalRows, setInternalRows] = React.useState<T[]>(initialData);
  // Latest internal rows, so a mutation can compute the next array without
  // taking `internalRows` as a dependency (which would rebuild `setRows`).
  const internalRef = React.useRef<T[]>(internalRows);
  internalRef.current = internalRows;
  const controlled = data !== undefined;

  // Fetcher-managed state (only used when `fetcher` is set).
  const [fetchedData, setFetchedData] = React.useState<T[]>([]);
  // Latest fetched rows, so a mutation can compute the next array without
  // taking `fetchedData` as a dependency (which would rebuild `setRows`).
  const fetchedRef = React.useRef<T[]>(fetchedData);
  fetchedRef.current = fetchedData;
  const [fetchedTotal, setFetchedTotal] = React.useState(0);
  const [fetchedLoading, setFetchedLoading] = React.useState(fetching);
  const reqIdRef = React.useRef(0);
  const abortRef = React.useRef<AbortController | null>(null);
  const queryRef = React.useRef<ServerQuery<T> | null>(null);
  const ttlMs = cache?.ttlMs ?? 0;
  const cacheMax = cache?.max ?? 50;

  const runFetch = React.useCallback(
    (q: ServerQuery<T>, opts?: { background?: boolean }) => {
      if (!fetcher) return;
      const id = ++reqIdRef.current;
      const started = Date.now();
      // Reveal the data, but hold the shimmer for a consistent minimum so a
      // cache hit (served from memory, no server call) looks the same as a real
      // fetch — same animation every time, never a confusing blank flash.
      const commit = (rows: T[], total: number) => {
        const apply = () => {
          if (id !== reqIdRef.current) return; // superseded
          setFetchedData(rows);
          setFetchedTotal(total);
          setFetchedLoading(false);
        };
        const wait = RV_MIN_LOADING_MS - (Date.now() - started);
        if (opts?.background || wait <= 0) apply();
        else window.setTimeout(apply, wait);
      };

      // Foreground cache hit: no server round-trip — the data is in memory.
      if (!opts?.background && cacheKey) {
        const hit = rvCacheGet(cacheKey, rvQueryKey(q), ttlMs);
        if (hit) {
          setFetchedLoading(true);
          commit(hit.rows as T[], hit.total);
          return;
        }
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      if (!opts?.background) setFetchedLoading(true);
      fetcher(q, controller.signal)
        .then((res) => {
          if (id !== reqIdRef.current) return; // superseded
          if (cacheKey)
            rvCacheSet(
              cacheKey,
              rvQueryKey(q),
              { rows: res.rows, total: res.total, at: Date.now() },
              cacheMax,
            );
          commit(res.rows, res.total);
        })
        .catch((err) => {
          if (controller.signal.aborted || id !== reqIdRef.current) return;
          setFetchedLoading(false);
          onError?.(err, q);
        });
    },
    [fetcher, cacheKey, ttlMs, cacheMax, onError],
  );
  // Abort any in-flight request on unmount.
  React.useEffect(() => () => abortRef.current?.abort(), []);

  // Trash view: show soft-deleted rows instead of live ones. Display-only — the
  // host supplies them via `trashedData` (client) or the `trash: true` query
  // (manual/fetcher, where the host swaps `data`/the fetch result).
  const [trash, setTrash] = React.useState(false);
  const rows = fetching
    ? fetchedData
    : trash && trashedData !== undefined
      ? trashedData
      : controlled
        ? data
        : internalRows;
  /**
   * Update the rows we render without treating it as a data change: no
   * `onDataChange`, no cache invalidation, no refetch. Opening a blank Add form
   * and throwing that draft away are not mutations, and routing them through the
   * mutation path made a server-backed table refetch immediately, which returned
   * a page without the draft in it and closed the form the user had just opened.
   */
  const setRowsLocal = React.useCallback(
    (updater: React.SetStateAction<T[]>) => {
      if (fetching) {
        setFetchedData((prev) =>
          typeof updater === "function"
            ? (updater as (p: T[]) => T[])(prev)
            : updater,
        );
        return;
      }
      if (controlled) {
        const next =
          typeof updater === "function"
            ? (updater as (prev: T[]) => T[])(data as T[])
            : updater;
        onDataChange?.(next); // the host holds the rows; it must hold the draft
        return;
      }
      setInternalRows(updater);
    },
    [fetching, controlled, data, onDataChange],
  );

  const setRows = React.useCallback(
    (updater: React.SetStateAction<T[]>) => {
      const apply = (prev: T[]) =>
        typeof updater === "function"
          ? (updater as (p: T[]) => T[])(prev)
          : updater;
      /** Reload after the host's write lands. Reloading first would race the
       *  POST/PATCH and repaint pre-write rows, which is why a save looked
       *  lost. A host that returns nothing keeps the old, immediate reload. */
      const afterWrite = (written: void | Promise<void>, reload: () => void) => {
        if (written && typeof written.then === "function") {
          void written.then(reload, (err: unknown) => {
            if (queryRef.current) onError?.(err, queryRef.current);
            reload(); // the optimistic row didn't persist; show server truth
          });
        } else {
          reload();
        }
      };
      if (fetching) {
        // Optimistic local update, then invalidate the cache and reload the
        // current query in the background so the table reflects server truth.
        const next = apply(fetchedRef.current);
        setFetchedData(next);
        afterWrite(onDataChange?.(next), () => {
          if (cacheKey) RV_CACHE.delete(cacheKey);
          if (queryRef.current) runFetch(queryRef.current, { background: true });
        });
        return;
      }
      if (isManual && !controlled) {
        // Server mode where the host owns the fetch: mutate locally so the row
        // is there immediately, then re-emit the query so the host reloads the
        // page it just wrote. Only a host that returns a promise from
        // `onDataChange` gets that reload — without one there is nothing to
        // wait for, and reloading would race a write we can't see.
        const next = apply(internalRef.current);
        setInternalRows(next);
        const written = onDataChange?.(next);
        if (written && typeof written.then === "function") {
          afterWrite(written, () => {
            if (queryRef.current) onQueryChange?.(queryRef.current);
          });
        }
        return;
      }
      if (controlled) {
        onDataChange?.(apply(data as T[]));
      } else {
        setInternalRows(updater);
      }
    },
    [
      fetching,
      isManual,
      cacheKey,
      runFetch,
      controlled,
      data,
      onDataChange,
      onQueryChange,
      onError,
    ],
  );
  // Manual (server) mode without the controlled `data` prop feeds each page
  // through `initialData` and refetches via `onQueryChange`. Re-sync the internal
  // copy whenever that seed changes so a post-mutation reload (create/edit/delete)
  // or a narrowed filter replaces the stranded optimistic rows — otherwise the
  // grid keeps showing stale rows until a manual reload. Controlled mode reads
  // `data` live; client mode keeps its rows (local edits own them).
  React.useEffect(() => {
    if (isManual && !controlled) setInternalRows(initialData);
  }, [isManual, controlled, initialData]);
  const [filter, setFilter] = usePersistentState(
    persistKey ? `${persistKey}::filter` : undefined,
    "",
  );
  // Per-field Filter-panel values (opt-in via `field.filterable`). Kept apart
  // from the single-keyword `filter`; persisted like the rest of the view.
  const [filterValues, setFilterValues] = usePersistentState<FilterValues<T>>(
    persistKey ? `${persistKey}::filterValues` : undefined,
    {},
  );
  const [sort, setSort] = usePersistentState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(persistKey ? `${persistKey}::sort` : undefined, null);
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
  /** The unsaved record an open Add form is editing, kept outside `rows` so a
   *  refetch can't take it away mid-edit. */
  const [draftRow, setDraftRow] = React.useState<T | null>(null);
  // Row pending delete confirmation.
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<RowId | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  // Restore-from-Trash confirms (single row id / current selection), mirroring delete.
  const [confirmRestoreId, setConfirmRestoreId] = React.useState<RowId | null>(null);
  const [bulkRestoreOpen, setBulkRestoreOpen] = React.useState(false);
  // Whether the detail panel opened read-only (View) or editable (Edit / Add).
  const [panelReadOnly, setPanelReadOnly] = React.useState(false);
  const [page, setPage] = usePersistentState(
    persistKey ? `${persistKey}::page` : undefined,
    1,
  );
  // Page-size selector options: never above `maxPageSize` (guard against an
  // empty list if the ceiling is below the smallest preset).
  const pageSizeOptions = React.useMemo(() => {
    const opts = PAGE_SIZES.filter((n) => n <= maxPageSize);
    return opts.length ? opts : [Math.max(1, Math.floor(maxPageSize))];
  }, [maxPageSize]);
  const [pageSize, setPageSize] = React.useState<number>(() =>
    Math.min(Math.max(1, Math.floor(defaultPageSize)), maxPageSize),
  );
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
  // Column order: field columns with the identity (Name/Title) column inserted
  // at `identityColumn` (or hidden). `IDENTITY_COL` marks the identity slot so
  // the header, skeleton, and body rows all render in one consistent order.
  const orderedCols: (RecordField<T> | typeof IDENTITY_COL)[] = (() => {
    const cols: (RecordField<T> | typeof IDENTITY_COL)[] = [...visibleFields];
    if (identityColumn === "hidden") return cols;
    const at =
      identityColumn === "first"
        ? 0
        : identityColumn === "last"
          ? cols.length
          : Math.max(0, Math.min(identityColumn, cols.length));
    cols.splice(at, 0, IDENTITY_COL);
    return cols;
  })();
  // Sorting is decoupled from column visibility: a field is sortable when its
  // `sortable` flag says so, else it falls back to "is a visible column".
  const canSort = (f: RecordField<T>) => f.sortable ?? !f.hideInTable;
  // Fields offered in the Sort dropdown (may include hidden-but-sortable fields
  // and exclude visible-but-unsortable ones).
  const sortFields = fields.filter(canSort);
  // Field the identity column sorts by (its header toggles + shows a caret).
  // Explicit `nameSortKey`, else the first hidden field marked sortable (the one
  // that drives getPrimary). Undefined → identity header stays static.
  const nameSortKeyResolved =
    nameSortKey ?? fields.find((f) => f.hideInTable && canSort(f))?.key;
  // Fields opted into per-field filtering. Non-empty → the Filter panel renders
  // a control per field instead of the single keyword box.
  const filterFields = fields.filter((f) => f.filterable);

  // The primary "Name" column renders the record's name field, which is hidden
  // as a regular column (hideInTable) because it shows here. Mirror its
  // required mark so a mandatory name shows `*` like every other column.
  // ponytail: name field = a required hideInTable field (the app convention).
  const nameRequired = fields.some((f) => f.hideInTable && f.required);

  const nameWidth = colWidths[NAME_COL] ?? NAME_DEFAULT_W;
  const totalWidth =
    (showSelection ? CHECKBOX_W : 0) +
    ACTIONS_W +
    nameWidth +
    visibleFields.reduce(
      (sum, f) => sum + (colWidths[f.key] ?? fieldDefaultWidth(f)),
      0,
    );

  const resizeHandle = (col: string, label: string) =>
    !resizableColumns ? null : (
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
    // Server mode: `rows` is already the filtered/sorted current page — render
    // it verbatim (no client-side filter/sort).
    if (isManual) return rows;
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
  }, [isManual, rows, filter, sort, fields, getPrimary]);

  // A refetch (a mutation elsewhere, a tab refocus, a poll) replaces `rows`
  // with what the server returned, which never contains an unsaved draft. Fall
  // back to the draft we're holding so an open Add form survives it.
  const activeRow =
    rows.find((r) => r.id === activeId) ??
    (activeId != null && activeId === newRowId ? draftRow : null) ??
    null;
  const deleteTarget =
    confirmDeleteId != null
      ? (rows.find((r) => r.id === confirmDeleteId) ?? null)
      : null;

  // Pagination (derived; `page` is clamped so it never points past the last page).
  // Server mode: totals come from `rowCount`, and `data` is already this page —
  // so render it whole (no slice) and size the range to what the server returned.
  const total = isManual
    ? fetching
      ? fetchedTotal
      : (rowCount ?? processed.length)
    : processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const rangeStart = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = isManual
    ? total === 0
      ? 0
      : Math.min(rangeStart + processed.length - 1, total)
    : Math.min(safePage * pageSize, total);
  const paged = isManual
    ? processed
    : showPagination
      ? processed.slice((safePage - 1) * pageSize, safePage * pageSize)
      : processed;
  // Loading state comes from the fetcher when it owns the data.
  const effectiveLoading = fetching ? fetchedLoading : loading;
  // Keep the current query fresh for post-mutation background refetches.
  queryRef.current = {
    page: safePage,
    pageSize,
    sort,
    search: filter,
    filters: filterValues,
    trash,
  };

  // Reset to the first page when the filter, page size, or Trash view changes.
  React.useEffect(() => {
    setPage(1);
  }, [filter, pageSize, trash, setPage]);

  // Switching between Live and Trash clears the selection (it doesn't carry
  // across views) and closes any open detail panel.
  React.useEffect(() => {
    setSelected(new Set());
    setActiveId(null);
  }, [trash]);

  // Server mode: report the query so the consumer can fetch. Fires on page,
  // size, sort, and keyword changes (and once on mount for the initial load).
  // Per-field filters emit via the Filter panel's Search/Clear instead, so they
  // apply on demand, not per keystroke. `filterValues` is read fresh here but
  // deliberately left out of the deps for that reason.
  React.useEffect(() => {
    if (!isManual) return;
    const query: ServerQuery<T> = {
      page: safePage,
      pageSize,
      sort,
      search: filter,
      filters: filterValues,
      trash,
    };
    // `fetcher` owns the fetch; otherwise hand the query to the consumer.
    if (fetching) runFetch(query);
    else onQueryChange?.(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManual, fetching, safePage, pageSize, sort, filter, trash, onQueryChange, runFetch]);

  // Cascading filter options: when the values change, drop any filter value no
  // longer valid once its options recompute (e.g. changing Region invalidates a
  // Country filter). Only function-options filters cascade. Strings clear; multi
  // (checkbox) arrays keep the still-valid entries.
  React.useEffect(() => {
    let changed = false;
    const next: FilterValues<T> = { ...filterValues };
    for (const f of fields) {
      const cfg = typeof f.filterable === "object" ? f.filterable : null;
      if (!cfg || typeof cfg.options !== "function") continue;
      const valid = new Set(cfg.options(filterValues).map((o) => o.value));
      const v = filterValues[f.key];
      if (typeof v === "string" && v && !valid.has(v)) {
        next[f.key] = "";
        changed = true;
      } else if (Array.isArray(v)) {
        const kept = v.filter((x) => valid.has(x));
        if (kept.length !== v.length) {
          next[f.key] = kept;
          changed = true;
        }
      }
    }
    if (changed) setFilterValues(next);
  }, [filterValues, fields, setFilterValues]);

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
      onFormOpen?.("create");
      onCreate();
      return;
    }
    if (!makeEmptyRow) return; // read-only list — nothing to create
    const row = { ...makeEmptyRow(), id: nextId.current++ };
    onFormOpen?.("create", row);
    // Prepend so the new record is immediately visible at the top…
    setRowsLocal((prev) => [row, ...prev]);
    setDraftRow(row);
    setPage(1);
    setPanelReadOnly(false);
    setActiveId(row.id);
    setNewRowId(row.id);
  }
  /** Open the detail panel read-only (View). */
  function openView(id: RowId) {
    onFormOpen?.("view", rows.find((r) => r.id === id) ?? undefined);
    if (onView) {
      onView(id);
      return;
    }
    setPanelReadOnly(true);
    setActiveId(id);
  }
  /** Open the detail panel editable (Edit). */
  function openEdit(id: RowId) {
    onFormOpen?.("edit", rows.find((r) => r.id === id) ?? undefined);
    if (onEdit) {
      onEdit(id);
      return;
    }
    setPanelReadOnly(false);
    setActiveId(id);
  }
  /** Commit the form's buffered draft back into the table. `then` comes from the
   *  action that saved (Save closes, "Save & New" opens a blank row); without
   *  one it follows `behaviour.closeOnSave`. */
  function saveForm(updated: T, then?: FormActionOutcome) {
    setDraftRow(null);
    setRows((prev) =>
      // A refetch while the form was open can have dropped the draft; put the
      // saved record back rather than losing what was just typed.
      prev.some((r) => r.id === updated.id)
        ? prev.map((r) => (r.id === updated.id ? updated : r))
        : [updated, ...prev],
    );
    // Flash the saved row so the change is unmistakable.
    const flashMs = behaviour.flashMs ?? 1600;
    if (flashMs > 0) {
      setFlashId(updated.id);
      window.setTimeout(() => {
        setFlashId((current) => (current === updated.id ? null : current));
      }, flashMs);
    }
    setNewRowId(null);
    const outcome = saveOutcome(then, behaviour);
    if (outcome === "close") setActiveId(null);
    // "new" hands the form straight to a fresh record, so a run of entries
    // never goes back to the table in between.
    else if (outcome === "new") addRow();
  }
  /** Discard the form; drop the row entirely if it was never saved. */
  function cancelForm() {
    if (activeId != null && activeId === newRowId) {
      setRowsLocal((prev) => prev.filter((r) => r.id !== activeId));
    }
    setDraftRow(null);
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
    if (!file || !makeEmptyRow) return; // read-only list — no row factory to import into
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
  /** What a click on the row's name does. `none` leaves the name inert, for a
   *  table where opening a record is not the point. */
  const rowClick = behaviour.rowClick ?? "view";
  function openRow(id: RowId) {
    if (rowClick === "view") openView(id);
    else if (rowClick === "edit") openEdit(id);
  }
  /** Delete, asking first unless the app turned the confirm off. */
  function requestDelete(id: RowId) {
    if (behaviour.confirmDelete ?? true) setConfirmDeleteId(id);
    else deleteRow(id);
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
  /** Restore rows from Trash. The host persists via `onRestore`; RecordView
   *  clears the selection and (in fetcher mode) refetches, so the rows leave the
   *  Trash view. Client-mode hosts drop them from `trashedData`. */
  function restore(ids: RowId[]) {
    const set = new Set(ids);
    const toRestore = rows.filter((r) => set.has(r.id));
    if (toRestore.length) void onRestore?.(toRestore);
    setSelected(new Set());
    if (fetching) {
      if (cacheKey) RV_CACHE.delete(cacheKey);
      if (queryRef.current) runFetch(queryRef.current, { background: true });
    }
    setConfirmRestoreId(null);
    setBulkRestoreOpen(false);
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
  // Choice fields power the "Set …" bulk actions, and only editable ones: a
  // field the form won't let you change shouldn't be writable in bulk either.
  // Static arrays only — bulk "Set {label}" has no single draft to resolve a
  // function-options field against.
  const bulkFields = fields.filter(
    (f) => f.editable && Array.isArray(f.options) && f.options.length > 0,
  );
  // Per-column alignment (auto: numbers + short codes center).
  const columnAligns = React.useMemo(
    () => computeColumnAligns(fields, initialData),
    [fields, initialData],
  );
  const alignOf = (key: string): ColAlign => columnAligns[key] ?? "left";

  function renderCellValue(row: T, field: RecordField<T>) {
    const isEditing = editing?.id === row.id && editing.key === field.key;
    if (field.render) {
      // Clip to the column box so a wide custom cell (e.g. a long status badge)
      // never bleeds into the next column. Widen it by dragging the header edge
      // (resizableColumns) or set the field's `width`.
      return (
        <div
          className={cn(
            "overflow-hidden px-3 py-1.5",
            ALIGN_TEXT[alignOf(field.key)],
          )}
        >
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
    // For a choice field, show the option's friendly label (e.g. SYSTEM →
    // "System") while the cell stays editable — no `render`, no read-only.
    const display =
      field.displayValue?.(row) ??
      (field.input === "checkbox"
        ? row[field.key]
          ? "Yes"
          : "No"
        : Array.isArray(field.options)
          ? (field.options.find((o) => o.value === value)?.label ?? value)
          : value);
    const clip = clipCell(display, field.maxChars ?? maxCellChars);
    // Async-id fields resolve their label for the read cell (the edit control
    // already resolves its own). Everything else uses the clipped text + tooltip.
    const readContent = field.displayValue ? (
      <span className="truncate">
        {clip.text || <MissingValue />}
      </span>
    ) : field.multiple ? (
      <span className="overflow-hidden">
        <MultiFieldValue
          field={field}
          values={Array.isArray(row[field.key]) ? (row[field.key] as string[]) : []}
          row={row}
        />
      </span>
    ) : isAsyncLabeled(field) && value ? (
        <span className="truncate">
          <AsyncFieldValue field={field} value={value} values={row} />
        </span>
      ) : clip.full ? (
        <Tooltip content={clip.full} className="truncate">
          {clip.text}
        </Tooltip>
      ) : (
        <span className="truncate">
          {clip.text || <span className="text-muted-foreground">—</span>}
        </span>
      );
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
            {readContent}
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
        {readContent}
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
        onEdit={canEdit ? () => setPanelReadOnly(false) : undefined}
        onSave={saveForm}
        onCancel={cancelForm}
        formActions={formActions}
        renderFooter={renderFooter}
        formSlots={formSlots}
        behaviour={behaviour}
        sectionColumns={sectionColumns}
        sections={sections}
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
          {showImport && (
            <>
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
            </>
          )}

          {showExport && (
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
          )}

          <Dropdown
            label=""
            ariaLabel="More actions"
            icon={<MoreHorizontal className="size-4 text-slate-500" />}
            align="end"
          >
            {showSelection && (
              <DropdownItem onSelect={() => setSelected(new Set())}>
                Clear selection
              </DropdownItem>
            )}
            <DropdownItem onSelect={() => setHidden(new Set())}>
              Show all columns
            </DropdownItem>
          </Dropdown>

          {showAdd && (onCreate || makeEmptyRow) && !trash && (
            <Button variant="primary" size="sm" onClick={addRow} className="ml-1">
              <Plus className="size-4" />
              <span className="hidden sm:inline">{singular}</span>
            </Button>
          )}
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
            <span className="font-medium">
              {trash ? `Trash · ${title}` : `All ${title}`}
            </span>
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
              {trash ? (
                // Trash view: restore is the only bulk action.
                onRestore && (
                  <DropdownItem onSelect={() => setBulkRestoreOpen(true)}>
                    <span className="flex items-center gap-2 text-[var(--button-primary)]">
                      <Restore className="size-3.5" /> Restore {selected.size}{" "}
                      selected
                    </span>
                  </DropdownItem>
                )
              ) : (
                <>
                  {bulkFields.map((f) => (
                    <React.Fragment key={f.key}>
                      <DropdownLabel>Set {f.label}</DropdownLabel>
                      {(Array.isArray(f.options) ? f.options : []).map((o) => (
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
                      <Trash2 className="size-3.5" /> Delete {selected.size}{" "}
                      selected
                    </span>
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          )}
          {showTrash && (
            <button
              type="button"
              onClick={() => setTrash((t) => !t)}
              aria-pressed={trash}
              aria-label={trash ? "Show live records" : "Show Trash"}
              className={cn(
                "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 font-medium transition-colors",
                trash
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Trash2 className="size-3.5 text-red-500" />
              <span className="truncate">Trash</span>
            </button>
          )}
          {showFilter && (
          <Dropdown label="Filter" icon={<ListFilter className="size-3.5 text-amber-500" />}>
            {filterFields.length > 0 || filterExtras ? (
              // Per-field mode: a labeled control per `filterable` field (plus
              // any `filterExtras`), and Search / Clear. The panel only gathers
              // values — matching is the consumer's job via `onFilter`.
              <>
                <div className="flex max-h-[min(28rem,70vh)] w-96 flex-col">
                  {/* Header: static, full-width separator (from DropdownLabel). */}
                  <DropdownLabel>Filter</DropdownLabel>
                  {/* Content: the only scrolling region. FilterGrid enforces the
                      theme default — two columns: label │ control, one row per
                      field, labels aligned across every row. */}
                  <FilterGrid className="min-h-0 flex-1 overflow-y-auto p-3">
                  {filterFields.map((f) => {
                    const cfg: FieldFilter<T> =
                      typeof f.filterable === "object" ? f.filterable : {};
                    const control = cfg.control ?? "text";
                    const label = cfg.label ?? f.label;
                    // Options: cfg's static array or function of the current
                    // filter values (cascading); fall back to the field's static
                    // options (a draft-function can't resolve here).
                    const opts =
                      typeof cfg.options === "function"
                        ? cfg.options(filterValues)
                        : (cfg.options ??
                          (Array.isArray(f.options) ? f.options : []));
                    const raw = filterValues[f.key];
                    const setVal = (v: string | string[]) =>
                      setFilterValues((prev) => ({ ...prev, [f.key]: v }));
                    // Async filter options: lazy-load on open instead of `opts`.
                    const asyncProps: { source: AsyncOptionSource; resetKey: string } | null =
                      cfg.loadOptions
                        ? {
                            source: {
                              loadOptions: ({ search, signal }) =>
                                cfg.loadOptions!({ search, signal, values: filterValues }),
                              resolveOption: cfg.resolveOption,
                            },
                            resetKey: (cfg.dependsOn ?? [])
                              .map((k) => String(filterValues[k] ?? ""))
                              .join(" "),
                          }
                        : null;
                    return (
                      // One row per field via FilterField (label │ control).
                      <FilterField key={f.key} label={label}>
                        {control === "combobox" ? (
                          <Combobox
                            value={typeof raw === "string" ? raw : ""}
                            onValueChange={setVal}
                            {...(asyncProps ?? { options: opts })}
                            ariaLabel={label}
                            placeholder={
                              cfg.placeholder ?? `Any ${label.toLowerCase()}`
                            }
                            className="w-full"
                          />
                        ) : control === "select" ? (
                          <Select
                            value={typeof raw === "string" ? raw : ""}
                            onValueChange={setVal}
                            {...(asyncProps ?? { options: opts })}
                            ariaLabel={label}
                            placeholder={
                              cfg.placeholder ?? `Any ${label.toLowerCase()}`
                            }
                            className="w-full"
                          />
                        ) : control === "checkbox" ? (
                          <div className="flex flex-col gap-1">
                            {opts.map((o) => {
                              const arr = Array.isArray(raw) ? raw : [];
                              const on = arr.includes(o.value);
                              return (
                                <label
                                  key={o.value}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={on}
                                    onChange={() =>
                                      setVal(
                                        on
                                          ? arr.filter((v) => v !== o.value)
                                          : [...arr, o.value],
                                      )
                                    }
                                  />
                                  {o.label}
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <Input
                            type={
                              control === "number"
                                ? "number"
                                : control === "date"
                                  ? "date"
                                  : "text"
                            }
                            value={typeof raw === "string" ? raw : ""}
                            onChange={(e) => setVal(e.target.value)}
                            placeholder={cfg.placeholder ?? "Contains…"}
                            aria-label={label}
                            className="h-8 w-full"
                          />
                        )}
                      </FilterField>
                    );
                  })}
                  {/* Consumer-added rows — compose with <FilterField> so they
                      inherit the same two-column layout. */}
                  {filterExtras}
                  </FilterGrid>
                  {/* Footer: static, full-width top border, compact buttons. */}
                  <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border p-3">
                    <Button
                      size="sm"
                      onClick={() => {
                        setFilterValues({});
                        onFilter?.({});
                        setPage(1);
                        const q: ServerQuery<T> = {
                          page: 1,
                          pageSize,
                          sort,
                          search: filter,
                          filters: {},
                          trash,
                        };
                        if (fetching) runFetch(q);
                        else if (manual) onQueryChange?.(q);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        onFilter?.(filterValues);
                        setPage(1);
                        const q: ServerQuery<T> = {
                          page: 1,
                          pageSize,
                          sort,
                          search: filter,
                          filters: filterValues,
                          trash,
                        };
                        if (fetching) runFetch(q);
                        else if (manual) onQueryChange?.(q);
                      }}
                    >
                      <Search className="size-3.5" />
                      Search
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </Dropdown>
          )}

          {showSort && (
          <Dropdown label="Sort" icon={<CaretSort className="size-3.5 text-blue-500" />}>
            <DropdownLabel>Sort by</DropdownLabel>
            {sortFields.map((f) => (
              <DropdownItem
                key={f.key}
                onSelect={() => toggleSort(f.key)}
                icon={
                  sort?.key === f.key ? (
                    sort.dir === "asc" ? (
                      <CaretUp className="size-3.5" />
                    ) : (
                      <CaretDown className="size-3.5" />
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
          )}

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
          {showPagination && (
          <div className="ml-1 flex items-center gap-1 border-l border-border pl-2 text-muted-foreground">
            <Dropdown
              label={`${pageSize} / page`}
              icon={<Rows3 className="size-3.5 text-teal-500" />}
              align="end"
            >
              <DropdownLabel>Rows per page</DropdownLabel>
              {pageSizeOptions.map((n) => (
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
              {rangeStart}–{rangeEnd} of {total}
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
          )}
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
              {showSelection && (
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
              )}
              {orderedCols.map((col) => {
                if (col === IDENTITY_COL) {
                  const IdIcon = TitleIcon ?? DEFAULT_FIELD_ICON;
                  const inner = (
                    <>
                      <IdIcon className="size-3.5 shrink-0 text-foreground" />
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        {nameLabel}
                        {nameRequired && <RequiredMark />}
                      </span>
                      {nameSortKeyResolved &&
                        (sort?.key === nameSortKeyResolved ? (
                          sort.dir === "asc" ? (
                            <CaretUp className="size-3.5 shrink-0" />
                          ) : (
                            <CaretDown className="size-3.5 shrink-0" />
                          )
                        ) : (
                          <CaretSort className="size-3.5 shrink-0 text-muted-foreground/50" />
                        ))}
                    </>
                  );
                  return (
                    <TableHead
                      key="__identity"
                      className="relative w-max"
                      style={{ width: colWidths[NAME_COL] }}
                    >
                      {nameSortKeyResolved ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(nameSortKeyResolved)}
                          className="flex h-8 w-full items-center gap-1.5 whitespace-nowrap hover:text-foreground"
                        >
                          {inner}
                        </button>
                      ) : (
                        <span className="flex h-8 items-center gap-1.5 whitespace-nowrap">
                          {inner}
                        </span>
                      )}
                      {resizeHandle(NAME_COL, nameLabel)}
                    </TableHead>
                  );
                }
                const f = col;
                const HeadIcon = f.icon ?? DEFAULT_FIELD_ICON;
                const sortable = canSort(f);
                const headInner = (
                  <>
                    <HeadIcon className="size-3.5 shrink-0 text-foreground" />
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      {f.label}
                      {f.required && <RequiredMark />}
                    </span>
                    {/* Sortable columns always show an indicator: a muted
                        up/down caret by default, a solid caret for the active
                        direction (up = ascending, down = descending). */}
                    {sortable &&
                      (sort?.key === f.key ? (
                        sort.dir === "asc" ? (
                          <CaretUp className="size-3.5 shrink-0" />
                        ) : (
                          <CaretDown className="size-3.5 shrink-0" />
                        )
                      ) : (
                        <CaretSort className="size-3.5 shrink-0 text-muted-foreground/50" />
                      ))}
                  </>
                );
                const headClass = cn(
                  "flex h-8 w-full items-center gap-1.5 whitespace-nowrap",
                  ALIGN_BOX[alignOf(f.key)],
                );
                return (
                  <TableHead
                    key={f.key}
                    className="relative w-max"
                    style={{ width: colWidths[f.key] }}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(f.key)}
                        className={cn(headClass, "hover:text-foreground")}
                      >
                        {headInner}
                      </button>
                    ) : (
                      // Not sortable: a static label, no toggle / hover affordance.
                      <span className={headClass}>{headInner}</span>
                    )}
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
            {effectiveLoading ? (
              // Animated skeleton rows while data loads from the server.
              Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                  <TableCell style={{ width: CHECKBOX_W }}>
                    <div className="mx-2 size-4 vui-shimmer rounded" />
                  </TableCell>
                  {orderedCols.map((col) =>
                    col === IDENTITY_COL ? (
                      <TableCell
                        key="__identity"
                        style={{ width: colWidths[NAME_COL] }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="size-7 shrink-0 vui-shimmer rounded-full" />
                          <div className="h-3.5 w-32 vui-shimmer rounded" />
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell
                        key={col.key}
                        style={{ width: colWidths[col.key] }}
                      >
                        <div className="h-3.5 w-20 vui-shimmer rounded" />
                      </TableCell>
                    ),
                  )}
                  <TableCell aria-hidden="true" className="border-r-0" />
                  <TableCell style={{ width: ACTIONS_W }}>
                    <div className="mx-auto h-4 w-8 vui-shimmer rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : processed.length ? (
              paged.map((row) => {
                const primary = getPrimary(row);
                const nameClip = clipCell(primary.title, maxCellChars);
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
                    {showSelection && (
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
                    )}
                    {orderedCols.map((col) =>
                      col === IDENTITY_COL ? (
                        <TableCell
                          key="__identity"
                          className="p-0"
                          style={{
                            maxWidth: colWidths[NAME_COL] ?? NAME_DEFAULT_W,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openRow(row.id)}
                            disabled={rowClick === "none"}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-muted/60 disabled:cursor-default disabled:hover:bg-transparent"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted font-medium text-muted-foreground">
                              {primary.initials}
                            </span>
                            {nameClip.full ? (
                              <Tooltip
                                content={nameClip.full}
                                className="truncate"
                              >
                                {nameClip.text}
                              </Tooltip>
                            ) : (
                              <span className="truncate">
                                {nameClip.text || "—"}
                              </span>
                            )}
                          </button>
                        </TableCell>
                      ) : (
                        <TableCell
                          key={col.key}
                          className="p-0"
                          style={{
                            maxWidth: colWidths[col.key] ?? fieldDefaultWidth(col),
                          }}
                        >
                          {renderCellValue(row, col)}
                        </TableCell>
                      ),
                    )}
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
                        {!trash && canEdit && (
                          <button
                            type="button"
                            onClick={() => openEdit(row.id)}
                            aria-label={`Edit ${primary.title || singular}`}
                            title="Edit"
                            className="grid size-7 cursor-pointer place-items-center rounded-sm hover:bg-muted"
                          >
                            <Pencil className="size-4 text-amber-500" />
                          </button>
                        )}
                        {trash
                          ? onRestore && (
                              <button
                                type="button"
                                onClick={() => setConfirmRestoreId(row.id)}
                                aria-label={`Restore ${primary.title || singular}`}
                                title="Restore"
                                className="grid size-7 cursor-pointer place-items-center rounded-sm hover:bg-muted"
                              >
                                <Restore className="size-4 text-[var(--button-primary)]" />
                              </button>
                            )
                          : (
                              <button
                                type="button"
                                onClick={() => requestDelete(row.id)}
                                aria-label={`Delete ${primary.title || singular}`}
                                title="Delete"
                                className="grid size-7 cursor-pointer place-items-center rounded-sm hover:bg-destructive/10"
                              >
                                <Trash2 className="size-4 text-red-500" />
                              </button>
                            )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={orderedCols.length + (showSelection ? 3 : 2)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyStateLabel(filter, filterValues)}
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
          onEdit={canEdit ? () => setPanelReadOnly(false) : undefined}
          onSave={saveForm}
          onCancel={cancelForm}
          formActions={formActions}
          renderFooter={renderFooter}
          formSlots={formSlots}
          behaviour={behaviour}
          sectionColumns={sectionColumns}
          sections={sections}
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
          {!trash && (
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
          )}
          <div className="my-1 h-px bg-border" />
          {trash ? (
            onRestore && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setConfirmRestoreId(menu.id);
                  setMenu(null);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[var(--button-primary)] hover:bg-accent"
              >
                <Restore className="size-3.5" />
                Restore
              </button>
            )
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                requestDelete(menu.id);
                setMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          )}
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

      <ConfirmDialog
        open={confirmRestoreId != null}
        title={`Restore ${singular.toLowerCase()}?`}
        description={
          <>
            This returns{" "}
            <span className="font-medium text-foreground">
              {(() => {
                const t = rows.find((r) => r.id === confirmRestoreId);
                return t ? getPrimary(t).title || "this record" : "this record";
              })()}
            </span>{" "}
            to the live list.
          </>
        }
        confirmLabel="Restore"
        onConfirm={() => {
          if (confirmRestoreId != null) restore([confirmRestoreId]);
        }}
        onCancel={() => setConfirmRestoreId(null)}
      />

      <ConfirmDialog
        open={bulkRestoreOpen}
        title={`Restore ${selected.size} ${
          selected.size === 1 ? singular.toLowerCase() : title.toLowerCase()
        }?`}
        description={
          <>
            This returns the{" "}
            <span className="font-medium text-foreground">
              {selected.size} selected
            </span>{" "}
            record{selected.size === 1 ? "" : "s"} to the live list.
          </>
        }
        confirmLabel="Restore"
        onConfirm={() => restore([...selected])}
        onCancel={() => setBulkRestoreOpen(false)}
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
  /** Commit the buffered draft to the table. `then` carries the acting
   *  button's `after`, so "Save & New" can hand the form a blank record. */
  onSave: (row: T, then?: FormActionOutcome) => void;
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
  /** Persist the in-progress draft under this key (e.g. the route), so a
   *  half-filled form survives leaving and returning via the open-tabs strip. */
  persistKey?: string;
  /** Footer buttons. An array replaces Cancel + Save (or Close + Edit in view
   *  mode); a function receives those defaults so you can add, reorder or swap
   *  one without restating the rest. Falls back to `VuiProvider`'s
   *  `form.actions`, then to the shipped pair. */
  formActions?: FormActionsConfig<T>;
  /** Replace the whole footer. The array covers almost everything, so reach for
   *  this only when it genuinely can't express the layout you need. */
  renderFooter?: (ctx: FormActionContext<T>) => React.ReactNode;
  /** Your own content between the fields — a callout, a preview, a custom pair
   *  of controls. Each slot renders as a full-width row inside its section. */
  formSlots?: FormSlot<T>[];
  /** Behaviour, already resolved by the table so a per-table prop reaches the
   *  form as well as the rows. */
  behaviour?: BehaviourConfig;
  /** Columns the sections flow across (1, 2 or 3). Falls back to the app's
   *  `form.sectionColumns`, then 1. */
  sectionColumns?: SectionColumns;
  /** Declare the sections to control their order, let one span the row, or give
   *  one its own field layout. Omit and they come from each field's `group`. */
  sections?: FormSection[];
  /** Page-form breadcrumb override (fully configurable). When set, these crumbs
   *  replace the default `Home › {title} › Create/Update {singular}` — so you can
   *  add parents ("Access") or rename the last crumb ("New Role"). Build each
   *  crumb as `{ label, onClick? }`; the last one is the current page. */
  crumbs?: Crumb[];
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
  persistKey,
  formActions,
  renderFooter,
  formSlots,
  behaviour: behaviourProp,
  sectionColumns,
  sections,
  crumbs,
}: DetailPanelProps<T>) {
  const formConfig = useResolved("form", undefined) ?? {};
  // Two settings decide the whole form: how many columns the fields flow
  // across, and whether each label sits beside its control or above it.
  const sectionCols = sectionColumns ?? formConfig.sectionColumns ?? 1;
  const behaviour = useResolved("behaviour", behaviourProp) ?? {};
  const draftKey = persistKey ? `${persistKey}::draft` : undefined;
  const [draft, setDraft] = usePersistentState<T>(draftKey, row);
  // Reset the buffered form only when a *genuinely different* record is opened.
  // Tracking the last id (not a "first run" flag) is StrictMode-safe: the dev
  // double-invoke sees the same id and won't wipe a restored / in-progress draft.
  const lastRowId = React.useRef(row.id);
  React.useEffect(() => {
    if (lastRowId.current === row.id) return;
    lastRowId.current = row.id;
    setDraft(row);
  }, [row, setDraft]);

  // Cascading options: after the draft changes, clear any choice field whose
  // value is no longer valid once its options recompute (e.g. changing Region
  // drops a now-invalid Country). Only function-options fields cascade; static
  // ones never invalidate. Settles in one pass — cleared values are "" and skip.
  React.useEffect(() => {
    const stale = fields.filter((f) => {
      if (typeof f.options !== "function") return false;
      const v = draft[f.key as keyof T];
      if (v == null || v === "") return false;
      return !f.options(draft).some((o) => o.value === String(v));
    });
    if (stale.length === 0) return;
    setDraft((d) => {
      let next = d;
      for (const f of stale) next = { ...next, [f.key]: "" };
      return next;
    });
  }, [draft, fields, setDraft]);

  const primary = getPrimary(draft);
  const HeaderIcon = TitleIcon ?? DEFAULT_FIELD_ICON;

  // Field validation: key → inline error message. Rules run on blur + before
  // Save; once a field has errored it re-checks live as you type (clears when
  // fixed). Save is blocked while the map is non-empty.
  const [errors, setErrors] = React.useState<Map<string, string>>(new Map());
  React.useEffect(() => {
    setErrors(new Map());
  }, [row.id]);

  // Fields whose rules run here (editable, non-custom-render).
  const editableFields = React.useMemo(
    () => fields.filter((f) => f.editable && !f.render),
    [fields],
  );

  /** Run one field's rules against `next` and set/clear its inline error. */
  const validateOne = React.useCallback(
    (field: RecordField<T>, next: T): string | undefined => {
      const msg = validateField(
        field,
        String(next[field.key as keyof T] ?? ""),
        next,
      );
      setErrors((prev) => {
        const cur = prev.get(field.key);
        if (cur === msg || (!cur && !msg)) return prev;
        const m = new Map(prev);
        if (msg) m.set(field.key, msg);
        else m.delete(field.key);
        return m;
      });
      return msg;
    },
    [],
  );

  const setField = (key: keyof T, value: string | boolean | string[]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    // Live-clear: re-check a field that's already showing an error as it changes.
    if (errors.has(key as string)) {
      const field = fields.find((f) => f.key === (key as string));
      if (field) validateOne(field, { ...draft, [key]: value } as T);
    }
  };

  const blurField = (field: RecordField<T>) => validateOne(field, draft);

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

  /** Trim flagged fields, then validate everything. Returns the cleaned draft,
   *  or `null` when a field fails — the messages are already inline by then. */
  const validateDraft = (): T | null => {
    let next = draft;
    for (const f of editableFields) {
      if (!f.trim) continue;
      const v = String(next[f.key as keyof T] ?? "");
      if (v.trim() !== v) next = { ...next, [f.key]: v.trim() } as T;
    }
    const found = new Map<string, string>();
    for (const f of editableFields) {
      const msg = validateField(f, String(next[f.key as keyof T] ?? ""), next);
      if (msg) found.set(f.key, msg);
    }
    setDraft(next); // reflect trims whether or not the save proceeds
    if (found.size > 0) {
      setErrors(found); // block Save; show every message inline
      return null;
    }
    setErrors(new Map());
    return next;
  };


  // Cancel/close discards the draft too, so it doesn't reappear next visit.
  const [confirmDiscard, setConfirmDiscard] = React.useState(false);
  const discard = () => {
    clearPersisted(draftKey);
    dismiss(onCancel);
  };
  const handleCancel = () => {
    // Only ask when there is something to lose, and only when the app opted in.
    if (
      (behaviour.confirmDiscardWhenDirty ?? false) &&
      !readOnly &&
      JSON.stringify(draft) !== JSON.stringify(row)
    ) {
      setConfirmDiscard(true);
      return;
    }
    discard();
  };

  // Grouped field sections — shared by the slide-over and full-page layouts.
  const slotRow = (slot: FormSlot<T>) => (
    // A slot takes both columns: it isn't a label │ control pair.
    <div
      key={`slot:${slot.id}`}
      className={cn("col-span-2 border-t px-4 py-3.5 leading-relaxed", RULE)}
    >
      {slot.render(actionCtx)}
    </div>
  );

  const laidOut = orderedSections(fields, sections);
  const anySpan = laidOut.some((s) => s.span && s.span !== 1);
  const formBody = laidOut.map((section) => {
    const group = section.group;
    const groupFields = fields.filter((f) => (f.group ?? "General") === group);
    if (groupFields.length === 0) return null;
    const slots = groupSlots(fields, formSlots, group);
    return (
      <section
        key={group}
        className={cn(
          "overflow-hidden rounded-lg border border-border",
          SECTION_SPAN[sectionCols][section.span ?? 1],
          !anySpan && SECTION_STRETCH[sectionCols],
        )}
      >
        <h3 className="border-b border-border bg-muted/40 px-4 py-2.5 font-semibold text-[var(--button-primary)]">
          {group}
        </h3>
        {section.description && (
          <p className="border-b border-border px-4 py-2.5 text-muted-foreground">
            {section.description}
          </p>
        )}
        {/* Two columns, one field per row: `[i] Label *` then the control.
            Hairlines between them so the grid reads at a glance. */}
        <dl className={cn("grid", FIELD_GRID)}>
          {groupFields.flatMap((f) => [
            // Label, icon, required mark and control share one baseline —
            // vertically centered. ponytail: a wrapped textarea grows down and
            // the label centers against it; acceptable for the single-line norm.
            // `items-stretch` so the column rule runs the full height of the
            // row; the label centres itself inside its own cell.
            <div
              key={f.key}
              className={cn(
                "col-span-2 grid grid-cols-subgrid items-stretch border-t leading-relaxed first:border-t-0",
                RULE,
              )}
            >
              <dt
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-r py-3.5 pl-4 pr-4 text-muted-foreground",
                  RULE,
                )}
              >
                {/* Help text sits on the label itself, so it's there in a
                    slide-over too: the full-page Info panel is the only place
                    it used to appear. Tooltip icon, label, required mark. */}
                {f.description && (
                  <Tooltip content={f.description}>
                    <Info
                      aria-label={`About ${f.label}`}
                      className="size-3.5 shrink-0 cursor-help text-muted-foreground/70 hover:text-[var(--button-primary)]"
                    />
                  </Tooltip>
                )}
                {f.icon && (
                  <f.icon className="size-3.5 text-[var(--button-primary)]" />
                )}
                {f.label}
                {f.required && <RequiredMark />}
              </dt>
              <dd className="flex min-w-0 items-center py-3.5 pl-4 pr-4">
                {/* `render` is the read-only view; the edit control (a custom
                    `renderInput` or a built-in `input:"checkbox"`) wins while
                    editing, so a field can show a badge/preview in view and
                    still be edited (e.g. a HQ badge in the table + a checkbox in
                    the form). */}
                {f.render &&
                !(
                  !readOnly &&
                  f.editable &&
                  (f.renderInput || f.input === "checkbox")
                ) ? (
                  <div>{f.render(draft)}</div>
                ) : !readOnly && f.editable ? (
                  f.renderInput ? (
                    // Consumer-supplied control (checkbox, radio, custom widget).
                    f.renderInput({
                      value: String(draft[f.key as keyof T] ?? ""),
                      onChange: (v) => setField(f.key as keyof T, v),
                      field: f,
                      invalid: errors.has(f.key),
                    })
                  ) : f.options || f.loadOptions ? (
                    f.multiple ? (
                      <MultiCombobox
                        value={
                          Array.isArray(draft[f.key as keyof T])
                            ? (draft[f.key as keyof T] as string[])
                            : []
                        }
                        onValueChange={(v) => setField(f.key as keyof T, v)}
                        {...(f.loadOptions
                          ? {
                              source: {
                                loadOptions: ({ search, signal }) =>
                                  f.loadOptions!({ search, signal, values: draft }),
                                resolveOptions: f.resolveOptions,
                                resolveOption: f.resolveOption,
                              },
                              resetKey: (f.dependsOn ?? [])
                                .map((k) => String(draft[k] ?? ""))
                                .join(" "),
                            }
                          : { options: resolveOptions(f.options, draft) })}
                        ariaLabel={f.label}
                        placeholder={`Select ${f.label.toLowerCase()}…`}
                        invalid={errors.has(f.key)}
                        className="w-full"
                      />
                    ) : f.input === "combobox" ? (
                      <Combobox
                        value={String(draft[f.key as keyof T] ?? "")}
                        onValueChange={(v) => setField(f.key as keyof T, v)}
                        {...(f.loadOptions
                          ? {
                              source: {
                                loadOptions: ({ search, signal }) =>
                                  f.loadOptions!({ search, signal, values: draft }),
                                resolveOption: f.resolveOption,
                              },
                              resetKey: (f.dependsOn ?? [])
                                .map((k) => String(draft[k] ?? ""))
                                .join(" "),
                            }
                          : { options: resolveOptions(f.options, draft) })}
                        ariaLabel={f.label}
                        placeholder={`Select ${f.label.toLowerCase()}…`}
                        className="w-full"
                      />
                    ) : (
                      <Select
                        value={String(draft[f.key as keyof T] ?? "")}
                        onValueChange={(v) => setField(f.key as keyof T, v)}
                        {...(f.loadOptions
                          ? {
                              source: {
                                loadOptions: ({ search, signal }) =>
                                  f.loadOptions!({ search, signal, values: draft }),
                                resolveOption: f.resolveOption,
                              },
                              resetKey: (f.dependsOn ?? [])
                                .map((k) => String(draft[k] ?? ""))
                                .join(" "),
                            }
                          : { options: resolveOptions(f.options, draft) })}
                        ariaLabel={f.label}
                        placeholder={`Select ${f.label.toLowerCase()}…`}
                        className="w-full"
                      />
                    )
                  ) : f.input === "checkbox" ? (
                    <label className="flex h-8 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(draft[f.key as keyof T])}
                        onChange={(e) =>
                          setField(f.key as keyof T, e.target.checked)
                        }
                        aria-label={f.label}
                        className="size-4 accent-[var(--button-primary)]"
                      />
                      <span className="text-sm text-muted-foreground">
                        {draft[f.key as keyof T] ? "Yes" : "No"}
                      </span>
                    </label>
                  ) : f.input === "number" || f.input === "date" ? (
                    <Input
                      type={f.input}
                      value={String(draft[f.key as keyof T] ?? "")}
                      onChange={(e) => setField(f.key as keyof T, e.target.value)}
                      onBlur={() => blurField(f)}
                      aria-label={f.label}
                      aria-invalid={errors.has(f.key) || undefined}
                      className={cn(
                        "w-full",
                        errors.has(f.key) &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                  ) : (
                    <textarea
                      value={String(draft[f.key as keyof T] ?? "")}
                      onChange={(e) =>
                        setField(
                          f.key as keyof T,
                          f.format === "phone"
                            ? formatPhone(e.target.value)
                            : e.target.value,
                        )
                      }
                      onBlur={() => blurField(f)}
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
                  )
                ) : (
                  <span className="block whitespace-pre-wrap break-words px-2 py-1.5">
                    {(() => {
                      // The host already has the label in the row: no resolve.
                      if (f.displayValue)
                        return f.displayValue(draft) || <MissingValue />;
                      if (f.input === "checkbox")
                        return draft[f.key as keyof T] ? "Yes" : "No";
                      if (f.multiple)
                        return (
                          <MultiFieldValue
                            field={f}
                            values={
                              Array.isArray(draft[f.key as keyof T])
                                ? (draft[f.key as keyof T] as string[])
                                : []
                            }
                            row={draft}
                          />
                        );
                      const raw = String(draft[f.key as keyof T] ?? "");
                      if (!raw) return <MissingValue />;
                      // Async id → resolved label; static options → their label;
                      // otherwise the raw value.
                      if (isAsyncLabeled(f))
                        return (
                          <AsyncFieldValue field={f} value={raw} values={draft} />
                        );
                      if (Array.isArray(f.options))
                        return (
                          f.options.find((o) => o.value === raw)?.label ?? raw
                        );
                      return raw;
                    })()}
                  </span>
                )}
                {!readOnly && errors.get(f.key) && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.get(f.key)}
                  </p>
                )}
              </dd>
            </div>,
            // Anything the host put after this field.
            ...(slots.get(f.key) ?? []).map(slotRow),
          ])}
          {/* Slots with no `after` close out the section. */}
          {(slots.get("") ?? []).map(slotRow)}
        </dl>
      </section>
    );
  });

  // Footer actions. The shipped pair (Cancel + Save, or Close + Edit while
  // viewing) are ordinary actions, so a host's `formActions` starts from them.
  const actionCtx: FormActionContext<T> = {
    mode: readOnly ? "view" : isNew ? "create" : "edit",
    row: draft,
    dirty: JSON.stringify(draft) !== JSON.stringify(row),
    valid: errors.size === 0,
    errors,
    close: handleCancel,
    reset: () => {
      setDraft(row);
      setErrors(new Map());
    },
    edit: onEdit,
  };
  const actions = resolveFormActions<T>(
    defaultFormActions<T>({ readOnly, canEdit: Boolean(onEdit) }),
    formActions ?? (formConfig.actions as FormActionsConfig<T> | undefined),
  );
  /**
   * Run one action. The rule, in one sentence: an action closes the form when it
   * finishes unless it returns `false`, and an action that validates (primary,
   * by default) commits the draft through `onSave` on the way out.
   *
   * That is why the shipped Save has an empty `onAct` — committing is this
   * function's job, so any action a host marks `requiresValid` saves the same
   * way, with the same validation and the same discarded draft.
   */
  const runAction = async (action: FormAction<T>) => {
    const validated = actionRequiresValid(action) ? validateDraft() : draft;
    if (!validated) return; // invalid: messages are inline, form stays open
    const keepOpen = await action.onAct({ ...actionCtx, row: validated });
    if (keepOpen === false) return; // the action handled its own outcome
    if (actionRequiresValid(action)) {
      clearPersisted(draftKey); // work committed — drop the saved draft
      const outcome = saveOutcome(action.after, behaviour);
      // Only a closing save plays the slide-out; staying open would animate the
      // panel away and straight back in.
      if (outcome === "close") dismiss(() => onSave(validated, outcome));
      else onSave(validated, outcome);
    } else {
      handleCancel(); // closes without committing (Delete, Archive, …)
    }
  };
  const formFooter = (
    <>
      {renderFooter ? (
        renderFooter(actionCtx)
      ) : (
        <FormFooter actions={actions} ctx={actionCtx} run={runAction} />
      )}
      <ConfirmDialog
        open={confirmDiscard}
        title={`Discard your changes to this ${singular.toLowerCase()}?`}
        description="What you have typed will be lost."
        confirmLabel="Discard"
        destructive
        onConfirm={() => {
          setConfirmDiscard(false);
          discard();
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </>
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
            crumbs={
              crumbs ??
              ([
                ...(onHome ? [{ label: "Home", onClick: onHome }] : []),
                { label: title ?? singular, onClick: onCancel },
                { label: crumb },
              ] as Crumb[])
            }
          />
        </div>
        {/* Content — form card (left) + optional documentation panel (right). */}
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <div className="flex h-full gap-4">
            {/* Padded, bordered card — matches the datatable content container. */}
            <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
              <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
                {/* The section grid. `sectionColumns` is the setting; the
                    older `columns` (page forms only) still widens a
                    single-column form to two, so nothing existing moves. */}
                <div
                  className={cn(
                    "w-full",
                    SECTION_GRID[
                      sectionCols > 1 ? sectionCols : columns === 2 ? 2 : 1
                    ],
                    (sectionCols > 1 || columns === 2) && "mx-auto max-w-5xl",
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
        onClick={handleCancel}
        aria-hidden="true"
      />
      <aside
        aria-label={`${singular} form`}
        className={cn(
          // Auto-size to content: wide enough for the longest label + control on
          // one line, clamped so it never gets too narrow or wider than the viewport.
          "fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l border-border bg-background shadow-xl sm:w-auto sm:min-w-[420px] sm:max-w-[90vw]",
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
            onClick={handleCancel}
            aria-label="Close"
            className="ml-auto"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Body — the section grid, one bordered card per field group. */}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto p-4",
            SECTION_GRID[sectionCols],
          )}
        >
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

/**
 * Standalone **slide-over** record form — the standard Add / Edit / View panel
 * used outside a table (e.g. on a Kanban board). Same overlay, `fields`-driven
 * layout, blue Save, header/body/footer separators, and auto-width as the
 * add/edit panel `RecordView` opens. Feed it a `fields` array; never hand-roll
 * an add/edit form.
 */
export function RecordFormPanel<T extends { id: RowId }>(
  props: Omit<DetailPanelProps<T>, "layout">,
) {
  return <RecordDetailPanel layout="panel" {...props} />;
}
