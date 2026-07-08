"use client";

import { Building, CircleDot, Hash, Mail, MapPin, Network, Phone } from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { RecordView, type RecordField } from "@repo/ui/record-view";
import { branches, type Branch } from "@/lib/mock-data";

const fields: RecordField<Branch>[] = [
  { key: "name", label: "Name", editable: true, group: "General", hideInTable: true },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 180, group: "General" },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
  { key: "email", label: "Email", icon: Mail, editable: true, copyable: true, width: 220, group: "General" },
  { key: "phone", label: "Phone", icon: Phone, editable: true, copyable: true, width: 160, group: "General" },
  { key: "city", label: "City", icon: MapPin, editable: true, group: "General" },
  {
    key: "isHeadquarters",
    label: "HQ",
    icon: CircleDot,
    group: "System",
    render: (row) =>
      row.isHeadquarters ? (
        <Badge variant="secondary">Headquarters</Badge>
      ) : (
        <Badge variant="muted">Branch</Badge>
      ),
  },
];

export function BranchesTable() {
  return (
    <RecordView
      title="Branches"
      singular="Branch"
      icon={Network}
      fields={fields}
      initialData={branches}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.organization,
        initials: (row.code || row.name).slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        organization: "",
        name: "",
        code: "",
        email: "",
        phone: "",
        city: "",
        isHeadquarters: false,
      })}
    />
  );
}
