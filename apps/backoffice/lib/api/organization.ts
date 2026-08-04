// DATA LAYER (API) — the current organization's profile (a single record).
//
// Three-layer architecture (see AGENTS.md → "Architecture: three layers"):
//   data (this file)  →  controller (use-org-profile.ts)  →  presentation.
// Nothing here imports React. It's a mock in-memory record today; to wire a
// real API, swap the function bodies for `fetch(url, { signal })` and nothing
// above changes. `getOrgProfile` is async on purpose so the "paint UI first,
// load data after" pattern is visible.
//
// This differs from `organizations.ts` (a LIST of tenant orgs): this is the ONE
// organization the signed-in admin manages — its company info, branding, contact
// details and locale — shown on the Organization Profile page.

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

// The in-memory record. A real backend replaces this with your database.
let profile: OrgProfile = {
  id: 1,
  legalName: "Northwind Retail Group, Inc.",
  displayName: "Northwind Retail",
  orgId: "ORG-1042",
  domain: "northwind.example.com",
  registrationNo: "US-DE-88-2041773",
  industry: "Retail operations",
  country: "United States",
  region: "Americas",
  description:
    "Multi-site retail group running in-house landscaping, janitorial and seasonal maintenance across 12 US branches.",
  logo: "",
  favicon: "",
  contactName: "Ava Bennett",
  contactEmail: "ava.b@northwind.example.com",
  contactPhone: "+1 206 555 0142",
  billingEmail: "billing@northwind.example.com",
  address1: "1201 Western Avenue",
  address2: "Suite 400",
  city: "Seattle",
  state: "Washington",
  postalCode: "98101",
  timezone: "America/Los_Angeles (UTC−7)",
  currency: "USD ($)",
  dateFormat: "MM/DD/YYYY",
  measurement: "Imperial (ft, lb, °F)",
  language: "English (US)",
};

// ponytail: simulate network latency so the loading state is visible; a real
// fetch() has its own. Delete when wiring the API.
const LATENCY_MS = 300;
function wait(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/** Read the current organization's profile. Async on purpose — the real-API seam. */
export async function getOrgProfile(signal?: AbortSignal): Promise<OrgProfile> {
  await wait(signal);
  return { ...profile };
}

/** Persist edits. Optimistic in the demo (mutate in place); a real API awaits
 *  the request and reconciles. Signature is ready for that swap. */
export function updateOrgProfile(next: OrgProfile): void {
  profile = { ...next };
}
