"use client";

import {
  BookmarkIcon as Flag,
  CodeIcon as Hash,
  GlobeIcon as Globe,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { countries, type Country } from "@/lib/mock-data";
import { useClientFilter } from "@/lib/use-client-filter";

const fields: RecordField<Country>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General", filterable: true },
  { key: "region", label: "Region", icon: Globe, editable: true, width: 220, group: "General", filterable: true },
];

export function CountriesTable() {
  const { rows, onFilter, onDataChange } = useClientFilter(countries);
  return (
    <RecordView
      title="Countries"
      singular="Country"
      icon={Flag}
      fields={fields}
      initialData={rows}
      data={rows}
      onFilter={onFilter}
      onDataChange={onDataChange}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "", region: "" })}
    />
  );
}
