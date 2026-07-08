"use client";

import { Building2, CircleDot, Globe, Mail, MapPin, Network, Users } from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { RecordView, type RecordField } from "@repo/ui/record-view";
import {
  organizations,
  type DemoOrganization,
  type OrganizationStatus,
} from "@/lib/demo-data";

const statusBadge: Record<
  OrganizationStatus,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  active: { label: "Active", variant: "success" },
  trial: { label: "Trial", variant: "warning" },
  suspended: { label: "Suspended", variant: "destructive" },
};

const fields: RecordField<DemoOrganization>[] = [
  { key: "name", label: "Name", editable: true, group: "General", hideInTable: true },
  { key: "url", label: "Domain", icon: Globe, editable: true, copyable: true, width: 200, group: "General" },
  { key: "email", label: "Email", icon: Mail, editable: true, copyable: true, width: 220, group: "General" },
  { key: "country", label: "Country", icon: MapPin, editable: true, group: "General" },
  {
    key: "branches",
    label: "Branches",
    icon: Network,
    align: "right",
    group: "System",
    render: (row) => <span className="tabular-nums">{row.branches}</span>,
  },
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
  {
    key: "status",
    label: "Status",
    icon: CircleDot,
    group: "System",
    render: (row) => {
      const status = statusBadge[row.status];
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

export function OrganizationsTable() {
  return (
    <RecordView
      title="Organizations"
      singular="Organization"
      icon={Building2}
      fields={fields}
      initialData={organizations}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.url,
        initials: row.initials || row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={(): DemoOrganization => ({
        id: Date.now(),
        name: "",
        url: "",
        email: "",
        countryCode: "",
        country: "",
        branches: 0,
        employees: 0,
        status: "trial",
        initials: "",
        updated: "just now",
      })}
    />
  );
}
