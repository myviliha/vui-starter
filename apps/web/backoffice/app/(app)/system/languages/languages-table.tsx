"use client";

import {
  CodeIcon as Hash,
  TextIcon as LanguagesIcon,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { languages, type Language } from "@/lib/mock-data";

const fields: RecordField<Language>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
];

export function LanguagesTable() {
  return (
    <RecordView
      title="Languages"
      singular="Language"
      icon={LanguagesIcon}
      fields={fields}
      initialData={languages}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "" })}
    />
  );
}
