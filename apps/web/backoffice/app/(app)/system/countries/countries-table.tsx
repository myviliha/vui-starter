"use client";

import { Flag, Globe, Hash } from "lucide-react";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { countries, type Country } from "@/lib/mock-data";

const fields: RecordField<Country>[] = [
  { key: "name", label: "Name", editable: true, group: "General", hideInTable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
  { key: "region", label: "Region", icon: Globe, editable: true, width: 220, group: "General" },
];

export function CountriesTable() {
  return (
    <RecordView
      title="Countries"
      singular="Country"
      icon={Flag}
      fields={fields}
      initialData={countries}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "", region: "" })}
    />
  );
}
