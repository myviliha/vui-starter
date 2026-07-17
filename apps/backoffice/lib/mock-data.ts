/**
 * In-memory mock data for the backoffice entity tables. Foreign keys are
 * flattened to display strings (e.g. `organization` instead of
 * `organization_id`). Swap this for a real data/API layer when you wire up a
 * backend.
 *
 * Organizations and employees live in `./demo-data` and are reused by their
 * tables; everything else is defined here.
 */

// ── Records ────────────────────────────────────────────────────────────────

export interface Branch {
  id: number;
  organization: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  city: string;
  isHeadquarters: boolean;
}

export const branches: Branch[] = [
  { id: 1, organization: "Northwind Retail", name: "Seattle HQ", code: "SEA", email: "sea@northwind.example.com", phone: "+1 206 555 0110", city: "Seattle", isHeadquarters: true },
  { id: 2, organization: "Northwind Retail", name: "Portland", code: "PDX", email: "pdx@northwind.example.com", phone: "+1 503 555 0134", city: "Portland", isHeadquarters: false },
  { id: 3, organization: "Sakura Foods", name: "Osaka", code: "OSA", email: "osaka@sakura.example.jp", phone: "+81 6 6555 0177", city: "Osaka", isHeadquarters: true },
  { id: 4, organization: "Sakura Foods", name: "Tokyo", code: "TYO", email: "tokyo@sakura.example.jp", phone: "+81 3 6555 0188", city: "Tokyo", isHeadquarters: false },
  { id: 5, organization: "Alpine Logistics", name: "Zürich", code: "ZRH", email: "zurich@alpine.example.ch", phone: "+41 44 555 0143", city: "Zürich", isHeadquarters: true },
  { id: 6, organization: "Coral Bay Resorts", name: "Cairns", code: "CNS", email: "cairns@coralbay.example.au", phone: "+61 7 5555 0166", city: "Cairns", isHeadquarters: true },
  { id: 7, organization: "Nordic Wear", name: "Stockholm", code: "STO", email: "sto@nordicwear.example.se", phone: "+46 8 555 0199", city: "Stockholm", isHeadquarters: true },
  { id: 8, organization: "Lagos Digital", name: "Lagos", code: "LOS", email: "lagos@lagosdigital.example.ng", phone: "+234 1 555 0122", city: "Lagos", isHeadquarters: true },
];

export interface Department {
  id: number;
  organization: string;
  title: string;
  code: string;
  employees: number;
}

export const departments: Department[] = [
  { id: 1, organization: "Northwind Retail", title: "Operations", code: "OPS", employees: 84 },
  { id: 2, organization: "Northwind Retail", title: "Merchandising", code: "MER", employees: 41 },
  { id: 3, organization: "Sakura Foods", title: "Supply Chain", code: "SCM", employees: 58 },
  { id: 4, organization: "Alpine Logistics", title: "Fleet", code: "FLT", employees: 33 },
  { id: 5, organization: "Coral Bay Resorts", title: "Guest Services", code: "GST", employees: 96 },
  { id: 6, organization: "Nordic Wear", title: "Retail", code: "RET", employees: 72 },
  { id: 7, organization: "Lagos Digital", title: "Engineering", code: "ENG", employees: 27 },
  { id: 8, organization: "Meridian Media", title: "Editorial", code: "EDT", employees: 45 },
];

export interface Market {
  id: number;
  organization: string;
  name: string;
  centerLatitude: number | null;
  centerLongitude: number | null;
  radiusMiles: number | null;
}

export const markets: Market[] = [
  { id: 1, organization: "Northwind Retail", name: "Pacific Northwest", centerLatitude: 47.6062, centerLongitude: -122.3321, radiusMiles: 150 },
  { id: 2, organization: "Sakura Foods", name: "Kansai", centerLatitude: 34.6937, centerLongitude: 135.5023, radiusMiles: 60 },
  { id: 3, organization: "Alpine Logistics", name: "DACH Core", centerLatitude: null, centerLongitude: null, radiusMiles: null },
  { id: 4, organization: "Coral Bay Resorts", name: "Greater Sydney", centerLatitude: -33.8688, centerLongitude: 151.2093, radiusMiles: 90 },
  { id: 5, organization: "Nordic Wear", name: "Mälardalen", centerLatitude: 59.3293, centerLongitude: 18.0686, radiusMiles: 75 },
  { id: 6, organization: "Lagos Digital", name: "Lagos Metro", centerLatitude: 6.5244, centerLongitude: 3.3792, radiusMiles: 40 },
];

