"use client";

import {
  CodeIcon as Hash,
  GlobeIcon as Globe,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { regions, type Region } from "@/lib/mock-data";

const fields: RecordField<Region>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
];

export function RegionsTable() {
  return (
    <RecordView
      title="Regions"
      singular="Region"
      icon={Globe}
      fields={fields}
      initialData={regions}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "" })}
    />
  );
}
