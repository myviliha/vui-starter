/**
 * In-memory demo data for the backoffice homepage (organizations, branches,
 * departments, employees, markets, countries/regions). Swap this for a real
 * data/API layer when you wire up a backend.
 */

export type OrganizationStatus = "active" | "trial" | "suspended";

export interface DemoOrganization {
  id: number;
  name: string;
  url: string;
  email: string;
  countryCode: string;
  country: string;
  branches: number;
  employees: number;
  status: OrganizationStatus;
  /** Fallback initials for the avatar. */
  initials: string;
  /** Relative "created/updated" label for the recent list. */
  updated: string;
}

export interface DemoEmployee {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  branch: string;
  organization: string;
  isActive: boolean;
}

export interface DemoMarket {
  id: number;
  name: string;
  organization: string;
  radiusMiles: number | null;
}

export interface RegionBreakdown {
  region: string;
  organizations: number;
}

export const organizations: DemoOrganization[] = [
  {
    id: 1,
    name: "Northwind Retail",
    url: "northwind.example.com",
    email: "ops@northwind.example.com",
    countryCode: "US",
    country: "United States",
    branches: 12,
    employees: 340,
    status: "active",
    initials: "NR",
    updated: "2h ago",
  },
  {
    id: 2,
    name: "Sakura Foods",
    url: "sakura.example.jp",
    email: "hello@sakura.example.jp",
    countryCode: "JP",
    country: "Japan",
    branches: 8,
    employees: 210,
    status: "active",
    initials: "SF",
    updated: "5h ago",
  },
  {
    id: 3,
    name: "Alpine Logistics",
    url: "alpine.example.ch",
    email: "contact@alpine.example.ch",
    countryCode: "CH",
    country: "Switzerland",
    branches: 5,
    employees: 96,
    status: "trial",
    initials: "AL",
    updated: "yesterday",
  },
  {
    id: 4,
    name: "Lagos Digital",
    url: "lagosdigital.example.ng",
    email: "team@lagosdigital.example.ng",
    countryCode: "NG",
    country: "Nigeria",
    branches: 3,
    employees: 54,
    status: "active",
    initials: "LD",
    updated: "yesterday",
  },
  {
    id: 5,
    name: "Meridian Media",
    url: "meridian.example.uk",
    email: "press@meridian.example.uk",
    countryCode: "GB",
    country: "United Kingdom",
    branches: 7,
    employees: 178,
    status: "suspended",
    initials: "MM",
    updated: "2 days ago",
  },
  {
    id: 6,
    name: "Pampas Commerce",
    url: "pampas.example.ar",
    email: "ventas@pampas.example.ar",
    countryCode: "AR",
    country: "Argentina",
    branches: 4,
    employees: 71,
    status: "trial",
    initials: "PC",
    updated: "3 days ago",
  },
  {
    id: 7,
    name: "Nordic Wear",
    url: "nordicwear.example.se",
    email: "hej@nordicwear.example.se",
    countryCode: "SE",
    country: "Sweden",
    branches: 6,
    employees: 133,
    status: "active",
    initials: "NW",
    updated: "4 days ago",
  },
  {
    id: 8,
    name: "Coral Bay Resorts",
    url: "coralbay.example.au",
    email: "stay@coralbay.example.au",
    countryCode: "AU",
    country: "Australia",
    branches: 9,
    employees: 264,
    status: "active",
    initials: "CB",
    updated: "5 days ago",
  },
];

export const employees: DemoEmployee[] = [
  {
    id: 1,
    code: "NR-0142",
    firstName: "Ava",
    lastName: "Bennett",
    email: "ava.bennett@northwind.example.com",
    department: "Operations",
    branch: "Seattle HQ",
    organization: "Northwind Retail",
    isActive: true,
  },
  {
    id: 2,
    code: "SF-0098",
    firstName: "Haruto",
    lastName: "Tanaka",
    email: "haruto.tanaka@sakura.example.jp",
    department: "Supply Chain",
    branch: "Osaka",
    organization: "Sakura Foods",
    isActive: true,
  },
  {
    id: 3,
    code: "AL-0031",
    firstName: "Lena",
    lastName: "Fischer",
    email: "lena.fischer@alpine.example.ch",
    department: "Fleet",
    branch: "Zürich",
    organization: "Alpine Logistics",
    isActive: false,
  },
  {
    id: 4,
    code: "LD-0007",
    firstName: "Chidi",
    lastName: "Okafor",
    email: "chidi.okafor@lagosdigital.example.ng",
    department: "Engineering",
    branch: "Lagos",
    organization: "Lagos Digital",
    isActive: true,
  },
  {
    id: 5,
    code: "CB-0210",
    firstName: "Mia",
    lastName: "Nguyen",
    email: "mia.nguyen@coralbay.example.au",
    department: "Guest Services",
    branch: "Cairns",
    organization: "Coral Bay Resorts",
    isActive: true,
  },
  {
    id: 6,
    code: "NW-0064",
    firstName: "Erik",
    lastName: "Lindqvist",
    email: "erik.lindqvist@nordicwear.example.se",
    department: "Retail",
    branch: "Stockholm",
    organization: "Nordic Wear",
    isActive: true,
  },
];

export const markets: DemoMarket[] = [
  { id: 1, name: "Pacific Northwest", organization: "Northwind Retail", radiusMiles: 150 },
  { id: 2, name: "Kansai", organization: "Sakura Foods", radiusMiles: 60 },
  { id: 3, name: "DACH Core", organization: "Alpine Logistics", radiusMiles: null },
  { id: 4, name: "Greater Sydney", organization: "Coral Bay Resorts", radiusMiles: 90 },
];

export const regionBreakdown: RegionBreakdown[] = [
  { region: "Americas", organizations: 3 },
  { region: "EMEA", organizations: 3 },
  { region: "APAC", organizations: 2 },
];

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export const stats = {
  organizations: {
    label: "Organizations",
    value: organizations.length,
    delta: "+2 this month",
    trend: "up" as const,
  },
  employees: {
    label: "Employees",
    value: sum(organizations.map((org) => org.employees)),
    delta: "+128 this month",
    trend: "up" as const,
  },
  activeMarkets: {
    label: "Active markets",
    value: markets.length,
    delta: "+1 this week",
    trend: "up" as const,
  },
  branches: {
    label: "Branches",
    value: sum(organizations.map((org) => org.branches)),
    delta: "No change",
    trend: "flat" as const,
  },
};
