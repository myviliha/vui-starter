"use client";

import { Building, Hash, LayoutGrid, Users } from "lucide-react";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { departments, type Department } from "@/lib/mock-data";

const fields: RecordField<Department>[] = [
  { key: "title", label: "Title", editable: true, group: "General", hideInTable: true },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 200, group: "General" },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
  {
    key: "employees",
    label: "Employees",
    icon: Users,
    align: "right",
    group: "System",
    render: (row) => (
      <span className="tabular-nums">{row.employees.toLocaleString()}</span>
    ),
  },
];

export function DepartmentsTable() {
  return (
    <RecordView
      title="Departments"
      singular="Department"
      icon={LayoutGrid}
      fields={fields}
      initialData={departments}
      getPrimary={(row) => ({
        title: row.title,
        subtitle: row.organization,
        initials: (row.code || row.title).slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        organization: "",
        title: "",
        code: "",
        employees: 0,
      })}
    />
  );
}
