"use client";

import { useMemo, useState } from "react";
import { CodeIcon as Hash, GlobeIcon as Globe } from "@radix-ui/react-icons";

import {
  RecordView,
  type FilterValues,
  type RecordField,
} from "@viliha/vui-ui/record-view";
import { regions, type Region } from "@/lib/mock-data";

// `filterable` opts a field into the Filter panel. With any field filterable the
// panel shows a labeled control per field + Search/Clear instead of the single
// keyword box. `true` = a text input; pass a config to pick the control.
const fields: RecordField<Region>[] = [
  {
    key: "name",
    label: "Name",
    editable: true,
    required: true,
    group: "General",
    hideInTable: true,
    // No Name column (shown in the identity cell via getPrimary), but still
    // sortable from the Sort dropdown — `sortable` decouples it from visibility.
    sortable: true,
    filterable: true,
  },
  {
    key: "code",
    label: "Code",
    icon: Hash,
    editable: true,
    group: "General",
    filterable: { control: "text", placeholder: "e.g. APAC" },
  },
];

export function RegionsTable() {
  const [all, setAll] = useState<Region[]>(regions);
  const [filters, setFilters] = useState<FilterValues<Region>>({});

  // Demo: match the per-field values client-side. The component does NOT filter
  // in per-field mode — `onFilter` hands you the values; swap this for a server
  // query in a real app. ponytail: naive contains-match, fine for demo data.
  const rows = useMemo(
    () =>
      all.filter((r) =>
        Object.entries(filters).every(([k, v]) => {
          const needle = String(v ?? "").toLowerCase();
          return (
            !needle ||
            String(r[k as keyof Region]).toLowerCase().includes(needle)
          );
        }),
      ),
    [all, filters],
  );

  // Reconcile edits/adds/deletes made on the filtered view back into `all`.
  const handleChange = (next: Region[]) => {
    setAll((prev) => {
      const nextById = new Map(next.map((r) => [r.id, r] as const));
      const visible = new Set(rows.map((r) => r.id));
      const kept = prev
        .filter((r) => !visible.has(r.id) || nextById.has(r.id)) // drop deleted
        .map((r) => nextById.get(r.id) ?? r); // apply edits
      const added = next.filter((r) => !prev.some((p) => p.id === r.id));
      return [...kept, ...added];
    });
  };

  return (
    <RecordView
      title="Regions"
      singular="Region"
      icon={Globe}
      persistKey="/system/regions"
      fields={fields}
      initialData={rows}
      data={rows}
      onDataChange={handleChange}
      onFilter={setFilters}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "" })}
    />
  );
}
