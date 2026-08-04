"use client";

import { useRef } from "react";

import {
  CubeIcon as Building2,
  EnvelopeClosedIcon as Mail,
  GlobeIcon as Globe,
  IdCardIcon as IdCard,
  PersonIcon as Person,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import { Button } from "./button";
import { type IconType, type RecordField } from "./record-view";

/**
 * Organization Profile preset: the field definitions for a company's profile,
 * ready to drop into `ProfileForm`. Ship your own `data` (of shape `OrgProfile`)
 * and spread/override `organizationProfileFields` to fit your schema.
 *
 * ```tsx
 * import { ProfileForm } from "@viliha/vui-ui/profile-form";
 * import { organizationProfileFields, getOrgPrimary, type OrgProfile } from "@viliha/vui-ui/organization-profile";
 *
 * <ProfileForm data={org} fields={organizationProfileFields}
 *   getPrimary={getOrgPrimary} onSave={save} title="Organization" />
 * ```
 */
export type OrgProfile = {
  id: number;
  // Organization information
  legalName: string;
  displayName: string;
  orgId: string; // read-only, generated at creation
  domain: string;
  registrationNo: string;
  industry: string;
  country: string;
  region: string;
  description: string;
  // Brand assets — data URLs (or a CDN URL once wired). Empty = use initials.
  logo: string;
  favicon: string;
  // Contact & address
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  billingEmail: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  // Localization & units
  timezone: string;
  currency: string;
  dateFormat: string;
  measurement: string;
  language: string;
};

export const ORGANIZATION_PROFILE_ICON: IconType = Building2;

export const ORGANIZATION_PROFILE_DESCRIPTION =
  "This is your organization's profile: the company details, branding, contact information and locale that appear across the app, its portal, documents and emails. Switch to Edit to change anything, then Save. Fields marked with * are required.";

/** value === label options (the demo stores display strings). */
const opts = (vals: readonly string[]) =>
  vals.map((v) => ({ value: v, label: v }));

/** Logo / favicon control: a preview plus Replace / Remove. Reads the picked
 *  file as a data URL (a real API would upload it and store the returned URL).
 *  Used as `renderInput` (edit) alongside `render` (view). Exported so you can
 *  reuse it for other image fields. */
export function BrandAsset({
  value,
  onChange,
  square,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  square?: boolean;
  readOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const box = square ? "size-12" : "h-12 w-24";
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40`}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </div>
      {!readOnly && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => onChange?.("")}
            >
              Remove
            </Button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onChange?.(String(reader.result));
              reader.readAsDataURL(file);
              e.target.value = ""; // allow re-picking the same file
            }}
          />
        </div>
      )}
    </div>
  );
}

const INDUSTRIES = [
  "Retail operations",
  "Property services",
  "Facilities management",
  "Hospitality",
  "Logistics",
];
const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Japan",
  "Australia",
];
const REGIONS = ["Americas", "EMEA", "APAC"];
const TIMEZONES = [
  "America/Los_Angeles (UTC−7)",
  "America/New_York (UTC−4)",
  "Europe/London (UTC+1)",
  "Asia/Tokyo (UTC+9)",
];
const CURRENCIES = ["USD ($)", "CAD ($)", "GBP (£)", "EUR (€)", "JPY (¥)"];
const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
const MEASUREMENTS = ["Imperial (ft, lb, °F)", "Metric (m, kg, °C)"];
const LANGUAGES = ["English (US)", "English (UK)", "Français", "日本語"];

export const organizationProfileFields: RecordField<OrgProfile>[] = [
  // ── Organization information ──
  {
    key: "legalName",
    label: "Legal name",
    description: "As registered. Appears on contracts and invoices.",
    group: "Organization information",
    editable: true,
    required: true,
  },
  {
    key: "displayName",
    label: "Display name",
    description: "Shown in the sidebar and across the app.",
    group: "Organization information",
    editable: true,
    required: true,
  },
  {
    key: "orgId",
    label: "Organization ID",
    description: "Generated at creation. Cannot be changed.",
    icon: IdCard,
    group: "Organization information",
    // Not editable → renders as a read-only value in both modes.
  },
  {
    key: "domain",
    label: "Primary domain",
    description: "Used to match new users to this organization.",
    icon: Globe,
    group: "Organization information",
    editable: true,
    required: true,
  },
  {
    key: "registrationNo",
    label: "Registration no.",
    description: "Business registration or tax number.",
    group: "Organization information",
    editable: true,
  },
  {
    key: "industry",
    label: "Industry",
    group: "Organization information",
    editable: true,
    options: opts(INDUSTRIES),
  },
  {
    key: "country",
    label: "Country",
    description: "Headquarters country. Drives default tax and locale.",
    icon: MapPin,
    group: "Organization information",
    editable: true,
    required: true,
    options: opts(COUNTRIES),
  },
  {
    key: "region",
    label: "Region",
    description: "Drives reporting rollups and data residency.",
    group: "Organization information",
    editable: true,
    required: true,
    options: opts(REGIONS),
  },
  {
    key: "description",
    label: "Description",
    description: "A short summary of what this organization does.",
    group: "Organization information",
    editable: true,
  },

  // ── Brand assets ──
  {
    key: "logo",
    label: "Logo",
    description:
      "Recommended 480 × 160, transparent background. SVG or PNG, max 2 MB. If unset, the organization's initials are used.",
    group: "Brand assets",
    editable: true,
    render: (row) => <BrandAsset value={row.logo} readOnly />,
    renderInput: ({ value, onChange }) => (
      <BrandAsset value={value} onChange={onChange} />
    ),
  },
  {
    key: "favicon",
    label: "Favicon",
    description:
      "Square, 512 × 512. Used for the browser tab and mobile shortcut. Max 512 KB.",
    group: "Brand assets",
    editable: true,
    render: (row) => <BrandAsset value={row.favicon} square readOnly />,
    renderInput: ({ value, onChange }) => (
      <BrandAsset value={value} onChange={onChange} square />
    ),
  },

  // ── Contact & address ──
  {
    key: "contactName",
    label: "Primary contact",
    icon: Person,
    group: "Contact & address",
    editable: true,
  },
  {
    key: "contactEmail",
    label: "Contact email",
    icon: Mail,
    group: "Contact & address",
    editable: true,
    copyable: true,
  },
  {
    key: "contactPhone",
    label: "Contact phone",
    group: "Contact & address",
    editable: true,
  },
  {
    key: "billingEmail",
    label: "Billing email",
    description: "Where invoices and billing notices are sent.",
    icon: Mail,
    group: "Contact & address",
    editable: true,
    copyable: true,
  },
  {
    key: "address1",
    label: "Registered address",
    group: "Contact & address",
    editable: true,
  },
  {
    key: "address2",
    label: "Address line 2",
    group: "Contact & address",
    editable: true,
  },
  { key: "city", label: "City", group: "Contact & address", editable: true },
  {
    key: "state",
    label: "State / province",
    group: "Contact & address",
    editable: true,
  },
  {
    key: "postalCode",
    label: "Postal code",
    group: "Contact & address",
    editable: true,
  },

  // ── Localization & units ──
  {
    key: "timezone",
    label: "Timezone",
    group: "Localization & units",
    editable: true,
    options: opts(TIMEZONES),
  },
  {
    key: "currency",
    label: "Currency",
    description: "Changing this does not convert historical invoices.",
    group: "Localization & units",
    editable: true,
    options: opts(CURRENCIES),
  },
  {
    key: "dateFormat",
    label: "Date format",
    group: "Localization & units",
    editable: true,
    options: opts(DATE_FORMATS),
  },
  {
    key: "measurement",
    label: "Measurement system",
    group: "Localization & units",
    editable: true,
    options: opts(MEASUREMENTS),
  },
  {
    key: "language",
    label: "Default language",
    group: "Localization & units",
    editable: true,
    options: opts(LANGUAGES),
  },
];

export function getOrgPrimary(row: OrgProfile) {
  return {
    title: row.displayName || row.legalName,
    subtitle: row.domain,
    initials: (row.displayName || row.legalName || "OP")
      .slice(0, 2)
      .toUpperCase(),
  };
}
