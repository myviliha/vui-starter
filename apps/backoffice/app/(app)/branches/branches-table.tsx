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
    input: "checkbox",
    editable: true,
    width: 150,
    group: "System",
  },
];

export function BranchesTable() {
  const pathname = usePathname();
  const { rows, onFilter, onDataChange } = useClientFilter(branches);
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
