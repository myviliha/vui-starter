"use client";

import { useRef, useState, type ReactNode } from "react";

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

/** Details for the line under a brand asset. Every part is optional; only the
 *  ones you supply are shown. */
export type BrandAssetMeta = {
  name?: string;
  /** File type shown as-is, e.g. `"PNG"`, `"SVG"`. */
  format?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  uploadedAt?: string | Date;
};

/** What `onPick` may return: the URL to display, optionally with details for
 *  the preview line. Return nothing if you drive `value` yourself. */
export type BrandAssetPick = string | { url: string; meta?: BrandAssetMeta };

export type BrandAssetProps = {
  /** The URL to display. Whatever you store (an id, a path) is your business —
   *  the control only renders this. */
  value: string;
  /** Called with the picked file. Upload it and return the URL to show. Async
   *  is fine: the control shows its own busy state until the promise settles,
   *  and shows the error if it rejects. */
  onPick?: (
    file: File,
  ) => BrandAssetPick | void | Promise<BrandAssetPick | void>;
  /** Called when Remove is clicked, before the value is cleared. Use it to
   *  delete the stored asset. */
  onRemove?: () => void;
  /** Receives the new URL after a pick, and `""` after Remove. `renderInput`
   *  wires this to the form value for you. */
  onChange?: (value: string) => void;
  /** Details for the current asset, shown under the preview. */
  meta?: BrandAssetMeta;
  /** File picker filter. Defaults to every image type. */
  accept?: string;
  /** Reject anything larger, before `onPick` is called. */
  maxBytes?: number;
  /** Force the busy state, e.g. while a save is in flight. */
  busy?: boolean;
  /** Demo escape hatch: with no backend, read the file as a base64 data URI and
   *  use that as the value. Never ship this against a real API — the whole
   *  image ends up in the field. */
  inline?: boolean;
  square?: boolean;
  /** What the empty box shows. Defaults to "None"; an avatar passes initials. */
  placeholder?: ReactNode;
  /** `contain` keeps a logo whole (default); `cover` fills the box, for a photo. */
  fit?: "contain" | "cover";
  readOnly?: boolean;
};

const formatBytes = (n: number) =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;

const fileMeta = (file: File): BrandAssetMeta => ({
  name: file.name,
  format: file.type.split("/")[1]?.toUpperCase(),
  sizeBytes: file.size,
  uploadedAt: new Date(),
});

const readDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });

/** Logo / favicon control: a preview, an optional details line, and
 *  Replace / Remove. It never uploads anything itself — you hand it an
 *  `onPick` that stores the file and returns a URL. Used as `renderInput`
 *  (edit) alongside `render` (view), and exported so you can reuse it for
 *  other image fields.
 *
 * ```tsx
 * <BrandAsset
 *   value={org.logoUrl}
 *   onPick={async (file) => ({ url: (await uploadToS3(file)).url })}
 *   maxBytes={2 * 1024 * 1024}
 * />
 * ``` */
