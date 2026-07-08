"use client";

import { Flag, Landmark, MapPin } from "lucide-react";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { cities, type City } from "@/lib/mock-data";

const fields: RecordField<City>[] = [
  { key: "name", label: "Name", editable: true, group: "General", hideInTable: true },
  { key: "state", label: "State", icon: MapPin, editable: true, group: "General" },
  { key: "country", label: "Country", icon: Flag, editable: true, group: "General" },
];

export function CitiesTable() {
  return (
    <RecordView
      title="Cities"
      singular="City"
      icon={Landmark}
      fields={fields}
      initialData={cities}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.country,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", state: "", country: "" })}
    />
  );
}
