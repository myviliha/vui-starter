/**
 * Every route both apps serve, in one place.
 *
 * The suite walks these lists rather than naming pages inside individual tests,
 * so adding a page to the site adds it to the smoke, SEO and accessibility
 * passes at the same time. A page that exists but is not listed here is the one
 * failure mode this file cannot catch, which is why `sitemap.spec.ts` compares
 * the list against the published sitemap.
 */

/** Marketing site: listing and standalone pages. */
export const WEBSITE_PAGES = [
  "/",
  "/features/",
  "/solutions/",
  "/services/",
  "/integrations/",
  "/pricing/",
  "/compare/",
  "/trial/",
  "/demo/",
  "/about/",
  "/company/",
  "/team/",
  "/customers/",
  "/testimonials/",
  "/partners/",
  "/portfolio/",
  "/careers/",
  "/contact/",
  "/faq/",
  "/changelog/",
  "/blog/",
  "/guides/",
  "/resources/",
  "/events/",
  "/webinars/",
  "/news/",
  "/press/",
  "/terms/",
  "/privacy/",
] as const;

/** Marketing site: detail pages, one per collection entry. */
export const WEBSITE_DETAIL_PAGES = [
  "/features/datatables/",
  "/features/forms/",
  "/features/theming/",
  "/features/agent-ready/",
  "/solutions/internal-tools/",
  "/solutions/saas-admin/",
  "/solutions/customer-portal/",
  "/services/implementation/",
  "/services/design-system-audit/",
  "/services/custom-development/",
  "/customers/northwind/",
  "/customers/acme-retail/",
  "/customers/globex/",
  "/careers/design-engineer/",
  "/careers/developer-advocate/",
  "/integrations/postgres/",
  "/integrations/stripe/",
  "/integrations/auth0/",
  "/guides/from-figma-to-tokens/",
  "/guides/server-backed-tables/",
  "/guides/accessible-forms/",
  "/resources/admin-app-checklist/",
  "/resources/token-starter-kit/",
  "/resources/component-audit-template/",
  "/events/design-systems-meetup-singapore/",
  "/events/office-hours-october/",
  "/webinars/building-an-admin-app-live/",
  "/webinars/theming-for-multi-tenant-products/",
  "/news/vue-support-ships/",
  "/news/mcp-server-in-the-package/",
  "/news/seed-funding/",
] as const;

export const BLOG_POSTS = [
  "/blog/why-your-datatable-is-the-whole-product/",
  "/blog/tokens-are-not-a-colour-palette/",
  "/blog/shipping-a-component-library-an-agent-can-read/",
] as const;

export const ALL_WEBSITE_PAGES = [
  ...WEBSITE_PAGES,
  ...WEBSITE_DETAIL_PAGES,
  ...BLOG_POSTS,
] as const;

/** Admin app: the pages behind the app shell, in sidebar order. */
export const BACKOFFICE_PAGES = [
  "/dashboard/",
  "/organizations/",
  "/organizations/new/",
  "/organizations/edit/",
  "/organization/profile/",
  "/branches/",
  "/departments/",
  "/employees/",
  "/users/",
  "/businesses/",
  "/markets/",
  "/crm/companies/",
  "/crm/people/",
  "/crm/opportunities/",
  "/system/countries/",
  "/system/regions/",
  "/system/cities/",
  "/system/currencies/",
  "/system/languages/",
  "/calendar/",
  "/chat/",
  "/charts/",
  "/notifications/",
  "/settings/",
  "/support/",
  "/onboarding/",
  "/steps/",
  "/forms/",
  "/components/",
  "/data-table/",
] as const;

/** Admin app: screens on the brand shell rather than the app one. */
export const AUTH_PAGES = [
  "/auth/",
  "/auth/signin/",
  "/auth/signin-split/",
  "/auth/signup/",
  "/auth/signup-split/",
  "/auth/forgot-password/",
  "/auth/reset-password/",
  "/auth/verify/",
  "/register-business/",
] as const;

export const ERROR_PAGES = [
  "/errors/unauthorized/",
  "/errors/forbidden/",
  "/errors/not-found/",
  "/errors/server-error/",
  "/errors/maintenance/",
] as const;

/** The public pages the admin app also serves. */
export const PUBLIC_PAGES = ["/", "/pricing/", "/demo/", "/terms/", "/privacy/"] as const;

/** Docs site: the guides, not the fifty per-component reference pages. */
export const DOCS_PAGES = [
  "/docs/",
  "/docs/installation/",
  "/docs/configuration/",
  "/docs/theming/",
  "/docs/layout/",
  "/docs/form-layout/",
  "/docs/data-table/",
  "/docs/navigation/",
  "/docs/blocks/",
  "/docs/charts/",
  "/docs/auth/",
  "/docs/steps/",
  "/docs/frameworks/",
  "/docs/free-and-pro/",
  "/docs/ai-agents/",
  "/docs/shadcn-ui/",
  "/docs/swapping/",
  "/docs/templates/",
  "/docs/typeset/",
  "/docs/changelog/",
  "/docs/components/",
  "/docs/components/tabs/",
  "/docs/components/form/",
  "/docs/components/command/",
] as const;
