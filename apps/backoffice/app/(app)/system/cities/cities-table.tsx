"use client";

import { useMemo, useState } from "react";
import {
  BookmarkIcon as Flag,
  HomeIcon as Landmark,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import {
  RecordView,
  type FilterValues,
  type RecordField,
} from "@viliha/vui-ui/record-view";
import { cities, type City } from "@/lib/mock-data";

// Option lists derived from the data.
const COUNTRIES = [...new Set(cities.map((c) => c.country))]
  .sort()
  .map((c) => ({ value: c, label: c }));
const statesFor = (country?: string) =>
  [...new Set(cities.filter((c) => c.country === country).map((c) => c.state))]
    .sort()
    .map((s) => ({ value: s, label: s }));

// Cascading options: State choices depend on the selected Country. `options` as
// a function receives the live draft (form) or filter values (filter); when the
// parent changes, RecordView clears a now-invalid State automatically.
const fields: RecordField<City>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true },
  {
    key: "country",
    label: "Country",
    icon: Flag,
    editable: true,
    group: "General",
    input: "combobox",
    options: COUNTRIES,
    filterable: { control: "select", options: COUNTRIES },
  },
  {
    key: "state",
    label: "State",
    icon: MapPin,
    editable: true,
    group: "General",
    input: "combobox",
    // Form: states for the country in the current draft.
    options: (draft) => statesFor(draft.country),
    filterable: {
      control: "combobox",
      // Filter: states for the country in the current filter values.
      options: (values) =>
        statesFor(typeof values.country === "string" ? values.country : undefined),
    },
  },
];

export function CitiesTable() {
  const [all, setAll] = useState<City[]>(cities);
  const [trashed, setTrashed] = useState<City[]>([]);
  const [filters, setFilters] = useState<FilterValues<City>>({});

  // Demo: match the cascading filter values client-side (swap for a server query).
  const rows = useMemo(
    () =>
      all.filter((r) =>
        Object.entries(filters).every(([k, v]) => {
          const needle = String(v ?? "").toLowerCase();
          return !needle || String(r[k as keyof City]).toLowerCase() === needle;
        }),
      ),
    [all, filters],
  );

  const reconcileInto = (prev: City[], next: City[]) => {
    const nextById = new Map(next.map((r) => [r.id, r] as const));
    const visible = new Set(rows.map((r) => r.id));
    const kept = prev
      .filter((r) => !visible.has(r.id) || nextById.has(r.id))
      .map((r) => nextById.get(r.id) ?? r);
    const added = next.filter((r) => !prev.some((p) => p.id === r.id));
    return [...kept, ...added];
  };
  const handleChange = (next: City[]) => {
    // Deleted rows soft-delete into Trash (skip a blank, un-saved add).
    const nextIds = new Set(next.map((r) => r.id));
    const removed = rows.filter(
      (r) => !nextIds.has(r.id) && r.name.trim() !== "",
    );
    if (removed.length) setTrashed((t) => [...removed, ...t]);
    setAll((prev) => reconcileInto(prev, next));
  };
  const handleRestore = (toRestore: City[]) => {
    const ids = new Set(toRestore.map((r) => r.id));
    setTrashed((t) => t.filter((r) => !ids.has(r.id)));
    setAll((prev) => reconcileInto(prev, [...rows, ...toRestore]));
  };

  return (
    <RecordView
      title="Cities"
      singular="City"
      icon={Landmark}
      persistKey="/system/cities"
      // Reference-table order: Country, State, then the city Name (identity).
      identityColumn="last"
      fields={fields}
      initialData={rows}
      data={rows}
      onDataChange={handleChange}
      onFilter={setFilters}
      showTrash
      trashedData={trashed}
      onRestore={handleRestore}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.country,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", state: "", country: "" })}
    />
  );
}