export function BrandAsset({
  value,
  onPick,
  onRemove,
  onChange,
  meta,
  accept = "image/*",
  maxBytes,
  busy,
  inline,
  square,
  placeholder,
  fit = "contain",
  readOnly,
}: BrandAssetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Details from the last pick, kept only while they describe the current
  // value — so Cancel (which reverts `value`) drops them too.
  const [picked, setPicked] = useState<{ url: string; meta: BrandAssetMeta }>();
  const [dims, setDims] = useState<{ width: number; height: number }>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const working = busy || uploading;
  const info = picked?.url === value ? picked.meta : meta;
  const width = info?.width ?? dims?.width;
  const height = info?.height ?? dims?.height;
  const details = [
    info?.name,
    info?.format,
    width && height ? `${width} × ${height}` : undefined,
    info?.sizeBytes ? formatBytes(info.sizeBytes) : undefined,
    info?.uploadedAt
      ? new Date(info.uploadedAt).toISOString().slice(0, 10)
      : undefined,
  ].filter(Boolean);

  async function handleFile(file: File) {
    setError("");
    if (maxBytes && file.size > maxBytes) {
      setError(
        `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)}.`,
      );
      return;
    }
    if (!onPick && !inline) {
      setError("This field has no uploader configured.");
      return;
    }
    setUploading(true);
    try {
      const result = onPick
        ? await onPick(file)
        : { url: await readDataUrl(file), meta: fileMeta(file) };
      // Nothing returned means the caller updated `value` itself.
      if (result) {
        const url = typeof result === "string" ? result : result.url;
        const next =
          typeof result === "string"
            ? fileMeta(file)
            : (result.meta ?? fileMeta(file));
        setPicked({ url, meta: next });
        setDims(undefined);
        onChange?.(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const box = square ? "size-12" : "h-12 w-24";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div
          className={`flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40`}
        >
          {value ? (
            <img
              src={value}
              alt=""
              className={
                fit === "cover"
                  ? "size-full object-cover"
                  : "max-h-full max-w-full object-contain"
              }
              onLoad={(e) =>
                setDims({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                })
              }
            />
          ) : (
            <span className="text-xs text-muted-foreground">
              {placeholder ?? "None"}
            </span>
          )}
        </div>
        {!readOnly && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              type="button"
              disabled={working}
              onClick={() => inputRef.current?.click()}
            >
              {working ? "Uploading…" : value ? "Replace" : "Upload"}
            </Button>
            {value && (
              <Button
                size="sm"
                variant="ghost"
                type="button"
                disabled={working}
                onClick={() => {
                  setError("");
                  setPicked(undefined);
                  setDims(undefined);
                  onRemove?.();
                  onChange?.("");
                }}
              >
                Remove
              </Button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = ""; // allow re-picking the same file
                if (file) void handleFile(file);
              }}
            />
          </div>
        )}
      </div>
      {details.length > 0 && (
        <p className="text-xs text-muted-foreground">{details.join(" · ")}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
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

/** How a brand-asset field stores its file. Everything `BrandAsset` takes
 *  except the props the field itself supplies. */
export type BrandAssetHost = Omit<
  BrandAssetProps,
  "value" | "onChange" | "square" | "readOnly"
>;

export type OrgProfileFieldOptions = {
  logo?: BrandAssetHost;
  favicon?: BrandAssetHost;
};

const brandAssetField = (
  key: "logo" | "favicon",
  label: string,
  description: string,
  host: BrandAssetHost,
  square?: boolean,
): RecordField<OrgProfile> => ({
  key,
  label,
  description,
  group: "Brand assets",
  editable: true,
  render: (row) => (
    <BrandAsset {...host} value={row[key]} square={square} readOnly />
  ),
  renderInput: ({ value, onChange }) => (
    <BrandAsset {...host} value={value} onChange={onChange} square={square} />
  ),
});

/**
 * The organization profile fields, with your uploader wired into the Logo and
 * Favicon controls:
 *
 * ```tsx
 * const fields = orgProfileFields({
 *   logo: { onPick: async (file) => ({ url: await upload(file) }) },
 *   favicon: { onPick: async (file) => ({ url: await upload(file) }) },
 * });
 * ```
 *
 * Pass no options and the brand assets fall back to `inline` (base64 data URI)
 * mode, which is fine for a demo with no backend and wrong for anything else.
 * `organizationProfileFields` is that demo default, pre-built.
 */
export function orgProfileFields({
  logo,
  favicon,
}: OrgProfileFieldOptions = {}): RecordField<OrgProfile>[] {
  return organizationProfileFields.map((field) =>
    field.key === "logo"
      ? brandAssetField("logo", LOGO.label, LOGO.description, {
          ...LOGO.host,
          ...logo,
        })
      : field.key === "favicon"
        ? brandAssetField(
            "favicon",
            FAVICON.label,
            FAVICON.description,
            { ...FAVICON.host, ...favicon },
            true,
          )
        : field,
  );
}

const LOGO = {
  label: "Logo",
  description:
    "Recommended 480 × 160, transparent background. SVG or PNG, max 2 MB. If unset, the organization's initials are used.",
  host: { inline: true, maxBytes: 2 * 1024 * 1024 } satisfies BrandAssetHost,
};

const FAVICON = {
  label: "Favicon",
  description:
    "Square, 512 × 512. Used for the browser tab and mobile shortcut. Max 512 KB.",
  host: { inline: true, maxBytes: 512 * 1024 } satisfies BrandAssetHost,
};

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
  brandAssetField("logo", LOGO.label, LOGO.description, LOGO.host),
  brandAssetField(
    "favicon",
    FAVICON.label,
    FAVICON.description,
    FAVICON.host,
    true,
  ),

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
