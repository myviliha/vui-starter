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
export function useClientFilter<T extends { id: number | string }>(source: T[]) {
  const [all, setAll] = useState<T[]>(source);
  const [filters, setFilters] = useState<FilterValues<T>>({});
  const rows = useMemo(() => filterRows(all, filters), [all, filters]);
  const onDataChange = (next: T[]) => setAll((prev) => reconcile(prev, rows, next));
  return { rows, onFilter: setFilters, onDataChange };
}
