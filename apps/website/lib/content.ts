/**
 * The words on the marketing site, kept out of the pages.
 *
 * A page should read as a list of blocks and the content they take. Putting the
 * copy here means changing a headline never means opening a component, and an
 * agent editing this file changes the site without touching JSX.
 */

export const FEATURES = [
  {
    title: "Datatables that already work",
    body: "Sorting, filtering, pagination, bulk actions and import/export, from one array of field definitions.",
    href: "/features/",
  },
  {
    title: "Forms from the same definitions",
    body: "Add, edit and view screens generate themselves. Validation shows on the field, never as a wall of red text.",
    href: "/features/",
  },
  {
    title: "One theme, every surface",
    body: "Colours, radius, motion and density are tokens. Change the brand once and the whole product follows.",
    href: "/features/",
  },
  {
    title: "Dark mode you did not build",
    body: "Every component ships both modes, driven by the same tokens. There is no second stylesheet to maintain.",
  },
  {
    title: "Accessible by default",
    body: "Keyboard paths, visible focus, real ARIA and contrast that holds up, checked in the components rather than bolted on.",
  },
  {
    title: "Yours to own",
    body: "Scaffolded into your repo, MIT licensed. No runtime service, no lock-in, no per-seat fee for the library.",
  },
];

export const STATS = [
  { value: "4 min", label: "From install to running app", detail: "npx and one import" },
  { value: "120+", label: "Components and blocks" },
  { value: "100%", label: "Tokens, no hard-coded colour" },
  { value: "MIT", label: "Licence, permanently" },
];

export const LOGOS = [
  { name: "Northwind" },
  { name: "Acme Retail" },
  { name: "Globex" },
  { name: "Initech" },
  { name: "Umbrella" },
  { name: "Soylent" },
];

export const TESTIMONIALS = [
  {
    quote:
      "We replaced three months of admin work with an afternoon. The datatable alone would have taken us a sprint to get right.",
    author: "Priya Raman",
    role: "Head of Engineering",
    company: "Northwind",
    rating: 5,
  },
  {
    quote:
      "Our designer stopped filing tickets about spacing. Everything comes out of the same tokens, so it is consistent without anyone policing it.",
    author: "Daniel Osei",
    role: "Product Lead",
    company: "Acme Retail",
    rating: 5,
  },
  {
    quote:
      "Dark mode, right-to-left and keyboard access were all already there. That is three things we did not have to argue about.",
    author: "Mei Lin",
    role: "Staff Engineer",
    company: "Globex",
    rating: 5,
  },
];

export const STEPS = [
  { title: "Install", body: "One command scaffolds the shell, the demo pages and the theme into your repo." },
  { title: "Describe your data", body: "Write the fields once. The table, the filters and the forms come from them." },
  { title: "Make it yours", body: "Change the brand colour and the type scale. Everything repaints." },
  { title: "Ship", body: "Static export to any CDN, or wire it to your API and deploy as you already do." },
];

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceYearly: "$0",
    cadence: "forever",
    description: "Everything published today, MIT licensed.",
    features: [
      "The full component library",
      "Datatable, forms, charts, auth screens",
      "The website blocks and starter pages",
      "CLI scaffolder and MCP server",
      "Community support",
    ],
    cta: { label: "Get started", href: "/contact/" },
  },
  {
    name: "Pro",
    price: "$149",
    priceYearly: "$119",
    cadence: "per developer",
    description: "Premium blocks and the parts we have not given away.",
    features: [
      "Everything in Free",
      "Billing, roles, audit log and inbox blocks",
      "Datatable and forms for Vue and Svelte",
      "Priority on bug reports",
      "Commercial licence and an invoice",
    ],
    cta: { label: "Register interest", href: "/contact/" },
    featured: true,
  },
  {
    name: "Team",
    price: "Talk to us",
    cadence: "",
    description: "Bigger teams, procurement, and work you want built.",
    features: [
      "Everything in Pro",
      "Site licence for the whole team",
      "A named counterparty for legal review",
      "Custom blocks and framework ports",
    ],
    cta: { label: "Contact sales", href: "/contact/" },
  },
];

