"use client";

import {
  CodeIcon as Hash,
  CubeIcon as Building,
  DotFilledIcon as CircleDot,
  EnvelopeClosedIcon as Mail,
  MobileIcon as Phone,
  SewingPinFilledIcon as MapPin,
  Share2Icon as Network,
} from "@radix-ui/react-icons";

import { usePathname } from "next/navigation";

import { Badge } from "@viliha/vui-ui/badge";
import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { branches, type Branch } from "@/lib/mock-data";
import { useClientFilter } from "@/lib/use-client-filter";

// Field-level validation runs on blur + before Save and blocks Save while any
// value is invalid, with the message shown inline under the field.
const fields: RecordField<Branch>[] = [
  {
    key: "name",
    label: "Name",
    description: "3–20 letters.",
    editable: true,
    required: true,
    group: "General",
    hideInTable: true,
    filterable: true,
    min: 3,
    max: 20,
    pattern: /^[\p{L} ]+$/u,
    patternMessage: "Letters and spaces only",
    trim: true,
  },
  { key: "organization", label: "Organization", icon: Building, editable: true, width: 180, group: "General", filterable: true, trim: true },
  {
    key: "code",
    label: "Code",
    description: "1–5 letters or digits.",
    icon: Hash,
    editable: true,
    required: true,
    group: "General",
    filterable: true,
    min: 1,
    max: 5,
    pattern: /^[A-Za-z0-9]+$/,
    patternMessage: "1–5 letters or digits",
    trim: true,
  },
  { key: "email", label: "Email", icon: Mail, editable: true, copyable: true, width: 220, group: "General", format: "email", trim: true },
  {
    key: "phone",
    label: "Phone",
    description: "US number, auto-formatted as (123) 456-7890.",
    icon: Phone,
    editable: true,
    copyable: true,
    width: 160,
    group: "General",
    format: "phone",
    trim: true,
  },
  { key: "city", label: "City", icon: MapPin, editable: true, group: "General", filterable: true, trim: true },
  {
    key: "isHeadquarters",
    label: "Headquarter",
    description: "Is this the organization's head office?",
    icon: CircleDot,
    input: "checkbox", // checkbox in the Add/Edit form…
    editable: true,
    width: 150,
    group: "System",
    // …and a badge in the table (render is the read view; the checkbox wins in edit).
    render: (row) =>
      row.isHeadquarters ? (
        <Badge variant="secondary">Headquarters</Badge>
      ) : (
        <Badge variant="muted">Branch</Badge>
      ),
  },
];

// A couple of already-soft-deleted branches so the Trash view isn't empty.
const SOFT_DELETED: Branch[] = [
  { id: 101, organization: "Northwind Retail", name: "Boston", code: "BOS", email: "boston@northwind.example.com", phone: "(617) 555-0155", city: "Boston", isHeadquarters: false },
  { id: 102, organization: "Northwind Retail", name: "Phoenix", code: "PHX", email: "phoenix@northwind.example.com", phone: "(602) 555-0171", city: "Phoenix", isHeadquarters: false },
];

export function BranchesTable() {
  const pathname = usePathname();
  // Soft-deleted branches seeded so Trash isn't empty on first open; deleting a
  // live branch also moves it here. The backend owns this in a real app.
  const { rows, trashed, onFilter, onDataChange, onRestore } = useClientFilter(
    branches,
    SOFT_DELETED,
  );
  return (
    <RecordView
      persistKey={pathname}
      title="Branches"
      singular="Branch"
      icon={Network}
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
