import type { Metadata } from "next";

/** Single source of truth for site-wide SEO. Deployed as a static export to a
 * custom domain (see ../CNAME), so URLs are absolute against SITE.url. */
export const SITE = {
  name: "Vui Starter",
  tagline: "React Admin & CRM Design System",
  url: "https://vui.viliha.com",
  description:
    "Vui Starter is a free, open-source React admin & CRM design system — a token-driven component library (@viliha/vui-ui) plus a full backoffice demo.",
  ogImage: "/brand/pulse-wordmark.png",
  author: "Suman Bonakurthi",
  // Footer identity — overridable per deployment via env (see .env.example).
  // NEXT_PUBLIC_ so the value is inlined into the client bundle at build time.
  company: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "VILIHA PTE. LTD.",
  copyrightYear: process.env.NEXT_PUBLIC_COPYRIGHT_YEAR ?? "2026",
  license: process.env.NEXT_PUBLIC_LICENSE ?? "MIT Licensed",
} as const;

/** Footer copyright line. Set NEXT_PUBLIC_FOOTER_NOTICE to override the whole
 * string, or just the individual company/year/license vars above. */
export const FOOTER_NOTICE =
  process.env.NEXT_PUBLIC_FOOTER_NOTICE ??
  `© ${SITE.copyrightYear} ${SITE.company} · ${SITE.license}`;

/** Per-route title + description for the backoffice demo pages. Keeping it in
 * one table means a page file only names its route, not its copy. */
const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description:
      "Admin dashboard demo with KPI stat cards, activity tables and charts, built on the Vui Starter React design system.",
  },
  "/charts": {
    title: "Charts",
    description:
      "Chart component showcase — line, bar, area and pie charts styled with Vui Starter design tokens.",
  },
  "/components": {
    title: "Components",
    description:
      "Live component gallery for @viliha/vui-ui — buttons, forms, tables, dialogs, menus and more.",
  },
  "/forms": {
    title: "Forms",
    description:
      "Form patterns demo — inputs, selects, validation and multi-step forms built with React Hook Form and vui-ui.",
  },
  "/settings": {
    title: "Settings",
    description:
      "Settings screen demo — profile, appearance and preferences in the Vui Starter admin template.",
  },
  "/organizations": {
    title: "Organizations",
    description:
      "Organizations data-table demo with sorting, filtering and pagination, from the Vui Starter admin.",
  },
  "/branches": {
    title: "Branches",
    description:
      "Branches management screen — an example data table in the Vui Starter React admin template.",
  },
  "/departments": {
    title: "Departments",
    description:
      "Departments management screen — an example data table in the Vui Starter React admin template.",
  },
  "/employees": {
    title: "Employees",
    description:
      "Employees directory demo — a sortable, filterable data table from the Vui Starter admin template.",
  },
  "/markets": {
    title: "Markets",
    description:
      "Markets management screen — an example data table in the Vui Starter React admin template.",
  },
  "/businesses": {
    title: "Businesses",
    description:
      "Businesses management screen — an example data table in the Vui Starter React admin template.",
  },
  "/users": {
    title: "Users",
    description:
      "User management demo — roles, status and access control in the Vui Starter admin template.",
  },
  "/crm/companies": {
    title: "Companies",
    description:
      "CRM companies demo — manage accounts in the Vui Starter React admin & CRM design system.",
  },
  "/crm/people": {
    title: "People",
    description:
      "CRM contacts demo — manage people and leads in the Vui Starter React admin & CRM design system.",
  },
  "/crm/opportunities": {
    title: "Opportunities",
    description:
      "CRM pipeline demo — a kanban opportunities board in the Vui Starter admin & CRM design system.",
  },
  "/system/regions": {
    title: "Regions",
    description:
      "System regions reference data — an example data table in the Vui Starter admin.",
  },
  "/system/countries": {
    title: "Countries",
    description:
      "System countries reference data — an example data table in the Vui Starter admin.",
  },
  "/system/cities": {
    title: "Cities",
    description:
      "System cities reference data — an example data table in the Vui Starter admin.",
  },
  "/system/currencies": {
    title: "Currencies",
    description:
      "System currencies reference data — an example data table in the Vui Starter admin.",
  },
  "/system/languages": {
    title: "Languages",
    description:
      "System languages reference data — an example data table in the Vui Starter admin.",
  },
};

/** All public routes, for the sitemap. */
export const PUBLIC_ROUTES: string[] = [
  "/",
  ...Object.keys(ROUTE_META),
  "/docs",
  "/docs/installation",
  "/docs/configuration",
  "/docs/theming",
  "/docs/layout",
  "/docs/components",
  "/docs/data-table",
  "/docs/steps",
  "/docs/charts",
  "/docs/auth",
  "/docs/shadcn-ui",
  "/docs/ai-agents",
  "/docs/templates",
  "/docs/contributing",
];

/** Self-referencing canonical for a route. The app is exported with
 * `trailingSlash: true`, so pages are served at `/foo/` — the canonical must
 * match that exactly, otherwise it points at a URL the host 301s away from. */
export function canonicalFor(path: string): string {
  return path === "/" ? "/" : `${path}/`;
}

/** Page metadata for a backoffice route. Sets a per-page title, description
 * and self-canonical (Open Graph / Twitter inherit the rest from root). */
export function pageMeta(path: string): Metadata {
  const m = ROUTE_META[path];
  if (!m) return {};
  const { title, description } = m;
  return {
    title,
    description,
    alternates: { canonical: canonicalFor(path) },
    openGraph: { title, description, url: canonicalFor(path) },
    twitter: { title, description },
  };
}
