/** Route → display label + brand color, mirroring the sidebar navigation.
 * Powers the breadcrumb trail and the colored page-title icon. */

export const SEGMENT_LABELS: Record<string, string> = {
  "": "Home",
  charts: "Charts",
  components: "Components",
  forms: "Forms",
  organizations: "Organizations",
  branches: "Branches",
  departments: "Departments",
  employees: "Employees",
  markets: "Markets",
  businesses: "Businesses",
  crm: "CRM",
  companies: "Companies",
  people: "People",
  opportunities: "Opportunities",
  system: "System",
  regions: "Regions",
  countries: "Countries",
  cities: "Cities",
  currencies: "Currencies",
  languages: "Languages",
  settings: "Settings",
};

/** Full pathname → icon color (Tailwind text-* class). */
export const ROUTE_COLORS: Record<string, string> = {
  "/": "text-blue-500",
  "/charts": "text-fuchsia-500",
  "/components": "text-indigo-500",
  "/forms": "text-teal-500",
  "/organizations": "text-blue-500",
  "/branches": "text-violet-500",
  "/departments": "text-amber-500",
  "/employees": "text-cyan-500",
  "/markets": "text-rose-500",
  "/businesses": "text-emerald-500",
  "/crm/companies": "text-blue-500",
  "/crm/people": "text-sky-500",
  "/crm/opportunities": "text-orange-500",
  "/system/regions": "text-teal-500",
  "/system/countries": "text-red-500",
  "/system/cities": "text-amber-500",
  "/system/currencies": "text-green-500",
  "/system/languages": "text-purple-500",
  "/settings": "text-slate-500",
};

/** Full pathname → raw accent color (drives the --page-accent CSS variable so
 * shared components like tables can tint their icons per module). */
export const ROUTE_ACCENT: Record<string, string> = {
  "/": "#3b82f6",
  "/charts": "#d946ef",
  "/components": "#6366f1",
  "/forms": "#14b8a6",
  "/organizations": "#3b82f6",
  "/branches": "#8b5cf6",
  "/departments": "#f59e0b",
  "/employees": "#06b6d4",
  "/markets": "#f43f5e",
  "/businesses": "#10b981",
  "/crm/companies": "#3b82f6",
  "/crm/people": "#0ea5e9",
  "/crm/opportunities": "#f97316",
  "/system/regions": "#14b8a6",
  "/system/countries": "#ef4444",
  "/system/cities": "#f59e0b",
  "/system/currencies": "#22c55e",
  "/system/languages": "#a855f7",
  "/settings": "#64748b",
};

// Group-parent → first-child map is derived automatically from the nav config
// (see nav-config.ts), so breadcrumbs never need per-section wiring here.
export { SECTION_INDEX } from "./nav-config";
import { SECTION_INDEX } from "./nav-config";

export function accentFor(pathname: string): string {
  return ROUTE_ACCENT[pathname] ?? "";
}

export function labelFor(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function colorFor(pathname: string): string {
  return ROUTE_COLORS[pathname] ?? "text-muted-foreground";
}

export type Crumb = { label: string; href: string; isLast: boolean };

/** Build a breadcrumb trail (always rooted at Home) from a pathname. */
export function crumbsFor(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Home", href: "/", isLast: parts.length === 0 }];
  let acc = "";
  parts.forEach((seg, i) => {
    acc += `/${seg}`;
    // Group parents (no index page) redirect to their first child.
    const href = SECTION_INDEX[acc] ?? acc;
    crumbs.push({ label: labelFor(seg), href, isLast: i === parts.length - 1 });
  });
  return crumbs;
}
