// What is free and what is Pro, in one place.
//
// The docs, the pricing page and the demo all render this, so there is one
// answer to "do I have to pay for X?" rather than three that drift.
//
// The rule behind the data: **everything published is free and stays free.**
// Every version of `@viliha/vui-ui` already on npm is MIT permanently, so
// nothing in the `free` list can ever move. Pro is net-new work that does not
// exist yet, and it is labelled as such rather than dressed up as a product.

export type Plan = "free" | "pro";

export type PlanEntry = {
  /** Grouping shown as the first column. */
  area: "Theme" | "Layout" | "Components" | "Data" | "Tooling" | "Support";
  item: string;
  plan: Plan;
  /** One line of detail. Says "planned" where Pro is not built yet. */
  note: string;
};

export const PLAN_MATRIX: PlanEntry[] = [
  // Theme
  { area: "Theme", item: "Design tokens, dark mode, z-scale", plan: "free", note: "129 CSS variables, MIT, in every framework" },
  { area: "Theme", item: "Runtime theming and per-tenant brand", plan: "free", note: "ThemeConfigProvider plus @viliha/vui-core" },
  { area: "Theme", item: "Motion and icon-chip tokens", plan: "free", note: "Retune or switch off, see /docs/swapping" },

  // Layout
  { area: "Layout", item: "App shell: sidebar, top bar, open tabs", plan: "free", note: "Scaffolded by npx @viliha/vui-ui init" },
  { area: "Layout", item: "All five page types", plan: "free", note: "Data table, record form, dashboard, settings, board" },
  { area: "Layout", item: "Auth, legal and error screens", plan: "free", note: "Sign in, sign up, reset, terms, 404, 500" },
  { area: "Layout", item: "The starter marketing site", plan: "free", note: "65 pages in apps/website, composed entirely from blocks" },
  { area: "Layout", item: "Page kits per vertical", plan: "pro", note: "Planned: SaaS, agency and e-commerce sets, ready to fill in" },
  { area: "Layout", item: "Command palette and global search", plan: "free", note: "⌘K and ⌘⌥K, wired to the nav config" },

  // Components
  { area: "Components", item: "Every React component", plan: "free", note: "Including RecordView, the datatable and record forms" },
  { area: "Components", item: "Vue components", plan: "free", note: "@viliha/vui-vue, growing; see /docs/frameworks" },
  { area: "Components", item: "Charts", plan: "free", note: "Recharts in React, TanStack Charts across frameworks" },
  { area: "Components", item: "Website blocks", plan: "free", note: "60 marketing blocks in @viliha/vui-web: hero, pricing, FAQ, footer" },
  { area: "Components", item: "Datatable and record forms for Vue and Svelte", plan: "pro", note: "Planned. Recharts-style parity with RecordView" },
  { area: "Components", item: "Premium blocks", plan: "pro", note: "Planned: billing, roles and permissions, audit log, inbox" },

  // Data
  { area: "Data", item: "Import and export", plan: "free", note: "CSV, JSON, Excel and print, no dependencies" },
  { area: "Data", item: "Mock API and controller pattern", plan: "free", note: "The three-layer architecture the demo uses" },

  // Tooling
  { area: "Tooling", item: "The init scaffolder", plan: "free", note: "Next.js and Turborepo, fresh or existing" },
  { area: "Tooling", item: "The MCP server", plan: "free", note: "Ten tools, so an agent can query the library and compose a page" },
  { area: "Tooling", item: "End-to-end test suite", plan: "free", note: "Playwright specs for both apps, in apps/e2e" },
  { area: "Tooling", item: "Requirement templates", plan: "free", note: "Ten markdown briefs at /docs/templates" },

  // Support
  { area: "Support", item: "Issues and discussions", plan: "free", note: "Best effort, in the open" },
  { area: "Support", item: "Priority support and a commercial licence", plan: "pro", note: "Planned. An invoice and a named counterparty" },
  { area: "Support", item: "Managed hosting", plan: "pro", note: "Planned. A service, so it is the one thing that cannot be forked" },
];

export const PLAN_LABEL: Record<Plan, string> = { free: "Free", pro: "Pro" };

/** The one-sentence promise, quoted in the docs, the README and the demo. */
export const PLAN_PLEDGE =
  "Everything listed as free is MIT and stays MIT. Every version already published is MIT permanently, so nothing free today can move behind the paywall later.";

export const PLAN_AREAS = [...new Set(PLAN_MATRIX.map((e) => e.area))];

export function planCounts(): Record<Plan, number> {
  return PLAN_MATRIX.reduce(
    (acc, e) => ({ ...acc, [e.plan]: acc[e.plan] + 1 }),
    { free: 0, pro: 0 },
  );
}
