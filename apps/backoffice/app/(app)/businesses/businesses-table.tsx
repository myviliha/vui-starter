"use client";

import {
  BackpackIcon as Briefcase,
  CodeIcon as Hash,
  TextAlignLeftIcon as AlignLeft,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { businesses, type Business } from "@/lib/mock-data";
import { useClientFilter } from "@/lib/use-client-filter";

const fields: RecordField<Business>[] = [
  { key: "title", label: "Title", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General", filterable: true },
  { key: "description", label: "Description", icon: AlignLeft, editable: true, width: 360, group: "General", filterable: true },
];

export function BusinessesTable() {
  const { rows, trashed, onFilter, onDataChange, onRestore } = useClientFilter(businesses);
  return (
    <RecordView
      title="Businesses"
      singular="Business"
      icon={Briefcase}
      fields={fields}
      initialData={rows}
      data={rows}
      onFilter={onFilter}
      onDataChange={onDataChange}
      showTrash
      trashedData={trashed}
      onRestore={onRestore}
      getPrimary={(row) => ({
        title: row.title,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        title: "",
        code: "",
        description: "",
      })}
    />
  );
}
