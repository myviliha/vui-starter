"use client";

import {
  CubeIcon as Building,
  GlobeIcon as Compass,
  RulerHorizontalIcon as Ruler,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { markets, type Market } from "@/lib/mock-data";

function formatCenter(market: Market): string {
  if (market.centerLatitude === null || market.centerLongitude === null) {
    return "—";
  }
  return `${market.centerLatitude.toFixed(4)}, ${market.centerLongitude.toFixed(4)}`;
}

const fields: RecordField<Market>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 200, group: "General" },
  {
    key: "centerLatitude",
    label: "Center (lat, lng)",
    icon: Compass,
    width: 180,
    group: "System",
    render: (row) => (
      <span className="font-mono text-muted-foreground">
        {formatCenter(row)}
      </span>
    ),
  },
  {
    key: "radiusMiles",
    label: "Radius",
    icon: Ruler,
    align: "right",
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
];

export function MarketsTable() {
  return (
    <RecordView
      title="Markets"
      singular="Market"
      icon={MapPin}
      fields={fields}
      initialData={markets}
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
      })}
    />
  );
}
