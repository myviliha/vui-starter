"use client";

import {
  BackpackIcon as Briefcase,
  CubeIcon as Building2,
  EnvelopeClosedIcon as Mail,
  IdCardIcon as Contact,
  MobileIcon as Phone,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@repo/ui/record-view";
import { people, type Person } from "@/lib/crm-data";

const fields: RecordField<Person>[] = [
  { key: "firstName", label: "First name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "lastName", label: "Last name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "email", label: "Emails", icon: Mail, editable: true, copyable: true, width: 240, group: "General" },
  { key: "phone", label: "Phones", icon: Phone, editable: true, copyable: true, width: 160, group: "General" },
  { key: "city", label: "City", icon: MapPin, editable: true, group: "General" },
  { key: "jobTitle", label: "Job Title", icon: Briefcase, editable: true, group: "Work" },
  { key: "company", label: "Company", icon: Building2, editable: true, group: "Work" },
];

export function PeopleTable() {
  return (
    <RecordView
      title="People"
      singular="Person"
      icon={Contact}
      fields={fields}
      initialData={people}
      getPrimary={(row) => ({
        title: `${row.firstName} ${row.lastName}`.trim(),
        subtitle: row.email,
        initials: `${row.firstName[0] ?? ""}${row.lastName[0] ?? ""}`.toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        company: "",
        city: "",
      })}
    />
  );
}
