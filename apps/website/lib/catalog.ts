/**
 * Everything on the site that is a list of things with a page each.
 *
 * Solutions, services, case studies, jobs, guides, events, news: they differ in
 * what they are called and almost nothing else. Each is a title, a summary, a
 * few sections of prose, some facts in a sidebar, and a call to action. So they
 * share one shape, and one pair of page components renders all of them.
 *
 * That is the whole argument for this file. Sixteen bespoke detail templates
 * drift within a month; one shape with sixteen data sets cannot.
 */

export interface EntryFact {
  label: string;
  value: string;
}

export interface EntrySection {
  heading?: string;
  body: string[];
  list?: string[];
  quote?: string;
}

export interface Entry {
  slug: string;
  title: string;
  /** One sentence. Used as the lead, the card body and the meta description. */
  summary: string;
  /** Shown as the eyebrow: a category, a stage, a location. */
  category?: string;
  /** ISO date, for anything with a timeline. */
  date?: string;
  /** Right of the title on a card: "Remote · Full time", "45 min". */
  meta?: string;
  /** Sidebar facts on the detail page. */
  facts?: EntryFact[];
  sections: EntrySection[];
  tags?: string[];
  /** Overrides the closing call to action. */
  cta?: { title: string; lead?: string; label: string; href: string };
}

/* --------------------------------------------------------------------------
 * Solutions: the product framed by the problem someone arrived with.
 * ----------------------------------------------------------------------- */