export const FAQS = [
  {
    question: "Is the free version really free?",
    answer:
      "Yes, and permanently. Everything published is MIT, including the datatable. Every version already released stays MIT, so nothing free today can move behind a paywall later.",
    category: "Pricing",
  },
  {
    question: "Do I need Pro to use this commercially?",
    answer:
      "No. MIT already allows commercial use with no payment and no attribution. Pro buys extra components and our time, not permission.",
    category: "Pricing",
  },
  {
    question: "Which frameworks does it support?",
    answer:
      "The theme is plain CSS and works anywhere. Components exist for React and Vue today, with Svelte planned. Server-rendered apps like Laravel and Rails use the theme with their own templates.",
    category: "Technical",
  },
  {
    question: "Can I change the design?",
    answer:
      "That is the point. Colours, fonts, radius, motion, density and reading direction are all tokens. Swap the icon set or the chart library too; the docs cover each one.",
    category: "Technical",
  },
  {
    question: "Is my data sent anywhere?",
    answer: "No. There is no runtime service. The library renders in your app and talks to your API.",
    category: "Technical",
  },
  {
    question: "How do I get help?",
    answer:
      "GitHub issues and discussions are open to everyone. Pro adds priority on bug reports and a named contact.",
    category: "Support",
  },
];

export const CUSTOMERS = [
  {
    title: "How Northwind cut onboarding from days to minutes",
    summary: "Replacing a bespoke admin panel with a generated one, without changing the backend.",
    company: "Northwind",
    href: "/customers/",
    results: [
      { value: "3×", label: "Faster onboarding" },
      { value: "−40%", label: "Support tickets" },
    ],
  },
  {
    title: "Acme Retail rolled out to 12 markets in a quarter",
    summary: "One theme, twelve brands, and a per-tenant palette that repaints the whole app.",
    company: "Acme Retail",
    href: "/customers/",
    results: [
      { value: "12", label: "Markets live" },
      { value: "1", label: "Codebase" },
    ],
  },
  {
    title: "Globex made accessibility a non-event",
    summary: "Keyboard paths and contrast were already handled, so the audit found nothing to fix.",
    company: "Globex",
    href: "/customers/",
    results: [
      { value: "0", label: "Critical findings" },
      { value: "AA", label: "Contrast, throughout" },
    ],
  },
];

export const MILESTONES = [
  { date: "2024", title: "One internal admin app", body: "Built for our own product, because every option was either heavy or ugly." },
  { date: "2025", title: "Open sourced under MIT", body: "The library, the demo and the docs, given away in full." },
  { date: "2026", title: "Vue, charts and an agent", body: "A second framework, a chart layer that is not React-only, and an MCP server so an agent can build with it." },
  { date: "Next", title: "The website kit", body: "The blocks this page is made of, and hosting to put them somewhere." },
];

export const TEAM = [
  { name: "Suman Bonakurthi", role: "Founder and engineer", bio: "Builds the library, writes the docs, answers the issues." },
  { name: "You", role: "Open to applications", bio: "We are small and hiring slowly. Careers has the details." },
];

export const VALUES = [
  { title: "The least that works", body: "Fewer files, smaller diffs, no abstraction until a second case exists." },
  { title: "Say what is true", body: "Docs state what does not work as plainly as what does. No logo walls we cannot back." },
  { title: "Tokens, not exceptions", body: "One place to change a colour. A hard-coded hex is a bug, not a shortcut." },
  { title: "Accessible is not a phase", body: "Keyboard, contrast and semantics are part of a component, not a later ticket." },
];

export const INTEGRATIONS = [
  { title: "Better Auth", body: "Sign-in, sign-up and sessions, with our screens on top.", meta: "Authentication" },
  { title: "Polar", body: "Checkout and licence keys, hosted, with tax handled.", meta: "Billing" },
  { title: "TanStack Charts", body: "Framework-neutral charting that follows your palette.", meta: "Charts" },
  { title: "Recharts", body: "The React chart layer ChartContainer wraps.", meta: "Charts" },
  { title: "Reka UI", body: "The headless primitives behind the Vue components.", meta: "Vue" },
  { title: "Next.js", body: "App Router, static export, and the scaffolder that wires it up.", meta: "Framework" },
];
