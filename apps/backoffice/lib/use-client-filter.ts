"use client";

import { useMemo, useState } from "react";

import type { FilterValues } from "@viliha/vui-ui/record-view";

/**
 * Match rows against the Filter panel's collected values: contains-match for a
 * text value, includes-match for a multi-select array. Naive on purpose, this
 * is in-memory demo data; a real app runs the query on the server.
 */
export function filterRows<T>(rows: T[], filters: FilterValues<T>): T[] {
  return rows.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      const cell = row[key as keyof T];
      if (Array.isArray(value)) {
        return value.length === 0 || value.includes(String(cell));
      }
      const needle = String(value ?? "").toLowerCase();
      return !needle || String(cell ?? "").toLowerCase().includes(needle);
    }),
  );
}

/** Fold edits/adds/deletes made on the filtered view back into the full list. */
export function reconcile<T extends { id: number | string }>(
  prev: T[],
  visible: T[],
  next: T[],
): T[] {
  const nextById = new Map(next.map((r) => [r.id, r] as const));
  const visibleIds = new Set(visible.map((r) => r.id));
  const kept = prev
    .filter((r) => !visibleIds.has(r.id) || nextById.has(r.id)) // drop deletes
    .map((r) => nextById.get(r.id) ?? r); // apply edits
  const added = next.filter((r) => !prev.some((p) => p.id === r.id));
  return [...kept, ...added];
}

/**
 * Demo helper: client-side per-field filtering for a `RecordView`, plus
 * edit/add/delete reconciliation back onto the full list.
 *
 * The theme's Filter panel only *collects* values (its `onFilter`); matching
 * rows is the app's job. In a real app that is a server query. For static
 * in-memory data, wire this in three props:
 *
 * ```tsx
 * const { rows, onFilter, onDataChange } = useClientFilter(source);
 * <RecordView … data={rows} initialData={rows} onFilter={onFilter} onDataChange={onDataChange} />
 * ```
 *
 * For data that loads asynchronously into your own state, use the exported
 * `filterRows` / `reconcile` helpers directly (see `markets-table.tsx`).
 */
/** A row is "blank" when every field but `id` is empty — i.e. an un-saved Add
 *  that was cancelled. Those shouldn't land in Trash. */
function isBlankRow<T extends { id: number | string }>(row: T): boolean {
  return Object.entries(row as Record<string, unknown>).every(
    ([k, v]) => k === "id" || v === "" || v === false || v == null || v === 0,
  );
}

/**
 * Client-side filtering for a `RecordView` (see the datatable docs), plus
 * edit/add/delete reconciliation and **Trash/restore**: deleting a row soft-
 * deletes it into `trashed` (RecordView shows it under the Trash toggle), and
 * `onRestore` returns it to the live list. `trashSeed` pre-populates Trash so the
 * view isn't empty on first open.
 *
 * ```tsx
 * const { rows, trashed, onFilter, onDataChange, onRestore } = useClientFilter(source);
 * <RecordView … data={rows} initialData={rows} onFilter={onFilter}
 *   onDataChange={onDataChange} showTrash trashedData={trashed} onRestore={onRestore} />
 * ```
 */
export function useClientFilter<T extends { id: number | string }>(
  source: T[],
  trashSeed: T[] = [],
) {
  const [all, setAll] = useState<T[]>(source);
  const [trashed, setTrashed] = useState<T[]>(trashSeed);
  const [filters, setFilters] = useState<FilterValues<T>>({});
  const rows = useMemo(() => filterRows(all, filters), [all, filters]);
  const onDataChange = (next: T[]) => {
    // Rows that vanished are soft-deleted → move them to Trash (skip a blank,
    // never-saved Add that was cancelled).
    const nextIds = new Set(next.map((r) => r.id));
    const removed = rows.filter((r) => !nextIds.has(r.id) && !isBlankRow(r));
    if (removed.length) setTrashed((t) => [...removed, ...t]);
    setAll((prev) => reconcile(prev, rows, next));
  };
  const onRestore = (toRestore: T[]) => {
    const ids = new Set(toRestore.map((r) => r.id));
    setTrashed((t) => t.filter((r) => !ids.has(r.id)));
    setAll((prev) => reconcile(prev, rows, [...rows, ...toRestore]));
  };
  return { rows, trashed, onFilter: setFilters, onDataChange, onRestore };
}
