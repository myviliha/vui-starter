"use client";

import {
  CodeIcon as Hash,
  CubeIcon as Building,
  DotFilledIcon as CircleDot,
  EnvelopeClosedIcon as Mail,
  PersonIcon as Users,
  Share2Icon as Network,
} from "@radix-ui/react-icons";

import { Badge } from "@myviliha/vui-ui/badge";
import { RecordView, type RecordField } from "@myviliha/vui-ui/record-view";
import { employees, type DemoEmployee } from "@/lib/demo-data";

const fields: RecordField<DemoEmployee>[] = [
  { key: "firstName", label: "First name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "lastName", label: "Last name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "email", label: "Email", icon: Mail, editable: true, copyable: true, width: 240, group: "General" },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "Work" },
  { key: "department", label: "Department", editable: true, group: "Work" },
  { key: "branch", label: "Branch", icon: Network, editable: true, group: "Work" },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 180, group: "Work" },
  {
    key: "isActive",
    label: "Status",
    icon: CircleDot,
    group: "System",
    render: (row) =>
      row.isActive ? (
        <Badge variant="success">Active</Badge>
      ) : (
        <Badge variant="muted">Inactive</Badge>
      ),
  },
];

export function EmployeesTable() {
  return (
    <RecordView
      title="Employees"
      singular="Employee"
      icon={Users}
      fields={fields}
      initialData={employees}
      getPrimary={(row) => ({
        title: `${row.firstName} ${row.lastName}`.trim(),
        subtitle: row.email,
        initials: `${row.firstName[0] ?? ""}${row.lastName[0] ?? ""}`.toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        code: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        branch: "",
        organization: "",
        isActive: true,
      })}
    />
  );
}
