"use client";

import { AlignLeft, Briefcase, Hash } from "lucide-react";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { businesses, type Business } from "@/lib/mock-data";

const fields: RecordField<Business>[] = [
  { key: "title", label: "Title", editable: true, group: "General", hideInTable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
  { key: "description", label: "Description", icon: AlignLeft, editable: true, width: 360, group: "General" },
];

export function BusinessesTable() {
  return (
    <RecordView
      title="Businesses"
      singular="Business"
      icon={Briefcase}
      fields={fields}
      initialData={businesses}
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