export const SOLUTIONS: Entry[] = [
  {
    slug: "internal-tools",
    title: "Internal tools",
    summary:
      "Replace the spreadsheet and the half-finished Retool app with something your team can actually own.",
    category: "By use case",
    facts: [
      { label: "Typical build", value: "One week" },
      { label: "Replaces", value: "Retool, spreadsheets" },
      { label: "Licence", value: "MIT" },
    ],
    sections: [
      {
        body: [
          "Every company runs on a handful of screens nobody wanted to build: refund a customer, approve a request, correct a record that imported wrong. They start as a spreadsheet, become a script, and end up as a tool one person understands.",
          "The reason they never get built properly is that a list with sorting, filtering and an audit trail is two weeks of work for a screen five people use. So it stays a spreadsheet.",
        ],
      },
      {
        heading: "What changes",
        body: [
          "A record type is an array of field definitions. From that array you get the list, the filters, the add and edit forms, and the export. The two weeks becomes an afternoon, which is what moves these tools out of the spreadsheet.",
        ],
        list: [
          "Every screen looks like the last one, because they come from the same component",
          "Access rules live in your API, not in the UI",
          "It runs in your repo, so there is no per-seat fee as the team grows",
        ],
      },
      {
        heading: "Where it stops",
        body: [
          "If the screen is a canvas, a map editor or a timeline with drag handles, the field array buys you nothing. Use plain components for those. Pretending otherwise is how a design system starts fighting the people using it.",
        ],
      },
    ],
  },
  {
    slug: "saas-admin",
    title: "SaaS admin panel",
    summary:
      "The back office behind your product: accounts, subscriptions, support tooling and the numbers your team checks each morning.",
    category: "By use case",
    facts: [
      { label: "Multi-tenant", value: "Built in" },
      { label: "Auth screens", value: "Included" },
      { label: "Dark mode", value: "Included" },
    ],
    sections: [
      {
        body: [
          "The admin panel is the part of a SaaS product customers never see and the team lives in. It gets built last, under time pressure, and it shows.",
          "It also has the least forgiving requirements: whoever uses it can see every customer's data, so the organization switcher, the roles and the audit trail are not optional extras.",
        ],
      },
      {
        heading: "What ships with it",
        body: [
          "Tenant switching in the sidebar, backed by your API, with the switch cancellable if the call is refused. A theme per tenant. Auth screens, error screens and a settings page that already knows what it is configuring.",
        ],
        list: [
          "Organization switcher wired to your workspace endpoint",
          "Roles and permissions respected in the UI, enforced in your API",
          "A dashboard with charts, so the morning numbers have somewhere to live",
        ],
      },
    ],
  },
  {
    slug: "customer-portal",
    title: "Customer portal",
    summary:
      "A branded place for your customers to see their data, manage their account and get answers without emailing support.",
    category: "By use case",
    facts: [
      { label: "Theming", value: "Per tenant" },
      { label: "RTL", value: "Supported" },
      { label: "Locales", value: "Your choice" },
    ],
    sections: [
      {
        body: [
          "A portal is an admin app pointed at one customer instead of all of them. The screens are the same shape; what changes is who is allowed to see what, and how much of your brand it has to carry.",
          "Both are already handled: the theme is a runtime value rather than a build-time constant, so a portal can wear the customer's colours without a second deployment.",
        ],
      },
      {
        heading: "The part people forget",
        body: [
          "A portal is a public-facing product, so it inherits public-facing expectations: right-to-left languages, keyboard access, and a page that still works on a five-year-old phone. Retrofitting those costs more than the portal did.",
        ],
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * Services: what a team can buy from us, as opposed to install.
 * ----------------------------------------------------------------------- */
export const SERVICES: Entry[] = [
  {
    slug: "implementation",
    title: "Implementation",
    summary:
      "We wire the library to your API, migrate your first three screens, and leave your team able to do the rest.",
    category: "Services",
    meta: "From 2 weeks",
    facts: [
      { label: "Typical length", value: "2 to 4 weeks" },
      { label: "Output", value: "Working screens, in your repo" },
      { label: "Handover", value: "A recorded walkthrough" },
    ],
    sections: [
      {
        body: [
          "Most teams do not need us for long. The library is scaffolded into your repo and the patterns are documented, so the value we add is the first week: the data layer, the auth wiring, and the three screens everything else gets copied from.",
        ],
      },
      {
        heading: "How it runs",
        body: [
          "One engineer of ours, working in your repo, in the open. We open pull requests you review, so nothing arrives as a drop you have to reverse-engineer later.",
        ],
        list: [
          "Week one: data layer, auth, and the first list screen",
          "Week two: forms, permissions, and the dashboard",
          "Handover: a recorded walkthrough and the pull requests to read back",
        ],
      },
    ],
  },
  {
    slug: "design-system-audit",
    title: "Design system audit",
    summary:
      "A written review of your components, tokens and accessibility, with the fixes ordered by what they cost and what they buy.",
    category: "Services",
    meta: "1 week",
    facts: [
      { label: "Length", value: "One week" },
      { label: "Output", value: "A written report" },
      { label: "Includes", value: "A working demo of the fixes" },
    ],
    sections: [
      {
        body: [
          "An audit that produces a slide deck changes nothing. Ours produces a document with file paths in it, and a branch showing the three fixes that matter most already applied.",
        ],
      },
      {
        heading: "What gets looked at",
        body: [
          "Token coverage, because that is where consistency actually comes from. Component duplication. Keyboard paths and focus order. Contrast in both light and dark mode. Bundle cost per route.",
        ],
      },
    ],
  },
  {
    slug: "custom-development",
    title: "Custom development",
    summary:
      "The screens the library deliberately does not generate: the canvas, the scheduler, the thing only your product has.",
    category: "Services",
    meta: "Scoped per project",
    facts: [
      { label: "Length", value: "Scoped per project" },
      { label: "Licence", value: "Yours" },
      { label: "Rate", value: "On request" },
    ],
    sections: [
      {
        body: [
          "Generated screens cover records. Every product also has the one screen that is the product: a planner, a routing map, a pricing engine with an interface. Those get built by hand, and they should.",
          "We build them against the same tokens, so the bespoke screen does not look like a visitor from another application.",
        ],
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * Feature detail pages, linked from the features overview.
 * ----------------------------------------------------------------------- */
export const FEATURE_PAGES: Entry[] = [
  {
    slug: "datatables",
    title: "Datatables",
    summary:
      "Sorting, filtering, pagination, selection, bulk actions and export, from one array of field definitions.",
    category: "Feature",
    facts: [
      { label: "Rows", value: "Virtualized past 1,000" },
      { label: "Data", value: "Client or server" },
      { label: "Export", value: "CSV, Excel, JSON, PDF" },
    ],
    sections: [
      {
        body: [
          "Ask a team how long the admin panel will take and you will hear two weeks. The estimate is about the first version of the table, not the one that ships.",
          "The one that ships has sorting that survives pagination, filters that compose, a selection model with an answer for what select-all means after a filter, and an export that reflects the query rather than the page on screen.",
        ],
      },
      {
        heading: "Server-backed lists",
        body: [
          "Set a fetcher and the table asks your API for the page it needs, with the sort and filters as query parameters. Out-of-order responses are discarded rather than painted, which is the bug everyone writes once.",
        ],
        list: [
          "Per-field filters, declared on the field rather than built by hand",
          "Bulk actions with a confirmation, and a way back",
          "Export that means the query, not the rows currently rendered",
        ],
      },
    ],
  },
  {
    slug: "forms",
    title: "Record forms",
    summary:
      "Add, edit and view screens from the same field definitions the table uses, so the two can never disagree.",
    category: "Feature",
    facts: [
      { label: "Layouts", value: "Slide-over or full page" },
      { label: "Validation", value: "On the field" },
      { label: "Columns", value: "Declared as rows of sections" },
    ],
    sections: [
      {
        body: [
          "A table and its form are two views of one schema. Write that schema twice and they drift, no matter how careful the team is. So it is written once.",
        ],
      },
      {
        heading: "Validation that does not move the page",
        body: [
          "A failing field gets a red border, and its message moves onto the field's info icon. The form never grows a line of red text that pushes everything below it down while someone is still typing. Screen readers are told either way.",
        ],
      },
    ],
  },
  {
    slug: "theming",
    title: "Theming",
    summary:
      "Colour, radius, density, motion and direction as runtime tokens, with an organization layer and a personal layer on top.",
    category: "Feature",
    facts: [
      { label: "Layers", value: "Package, org, user" },
      { label: "Dark mode", value: "Same tokens" },
      { label: "RTL", value: "Logical properties" },
    ],
    sections: [
      {
        body: [
          "Most token systems stop at colour. You get a palette, a dark mode, and a page of swatches. Then someone asks for a denser layout, or right-to-left, or less animation, and the answer is a fork.",
          "The test of a token system is what happens when the request is not about colour.",
        ],
      },
      {
        heading: "Three layers, resolved in order",
        body: [
          "The package ships a default. An organization overrides the keys it cares about. A person overrides the keys the app hands them. Each layer names only what it changes, so nothing has to be restated.",
        ],
      },
    ],
  },
  {
    slug: "agent-ready",
    title: "Agent ready",
    summary:
      "An MCP server inside the package, so a coding agent asks the installed version what exists instead of guessing.",
    category: "Feature",
    facts: [
      { label: "Transport", value: "stdio" },
      { label: "Tools", value: "Ten" },
      { label: "Index", value: "The file list" },
    ],
    sections: [
      {
        body: [
          "Watch an agent use a component library and you will see it invent an import and guess a prop name. It is not being careless. It has no way to ask, and the documentation it learned from is a year older than the version you installed.",
        ],
      },
      {
        heading: "Ask the package, not the internet",
        body: [
          "The server reads the installed files: components from source, demo pages from the scaffold, guides from a docs snapshot. A new component appears in the answers because the file exists, not because someone remembered to update a manifest.",
        ],
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * Case studies, jobs, integrations: three lists that already had a page.
 * ----------------------------------------------------------------------- */
export const CASE_STUDIES: Entry[] = [
  {
    slug: "northwind",
    title: "Northwind cut three months to one afternoon",
    summary:
      "A logistics team replaced a hand-built admin panel and stopped maintaining two design systems.",
    category: "Logistics",
    meta: "40 people",
    facts: [
      { label: "Industry", value: "Logistics" },
      { label: "Team", value: "40 people" },
      { label: "Result", value: "3 months to 1 afternoon" },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Northwind's operations team ran on twelve screens, each built by a different engineer over four years. Two of them had their own date picker. Nobody wanted to touch the shipment list because the sorting was load-bearing and undocumented.",
        ],
      },
      {
        heading: "What they did",
        body: [
          "They rebuilt the twelve screens as field definitions over two afternoons, kept their existing API untouched, and deleted about four thousand lines of component code.",
        ],
        quote:
          "We replaced three months of admin work with an afternoon. The datatable alone would have taken us a sprint to get right.",
      },
      {
        heading: "What it cost them",
        body: [
          "Two screens did not fit. The route planner is a map with drag handles, and the load calculator is a spreadsheet in all but name. Both stayed hand-built, which was the right call.",
        ],
      },
    ],
  },
  {
    slug: "acme-retail",
    title: "Acme Retail stopped arguing about spacing",
    summary:
      "Design and engineering agreed on tokens, and the weekly consistency tickets went away.",
    category: "Retail",
    meta: "12 people",
    facts: [
      { label: "Industry", value: "Retail" },
      { label: "Team", value: "12 people" },
      { label: "Result", value: "Consistency tickets to near zero" },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Acme's designer filed roughly six tickets a week about padding, border colour and heading size. None of them were wrong. All of them were symptoms of eleven components choosing their own values.",
        ],
      },
      {
        heading: "What changed",
        body: [
          "Everything visual now comes from tokens, so a spacing decision is made once and inherited everywhere. The tickets stopped because the drift stopped, not because anyone started policing pull requests.",
        ],
        quote:
          "Our designer stopped filing tickets about spacing. Everything comes out of the same tokens, so it is consistent without anyone policing it.",
      },
    ],
  },
  {
    slug: "globex",
    title: "Globex shipped right-to-left in a week",
    summary:
      "Arabic support was a requirement three months from launch, and it took one engineer a week.",
    category: "Manufacturing",
    meta: "200 people",
    facts: [
      { label: "Industry", value: "Manufacturing" },
      { label: "Team", value: "200 people" },
      { label: "Result", value: "RTL in one week" },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "A contract required an Arabic interface. Their previous estimate for retrofitting right-to-left into their own component set was a quarter, and it was not a confident quarter.",
        ],
      },
      {
        heading: "Why it was cheap",
        body: [
          "The layout was already written in logical properties, so direction was a document attribute rather than a rewrite. The week went on their own screens, not on the library.",
        ],
        quote:
          "Dark mode, right-to-left and keyboard access were all already there. That is three things we did not have to argue about.",
      },
    ],
  },
];

export const JOBS: Entry[] = [
  {
    slug: "design-engineer",
    title: "Design engineer",
    summary:
      "Own the block library: build it, document it, and keep it honest when a shortcut would be easier.",
    category: "Engineering",
    meta: "Remote · Full time",
    facts: [
      { label: "Location", value: "Remote" },
      { label: "Type", value: "Full time" },
      { label: "Team", value: "Engineering" },
    ],
    sections: [
      {
        body: [
          "You will spend most of your time on components other people build on, which means the bar is different: an awkward prop name is not a small problem when four hundred repos import it.",
        ],
      },
      {
        heading: "What you would do",
        body: ["Build blocks, write the documentation that ships with them, and answer the issues they generate."],
        list: [
          "Design and build components against tokens, never against a colour",
          "Write the docs page and the changelog entry in the same pull request",
          "Say no to props that exist to avoid a conversation",
        ],
      },
      {
        heading: "What we look for",
        body: [
          "Someone who has maintained a component library and knows what it costs. A link to something you built beats a cover letter.",
        ],
      },
    ],
    cta: {
      title: "Apply for this role",
      lead: "Tell us what you have built. We reply either way.",
      label: "Send an introduction",
      href: "/contact/",
    },
  },
  {
    slug: "developer-advocate",
    title: "Developer advocate",
    summary:
      "Write the guides, answer the issues, and tell us plainly what the documentation got wrong.",
    category: "Community",
    meta: "Remote · Part time",
    facts: [
      { label: "Location", value: "Remote" },
      { label: "Type", value: "Part time" },
      { label: "Team", value: "Community" },
    ],
    sections: [
      {
        body: [
          "The library is only as good as the twenty minutes after someone installs it. That period is your job.",
        ],
      },
      {
        heading: "What you would do",
        body: ["Write guides that survive a version bump, and bring back what confused people so it gets fixed."],
        list: [
          "Own the getting-started path and the examples",
          "Answer issues in public, with a fix or a reason",
          "Turn recurring questions into documentation, not FAQ entries",
        ],
      },
    ],
    cta: {
      title: "Apply for this role",
      lead: "Send us something you wrote. That is the whole first round.",
      label: "Send an introduction",
      href: "/contact/",
    },
  },
];

export const INTEGRATION_PAGES: Entry[] = [
  {
    slug: "postgres",
    title: "PostgreSQL",
    summary: "Point the data layer at your database through your own API. No adapter, no ORM opinion.",
    category: "Database",
    facts: [
      { label: "Type", value: "Database" },
      { label: "Direction", value: "Through your API" },
      { label: "Setup", value: "One file" },
    ],
    sections: [
      {
        body: [
          "The library never talks to your database. It talks to functions in your data layer, and those functions talk to whatever you already run.",
          "That means there is nothing to configure here beyond writing the fetch call you would have written anyway, and nothing to rewrite if you move database.",
        ],
      },
    ],
  },
  {
    slug: "stripe",
    title: "Stripe",
    summary: "Subscriptions and invoices in the admin app, read from Stripe through your backend.",
    category: "Payments",
    facts: [
      { label: "Type", value: "Payments" },
      { label: "Keys", value: "Server side only" },
      { label: "Screens", value: "Billing, invoices" },
    ],
    sections: [
      {
        body: [
          "Billing screens are lists and detail views, so they are field definitions like everything else. What matters is where the secret key lives, and the answer is never the browser.",
        ],
      },
      {
        heading: "What to build first",
        body: [
          "A subscriptions list with status filters, and an invoice detail page. Those two answer most support questions, which is what the admin app is for.",
        ],
      },
    ],
  },
  {
    slug: "auth0",
    title: "Auth0",
    summary: "Bring your own identity provider. The auth screens are yours to point wherever you like.",
    category: "Authentication",
    facts: [
      { label: "Type", value: "Authentication" },
      { label: "Screens", value: "Sign in, sign up, reset" },
      { label: "Session", value: "Yours to own" },
    ],
    sections: [
      {
        body: [
          "The sign-in, sign-up, password reset and two-factor screens ship as pages with no opinion about who verifies the credentials. Swap the submit handler and they are pointed at Auth0, Cognito, Clerk or your own service.",
        ],
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * The content library: guides, resources, events, webinars, news, press.
 * ----------------------------------------------------------------------- */
export const GUIDES: Entry[] = [
  {
    slug: "from-figma-to-tokens",
    title: "From Figma to tokens",
    summary:
      "How to turn a design file into a token set that survives contact with a codebase, and what to leave out.",
    category: "Design systems",
    meta: "12 min read",
    facts: [
      { label: "Level", value: "Intermediate" },
      { label: "Length", value: "12 minutes" },
    ],
    sections: [
      {
        body: [
          "The mistake is exporting every value. A design file has hundreds of colours because a designer tried things; a token set with hundreds of colours is a palette with extra steps.",
        ],
      },
      {
        heading: "Start with the roles, not the values",
        body: [
          "Name tokens for what they do rather than what they look like. `--border` survives a rebrand; `--grey-200` becomes a lie the first time the grey changes.",
        ],
        list: [
          "Surfaces: background, card, popover, muted",
          "Text: foreground, muted foreground, and the one accent",
          "Lines: border, input, ring",
        ],
      },
    ],
  },
  {
    slug: "server-backed-tables",
    title: "Server-backed tables without the race conditions",
    summary:
      "Pagination, sorting and filtering against a real API, including the out-of-order response bug everyone writes once.",
    category: "Engineering",
    meta: "9 min read",
    facts: [
      { label: "Level", value: "Intermediate" },
      { label: "Length", value: "9 minutes" },
    ],
    sections: [
      {
        body: [
          "The bug looks like this: you type in the filter, two requests go out, the slower one lands last, and the table shows results for a query nobody asked for.",
        ],
      },
      {
        heading: "The fix is a sequence number",
        body: [
          "Stamp each request, and discard any response whose stamp is not the newest. An AbortController tidies up the network, but the stamp is what protects the render.",
        ],
      },
    ],
  },
  {
    slug: "accessible-forms",
    title: "Forms people can actually use",
    summary:
      "Labels, errors, focus order and the announcements a screen reader needs, with the tradeoffs stated.",
    category: "Accessibility",
    meta: "10 min read",
    facts: [
      { label: "Level", value: "Beginner" },
      { label: "Length", value: "10 minutes" },
    ],
    sections: [
      {
        body: [
          "Most form accessibility is four things done consistently: a real label, an error tied to its field, focus that lands somewhere useful, and a submit state that says what happened.",
        ],
      },
      {
        heading: "About error placement",
        body: [
          "Putting a message under the control shifts every field below it while someone is typing. Putting it on the field's info icon does not, and the announcement is identical. Both are defensible; pick one and apply it everywhere.",
        ],
      },
    ],
  },
];

export const RESOURCES: Entry[] = [
  {
    slug: "admin-app-checklist",
    title: "The admin app checklist",
    summary:
      "The forty things a production admin panel needs, from empty states to audit trails, as a list you can argue with.",
    category: "Checklist",
    meta: "PDF · 6 pages",
    facts: [
      { label: "Format", value: "PDF" },
      { label: "Length", value: "6 pages" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "Written after watching the same four things get forgotten on every project: the empty state, the error state, what happens on a slow connection, and who is allowed to see the export.",
        ],
      },
    ],
    cta: { title: "Get the checklist", label: "Download the PDF", href: "/contact/" },
  },
  {
    slug: "token-starter-kit",
    title: "Token starter kit",
    summary:
      "A minimal token set covering colour, radius, spacing, motion and density, with dark mode already wired.",
    category: "Template",
    meta: "CSS · MIT",
    facts: [
      { label: "Format", value: "CSS" },
      { label: "Licence", value: "MIT" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "The file we start every project from. It is deliberately short: about sixty values, because a starter set with three hundred is a set nobody reads before overriding.",
        ],
      },
    ],
    cta: { title: "Get the starter kit", label: "Download the CSS", href: "/contact/" },
  },
  {
    slug: "component-audit-template",
    title: "Component audit template",
    summary:
      "The spreadsheet we use to find duplicate components, with the scoring that decides which one survives.",
    category: "Template",
    meta: "Spreadsheet",
    facts: [
      { label: "Format", value: "Spreadsheet" },
      { label: "Licence", value: "MIT" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "Three columns do the work: how many places import it, how far it has drifted from the design, and how much of it is genuinely different from its nearest neighbour.",
        ],
      },
    ],
    cta: { title: "Get the template", label: "Download it", href: "/contact/" },
  },
];

export const EVENTS: Entry[] = [
  {
    slug: "design-systems-meetup-singapore",
    title: "Design systems meetup, Singapore",
    summary:
      "An evening on token systems that outlive a rebrand, with three talks and a long argument afterwards.",
    category: "Meetup",
    date: "2026-09-18",
    meta: "Singapore · In person",
    facts: [
      { label: "Date", value: "18 September 2026" },
      { label: "Location", value: "Singapore" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "Three talks, forty-five minutes total, then two hours of the part everyone actually came for. We host it, we do not pitch at it.",
        ],
      },
      {
        heading: "On the night",
        body: ["Doors at seven, talks at half past, out by ten. Food is provided and the venue is step-free."],
      },
    ],
    cta: { title: "Save a place", label: "Register", href: "/contact/" },
  },
  {
    slug: "office-hours-october",
    title: "Open office hours",
    summary:
      "Bring the screen you are stuck on. We work through it live, and anyone watching gets the answer too.",
    category: "Office hours",
    date: "2026-10-02",
    meta: "Online · 60 min",
    facts: [
      { label: "Date", value: "2 October 2026" },
      { label: "Location", value: "Online" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "No agenda and no slides. People bring a real screen, we look at it together, and the recording goes up afterwards unless someone asks us not to.",
        ],
      },
    ],
    cta: { title: "Join the session", label: "Register", href: "/contact/" },
  },
];

export const WEBINARS: Entry[] = [
  {
    slug: "building-an-admin-app-live",
    title: "Building an admin app, start to finish",
    summary:
      "Sixty minutes from an empty repo to a working list, form and dashboard, including the parts that go wrong.",
    category: "Webinar",
    date: "2026-09-04",
    meta: "60 min · Live",
    facts: [
      { label: "Date", value: "4 September 2026" },
      { label: "Length", value: "60 minutes" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "Live, unedited, against a real API. The point of doing it live is that the mistakes stay in, and the mistakes are the useful part.",
        ],
      },
      {
        heading: "What gets covered",
        body: ["Scaffolding, the data layer, a server-backed table, a form, and deploying it as a static export."],
      },
    ],
    cta: { title: "Save your seat", label: "Register", href: "/contact/" },
  },
  {
    slug: "theming-for-multi-tenant-products",
    title: "Theming for multi-tenant products",
    summary:
      "How to let every customer wear their own brand without shipping a build per customer.",
    category: "Webinar",
    date: "2026-10-16",
    meta: "45 min · Live",
    facts: [
      { label: "Date", value: "16 October 2026" },
      { label: "Length", value: "45 minutes" },
      { label: "Price", value: "Free" },
    ],
    sections: [
      {
        body: [
          "The short version: themes have to be runtime values. Everything else follows from that, including how you store them and how you stop one tenant's brand leaking into another's session.",
        ],
      },
    ],
    cta: { title: "Save your seat", label: "Register", href: "/contact/" },
  },
];

export const NEWS: Entry[] = [
  {
    slug: "vue-support-ships",
    title: "Vue support ships",
    summary:
      "The same components, the same class strings, now for Vue. One source of styling, two frameworks.",
    category: "Product",
    date: "2026-08-01",
    facts: [{ label: "Version", value: "2.0" }],
    sections: [
      {
        body: [
          "The React and Vue packages share their class strings from one file, which is the only way two implementations of a design system stay identical past the first month.",
        ],
      },
      {
        heading: "What is in it",
        body: ["Buttons, inputs, dialogs, menus, tabs and the datatable, with the theme file shared unchanged."],
      },
    ],
  },
  {
    slug: "mcp-server-in-the-package",
    title: "The package now answers questions from an agent",
    summary:
      "An MCP server ships inside the library, so a coding agent can ask the installed version what exists.",
    category: "Product",
    date: "2026-07-05",
    sections: [
      {
        body: [
          "Ten tools over stdio, reading the files that are actually installed. No hosted service, no API key, and nothing to keep in sync by hand.",
        ],
      },
    ],
  },
  {
    slug: "seed-funding",
    title: "We raised a small round to keep it free",
    summary:
      "Enough runway to keep the library MIT and maintained, with revenue coming from services and hosting.",
    category: "Company",
    date: "2026-05-20",
    sections: [
      {
        body: [
          "The published pledge has not changed: nothing that is free today becomes paid later. Funding exists so that promise survives contact with a payroll.",
        ],
      },
    ],
  },
];

export const PRESS_KIT = {
  boilerplate:
    "VUI is an open-source component library and admin starter for React and Vue. It ships datatables, record forms, auth screens and a theming system as MIT-licensed source, scaffolded directly into a team's repository rather than served from a hosted runtime.",
  contact: "press@viliha.com",
  assets: [
    { label: "Logo, SVG", href: "/logo.svg", meta: "Vector, light and dark" },
    { label: "Product screenshots", href: "/contact/", meta: "PNG, 2560 wide" },
    { label: "Founder photo", href: "/contact/", meta: "JPG, print resolution" },
  ],
};

export const PARTNERS = [
  {
    name: "Northwind Digital",
    tier: "Implementation",
    body: "Builds and runs admin platforms for logistics operators across South East Asia.",
    href: "/contact/",
  },
  {
    name: "Acme Studio",
    tier: "Design",
    body: "Design partner for teams adopting the token system and wanting their brand mapped onto it.",
    href: "/contact/",
  },
  {
    name: "Globex Consulting",
    tier: "Implementation",
    body: "Enterprise rollouts, migrations from in-house component sets, and accessibility remediation.",
    href: "/contact/",
  },
  {
    name: "Initech Cloud",
    tier: "Hosting",
    body: "Managed hosting for static exports, with preview deployments per pull request.",
    href: "/contact/",
  },
];

export const PORTFOLIO = [
  {
    title: "Fleet operations console",
    body: "Live vehicle list, dispatch queue and an incident timeline, built on server-backed tables.",
    meta: "Logistics",
    href: "/customers/northwind/",
  },
  {
    title: "Merchandising back office",
    body: "Catalogue, pricing rules and a bulk editor for eleven thousand products.",
    meta: "Retail",
    href: "/customers/acme-retail/",
  },
  {
    title: "Plant maintenance portal",
    body: "Work orders and parts, in English and Arabic, on the same layout.",
    meta: "Manufacturing",
    href: "/customers/globex/",
  },
  {
    title: "Subscription admin",
    body: "Accounts, plans and invoices read from Stripe, with support tooling beside them.",
    meta: "SaaS",
    href: "/solutions/saas-admin/",
  },
];

export const LEADERSHIP = [
  {
    name: "Suman Bonakurthi",
    role: "Founder",
    bio: "Builds the library, writes the documentation, answers the issues. Previously fifteen years of back-office platforms nobody enjoyed using.",
  },
];

/** Every collection, so a sitemap or a search index can walk them all. */
export const COLLECTIONS = {
  solutions: { base: "/solutions/", entries: SOLUTIONS },
  services: { base: "/services/", entries: SERVICES },
  features: { base: "/features/", entries: FEATURE_PAGES },
  customers: { base: "/customers/", entries: CASE_STUDIES },
  careers: { base: "/careers/", entries: JOBS },
  integrations: { base: "/integrations/", entries: INTEGRATION_PAGES },
  guides: { base: "/guides/", entries: GUIDES },
  resources: { base: "/resources/", entries: RESOURCES },
  events: { base: "/events/", entries: EVENTS },
  webinars: { base: "/webinars/", entries: WEBINARS },
  news: { base: "/news/", entries: NEWS },
} as const;

export type CollectionName = keyof typeof COLLECTIONS;

export function entryBySlug(collection: CollectionName, slug: string): Entry | undefined {
  return COLLECTIONS[collection].entries.find((e) => e.slug === slug);
}

/** Same category first, then whatever else is there. Never the entry itself. */
export function relatedEntries(collection: CollectionName, slug: string, limit = 3): Entry[] {
  const all = COLLECTIONS[collection].entries;
  const current = all.find((e) => e.slug === slug);
  return all
    .filter((e) => e.slug !== slug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category))
    .slice(0, limit);
}

/** Every detail URL on the site, for the sitemap. */
export function catalogRoutes(): string[] {
  return Object.values(COLLECTIONS).flatMap((c) => c.entries.map((e) => `${c.base}${e.slug}/`));
}
