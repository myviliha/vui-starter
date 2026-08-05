"use client";

import {
  ArchiveIcon as Factory,
  CubeIcon as Building,
  GlobeIcon as Globe,
  PersonIcon as Users,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { companies, type Company } from "@/lib/crm-data";
import { useClientFilter } from "@/lib/use-client-filter";

const fields: RecordField<Company>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "domain", label: "Domain", icon: Globe, editable: true, copyable: true, width: 210, group: "General", filterable: true },
  { key: "industry", label: "Industry", icon: Factory, editable: true, group: "General", filterable: true },
  { key: "city", label: "City", icon: MapPin, editable: true, group: "General", filterable: true },
  { key: "country", label: "Country", icon: MapPin, editable: true, group: "General", filterable: true },
  {
    key: "employees",
    label: "Employees",
    icon: Users,
    // No explicit align — auto-aligns center (numeric count).
    group: "System",
    render: (row) => (
      <span className="tabular-nums">{row.employees.toLocaleString()}</span>
    ),
  },
];

export function CompaniesTable() {
  const { rows, trashed, onFilter, onDataChange, onRestore } = useClientFilter(companies);
  return (
    <RecordView
      title="Companies"
      singular="Company"
      icon={Building}
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
