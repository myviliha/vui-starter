"use client";

import { useEffect, useState } from "react";
import {
  CubeIcon as Building,
  GlobeIcon as Compass,
  RulerHorizontalIcon as Ruler,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import {
  RecordView,
  type FilterValues,
  type RecordField,
} from "@viliha/vui-ui/record-view";
import { markets, type Market } from "@/lib/mock-data";
import { resolvePostCodes, searchPostCodes } from "@/lib/api/post-codes";
import { filterRows, reconcile } from "@/lib/use-client-filter";

function formatCenter(market: Market): string {
  if (market.centerLatitude === null || market.centerLongitude === null) {
    return "—";
  }
  return `${market.centerLatitude.toFixed(4)}, ${market.centerLongitude.toFixed(4)}`;
}

const fields: RecordField<Market>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 200, group: "General", filterable: true },
  {
    key: "centerLatitude",
    label: "Center (lat, lng)",
    icon: Compass,
    width: 180,
    group: "System",
    render: (row) => (
      <span className="whitespace-nowrap font-mono tabular-nums text-muted-foreground">
        {formatCenter(row)}
      </span>
    ),
  },
  {
    key: "radiusMiles",
    label: "Radius",
    icon: Ruler,
    // No explicit align — auto-aligns center (numeric).
    group: "System",
    render: (row) => (
      <span className="tabular-nums">
        {row.radiusMiles === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          `${row.radiusMiles} mi`
        )}
      </span>
    ),
  },
  {
    // Many-to-many: a searchable, async multi-select. The cell shows up to 3
    // codes then "+N"; the Add/Edit form renders removable chips.
    key: "postCodes",
    label: "Post codes",
    description:
      "The set of post codes this market serves — search the remote list and pick any number.",
    width: 220,
    group: "System",
    editable: true,
    multiple: true,
    input: "combobox",
    maxChipsInCell: 3,
    loadOptions: ({ search, signal }) => searchPostCodes({ search, signal }),
    resolveOptions: (values) => resolvePostCodes(values),
  },
];

export function MarketsTable() {
  // Demo: simulate loading records from a server so the skeleton state shows on
  // first visit. In a real app, set `loading` around your fetch/refetch.
  const [data, setData] = useState<Market[]>([]);
  const [trashed, setTrashed] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues<Market>>({});
  useEffect(() => {
    const t = setTimeout(() => {
      setData(markets);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const rows = filterRows(data, filters);

  return (
    <RecordView
      title="Markets"
      singular="Market"
      icon={MapPin}
      loading={loading}
      fields={fields}
      initialData={rows}
      data={rows}
      onFilter={setFilters}
      onDataChange={(next) => {
        const nextIds = new Set(next.map((r) => r.id));
        const removed = rows.filter(
          (r) => !nextIds.has(r.id) && r.name.trim() !== "",
        );
        if (removed.length) setTrashed((t) => [...removed, ...t]);
        setData((prev) => reconcile(prev, rows, next));
      }}
      showTrash
      trashedData={trashed}
      onRestore={(toRestore) => {
        const ids = new Set(toRestore.map((r) => r.id));
        setTrashed((t) => t.filter((r) => !ids.has(r.id)));
        setData((prev) => reconcile(prev, rows, [...rows, ...toRestore]));
      }}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.organization,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        organization: "",
        name: "",
        centerLatitude: null,
        centerLongitude: null,
        radiusMiles: null,
        postCodes: [],
      })}
    />
  );
}
