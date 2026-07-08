"use client";

import { Building, Factory, Globe, MapPin, Users } from "lucide-react";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { companies, type Company } from "@/lib/crm-data";

const fields: RecordField<Company>[] = [
  { key: "name", label: "Name", editable: true, group: "General", hideInTable: true },
  { key: "domain", label: "Domain", icon: Globe, editable: true, copyable: true, width: 210, group: "General" },
  { key: "industry", label: "Industry", icon: Factory, editable: true, group: "General" },
  { key: "city", label: "City", icon: MapPin, editable: true, group: "General" },
  { key: "country", label: "Country", icon: MapPin, editable: true, group: "General" },
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

export function CompaniesTable() {
  return (
    <RecordView
      title="Companies"
      singular="Company"
      icon={Building}
      fields={fields}
      initialData={companies}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.domain,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        name: "",
        domain: "",
        industry: "",
        employees: 0,
        city: "",
        country: "",
      })}
    />
  );
}
