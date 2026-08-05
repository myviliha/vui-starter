"use client";

import {
  CodeIcon as Hash,
  TextIcon as LanguagesIcon,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { languages, type Language } from "@/lib/mock-data";
import { useClientFilter } from "@/lib/use-client-filter";

const fields: RecordField<Language>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General", filterable: true },
];

export function LanguagesTable() {
  const { rows, trashed, onFilter, onDataChange, onRestore } = useClientFilter(languages);
  return (
    <RecordView
      title="Languages"
      singular="Language"
      icon={LanguagesIcon}
      fields={fields}
      initialData={rows}
      data={rows}
      onFilter={onFilter}
      onDataChange={onDataChange}
      showTrash
      trashedData={trashed}
      onRestore={onRestore}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "" })}
    />
  );
}
