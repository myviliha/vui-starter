"use client";

import {
  CodeIcon as Hash,
  CubeIcon as Building,
  DashboardIcon as LayoutGrid,
  PersonIcon as Users,
} from "@radix-ui/react-icons";

import { usePathname } from "next/navigation";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { departments, type Department } from "@/lib/mock-data";
import { useClientFilter } from "@/lib/use-client-filter";

const fields: RecordField<Department>[] = [
  { key: "title", label: "Title", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 200, group: "General", filterable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General", filterable: true },
  {
    key: "employees",
    label: "Employees",
    icon: Users,
    // No explicit align — auto-aligns center (numeric). See RecordView.
    group: "System",
    render: (row) => (
      <span className="tabular-nums">{row.employees.toLocaleString()}</span>
    ),
  },
];

export function DepartmentsTable() {
  const pathname = usePathname();
  const { rows, trashed, onFilter, onDataChange, onRestore } = useClientFilter(departments);
  return (
    <RecordView
      persistKey={pathname}
      title="Departments"
      singular="Department"
      icon={LayoutGrid}
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