export interface Business {
  id: number;
  title: string;
  code: string;
  description: string;
}

export const businesses: Business[] = [
  { id: 1, title: "Retail", code: "RETAIL", description: "Brick-and-mortar and online consumer sales." },
  { id: 2, title: "Food & Beverage", code: "FNB", description: "Food production, distribution, and hospitality." },
  { id: 3, title: "Logistics", code: "LOGISTICS", description: "Freight, fleet, and last-mile delivery." },
  { id: 4, title: "Media", code: "MEDIA", description: "Publishing, broadcast, and digital content." },
  { id: 5, title: "Hospitality", code: "HOSPITALITY", description: "Hotels, resorts, and travel services." },
  { id: 6, title: "Technology", code: "TECH", description: "Software, platforms, and IT services." },
];

// ── System / reference data ──────────────────────────────────────────────────

export interface Region {
  id: number;
  name: string;
  code: string;
}

export const regions: Region[] = [
  { id: 1, name: "Americas", code: "AMER" },
  { id: 2, name: "Europe, Middle East & Africa", code: "EMEA" },
  { id: 3, name: "Asia-Pacific", code: "APAC" },
];

export interface Country {
  id: number;
  name: string;
  code: string;
  region: string;
}

export const countries: Country[] = [
  { id: 1, name: "United States", code: "US", region: "Americas" },
  { id: 2, name: "Argentina", code: "AR", region: "Americas" },
  { id: 3, name: "United Kingdom", code: "GB", region: "Europe, Middle East & Africa" },
  { id: 4, name: "Switzerland", code: "CH", region: "Europe, Middle East & Africa" },
  { id: 5, name: "Sweden", code: "SE", region: "Europe, Middle East & Africa" },
  { id: 6, name: "Nigeria", code: "NG", region: "Europe, Middle East & Africa" },
  { id: 7, name: "Japan", code: "JP", region: "Asia-Pacific" },
  { id: 8, name: "Australia", code: "AU", region: "Asia-Pacific" },
];

export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
}

export const cities: City[] = [
  { id: 1, name: "Seattle", state: "Washington", country: "United States" },
  { id: 2, name: "Portland", state: "Oregon", country: "United States" },
  { id: 3, name: "Osaka", state: "Osaka", country: "Japan" },
  { id: 4, name: "Tokyo", state: "Tokyo", country: "Japan" },
  { id: 5, name: "Zürich", state: "Zürich", country: "Switzerland" },
  { id: 6, name: "Cairns", state: "Queensland", country: "Australia" },
  { id: 7, name: "Stockholm", state: "Stockholm", country: "Sweden" },
  { id: 8, name: "Lagos", state: "Lagos", country: "Nigeria" },
];

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { id: 1, name: "US Dollar", code: "USD", symbol: "$" },
  { id: 2, name: "Euro", code: "EUR", symbol: "€" },
  { id: 3, name: "British Pound", code: "GBP", symbol: "£" },
  { id: 4, name: "Japanese Yen", code: "JPY", symbol: "¥" },
  { id: 5, name: "Swiss Franc", code: "CHF", symbol: "Fr" },
  { id: 6, name: "Swedish Krona", code: "SEK", symbol: "kr" },
  { id: 7, name: "Australian Dollar", code: "AUD", symbol: "A$" },
  { id: 8, name: "Nigerian Naira", code: "NGN", symbol: "₦" },
];

export interface Language {
  id: number;
  name: string;
  code: string;
}

export const languages: Language[] = [
  { id: 1, name: "English", code: "en" },
  { id: 2, name: "Japanese", code: "ja" },
  { id: 3, name: "German", code: "de" },
  { id: 4, name: "Swedish", code: "sv" },
  { id: 5, name: "Spanish", code: "es" },
  { id: 6, name: "French", code: "fr" },
];
