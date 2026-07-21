import {
  CubeIcon as Building2,
  DotFilledIcon as CircleDot,
  EnvelopeClosedIcon as Mail,
  GlobeIcon as Globe,
  PersonIcon as Users,
  SewingPinFilledIcon as MapPin,
  Share2Icon as Network,
} from "@radix-ui/react-icons";

import { Badge } from "@viliha/vui-ui/badge";
import { type IconType, type RecordField } from "@viliha/vui-ui/record-view";
import {
  type DemoOrganization,
  type OrganizationStatus,
} from "@/lib/demo-data";

// Shared organization view config — reused by the table and the create/edit routes.
export const ORG_TITLE = "Organizations";
export const ORG_SINGULAR = "Organization";
export const ORG_ICON: IconType = Building2;
export const ORG_FORM_DESCRIPTION =
  "Organizations are the top-level tenants in the system. Each one groups its branches, departments and employees, and owns its billing and locale settings. Fill in the details below to create or update a record.";

const statusBadge: Record<
  OrganizationStatus,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  active: { label: "Active", variant: "success" },
  trial: { label: "Trial", variant: "warning" },
  suspended: { label: "Suspended", variant: "destructive" },
};

export const fields: RecordField<DemoOrganization>[] = [
  { key: "name", label: "Name", description: "The organization's legal or trading name, shown across the app.", editable: true, required: true, group: "General", hideInTable: true },
  { key: "url", label: "Domain", description: "Primary web domain, e.g. acme.com — used to group users and match emails.", icon: Globe, editable: true, copyable: true, width: 200, group: "General" },
  { key: "email", label: "Email", description: "Main contact address for billing and account notices.", icon: Mail, editable: true, required: true, copyable: true, width: 220, group: "General" },
  { key: "country", label: "Country", description: "Headquarters country. Drives default currency, tax and locale.", icon: MapPin, editable: true, group: "General" },
  {
    key: "branches",
    label: "Branches",
    description: "Number of physical or regional offices under this organization.",
    icon: Network,
    group: "System",
    render: (row) => <span className="tabular-nums">{row.branches}</span>,
  },
  {
    key: "employees",
    label: "Employees",
    description: "Approximate headcount. Used for reporting and plan sizing.",
    icon: Users,
    group: "System",
    render: (row) => (
      <span className="tabular-nums">{row.employees.toLocaleString()}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    description: "Account lifecycle: Trial while evaluating, Active once live, Suspended to disable access.",
    icon: CircleDot,
    group: "System",
    options: [
      { value: "active", label: "Active" },
      { value: "trial", label: "Trial" },
      { value: "suspended", label: "Suspended" },
    ],
    render: (row) => {
      const status = statusBadge[row.status];
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

export function getPrimary(row: DemoOrganization) {
  return {
    title: row.name,
    subtitle: row.url,
    initials: row.initials || row.name.slice(0, 2).toUpperCase(),
  };
}

export function makeEmptyRow(): DemoOrganization {
  return {
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
  };
}
