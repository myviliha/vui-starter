import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/layout/" },
  title: "Layout & patterns",
  description:
    "The standard page template and the five page types (data table, record form, dashboard, settings, kanban board), plus breadcrumbs, the ⌘K command palette (Quick actions & Global search), section cards, bordered lists and dialogs — the conventions every new page in Vui Starter follows.",
};

export default function LayoutPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Layout & patterns"
        lead="These are the structural conventions of the theme. Follow them for every new page, section, dialog and list component and the app stays consistent by default — no bespoke layout per screen."
      />

      <H2>Page template</H2>
      <P>
        Every page is a full-height flex column: the title is pushed to the
        global top bar, an <strong>action header</strong> holds the breadcrumbs
        (and any page actions), and the content scrolls below it with{" "}
        <code>p-4</code> padding. Only the content scrolls — the header and the
        app footer stay put.
      </P>
      <CodeBlock title="app/(app)/my-page/page.tsx">{`"use client";

import { RocketIcon } from "@radix-ui/react-icons";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

export default function MyPage() {
  return (
    <div className="flex h-full flex-col">
      {/* 1 — surfaces the title + icon in the global top bar */}
      <SetPageTitle title="My page" icon={RocketIcon} />

      {/* 2 — action header: breadcrumbs (left) + optional actions (right) */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <Breadcrumbs />
        {/* <Button variant="primary">…</Button> */}
      </div>

      {/* 3 — the only scrolling region; p-4 + gap-4 between sections */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {/* sections go here */}
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
      <Note title="Consistent padding">
        The content wrapper is always <code>p-4</code> with <code>gap-4</code>{" "}
        between sections. Home, Settings, Charts, Forms, and the datatable pages
        all use this exact frame — new pages should too.
      </Note>

      <H2>Page types</H2>
      <P>
        Every page shares the frame above; only the content region changes. The
        theme has <strong>four page types</strong> — when you add a page, decide
        which one the requirement calls for, then fill in its content. Don&apos;t
        invent a fifth shape.
      </P>

      <PageTypeGallery />

      <H3>1 · Data table page</H3>
      <P>
        For any list of records — <strong>Organizations, Branches, Departments,
        Employees, Markets</strong>, and the System / CRM lists. The route is a
        thin server <code>page.tsx</code> that renders a client{" "}
        <code>*-table.tsx</code>, which is a single <code>RecordView</code> fed a{" "}
        <code>fields</code> array. RecordView supplies its own action header,
        breadcrumbs, padded card, sorting, filtering, pagination, row actions,
        the add/edit form and import/export — you configure, you don&apos;t lay
        out. Every data table page uses this one layout; only the{" "}
        <code>fields</code> config differs.
      </P>
      <CodeBlock title="app/(app)/departments/ — server page + client table">{`// page.tsx — server component: metadata + the table, nothing else
export const metadata = pageMeta("/departments");
export default function DepartmentsPage() {
  return <main className="h-full"><DepartmentsTable /></main>;
}

// departments-table.tsx — "use client"
<RecordView
  title="Departments" singular="Department" icon={LayoutGrid}
  fields={fields}                       // the whole design comes from here
  initialData={departments}
  getPrimary={(row) => ({ title: row.name, initials: "…" })}
  makeEmptyRow={() => ({ /* blank row */ })}
/>`}</CodeBlock>
      <P>
        See the{" "}
        <a
          href="/docs/data-table"
          className="font-medium text-foreground underline"
        >
          Data table
        </a>{" "}
        page for the full <code>fields</code> reference.
      </P>
      <Shot
        src="/page-types/data-table.png"
        alt="Data table page — the Organizations list (RecordView)"
      />

      <H3>2 · Record form — Add / Edit / View</H3>
      <P>
        The Add, Edit and View screens for a record are <strong>one form</strong>
        , rendered by <code>RecordView</code>/<code>RecordForm</code> from the
        same <code>fields</code> array — View is the read-only state, Edit the
        editable one, Add the same on a blank row. You never build three separate
        forms. It renders in one of two variants, and this is exactly the
        difference between Branches and Organizations:
      </P>
      <Ul>
        <li>
          <strong>Slide-over overlay (default)</strong> — Branches, Departments.
          Render <code>&lt;RecordView&gt;</code> with no <code>formMode</code>;
          Add/Edit/View open a right-hand panel over the table. Uncontrolled
          (pass <code>initialData</code>). Best for short forms and quick edits.
        </li>
        <li>
          <strong>Full-page routes</strong> — Organizations. Set{" "}
          <code>formMode=&quot;page&quot;</code> and route the actions to
          dedicated URLs (<code>/new</code>, <code>/edit</code>); the form takes
          over the whole page with a breadcrumb bar, an optional
          documentation panel, and a fixed Save/Cancel footer. Controlled — the
          table and the routes share one data source and one{" "}
          <code>*-config.tsx</code>. Best for long forms or when the form needs
          its own URL.
        </li>
      </Ul>
      <CodeBlock title="slide-over (Branches) vs. full-page routes (Organizations)">{`// Branches — overlay, uncontrolled. That's the whole difference.
<RecordView title="Branches" fields={fields} initialData={branches} … />

// Organizations — full-page routes, controlled via a shared store.
<RecordView
  formMode="page" formColumns={1}
  fields={fields} data={rows} onDataChange={orgStore.set}
  onCreate={() => router.push("/organizations/new")}
  onView={(id) => router.push(\`/organizations/edit?id=\${id}\`)}
  onEdit={(id) => router.push(\`/organizations/edit?id=\${id}\`)}
  … />

// /organizations/new/page.tsx renders the exported RecordForm directly,
// using the same fields from organizations-config.tsx.
<RecordForm isNew fields={fields} row={draft} onSave={…} onCancel={…} />`}</CodeBlock>
      <Shot
        src="/page-types/form-full-page.png"
        alt="Full-page record form — Create organization, with the documentation panel and Save/Cancel footer"
      />
      <P>
        <strong>The Info panel beside the form is dynamic</strong> — nothing
        there is hardcoded. It is built from the same config as the form:{" "}
        <code>formDescription</code> fills the &quot;About&quot; intro, and every
        field that has a <code>description</code> adds a labelled help entry.
        Provide them in your requirement and the panel writes itself; omit them
        and the panel disappears, leaving a full-width form. (It shows on{" "}
        <code>lg</code> screens and up.)
      </P>
      <CodeBlock title="the Info panel is just more config">{`<RecordForm
  formMode="page"
  formDescription="Organizations are the top-level tenants…"   // → the "About" intro
  fields={[
    { key: "name", label: "Name", required: true,
      description: "The legal or trading name, shown across the app." }, // → a help entry
    { key: "code", label: "Code" },   // no description → not shown in the panel
  ]}
/>`}</CodeBlock>
      <P>
        The slide-over variant renders the same fields in a right-hand panel over
        the table (see the &quot;Form — slide-over&quot; thumbnail above); it has
        no Info panel — use full-page mode when you want the help column.
      </P>

      <H3>3 · Dashboard page</H3>
      <P>
        An overview screen (the Home page at <code>/dashboard</code>): a row of{" "}
        <code>StatCard</code>s, then a grid of bordered-card sections (tables,
        progress bars, lists). It uses the standard scrolling content region —
        stat grid first, then a responsive <code>grid</code> of sections.
      </P>
      <CodeBlock title="dashboard content region">{`<div className="min-h-0 flex-1 overflow-y-auto">
  <div className="flex flex-col gap-4 p-4">
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* <StatCard /> × 4 */}
    </section>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* bordered-card sections — a wide table + a side column */}
    </div>
  </div>
</div>`}</CodeBlock>

      <Shot
        src="/page-types/dashboard.png"
        alt="Dashboard page — the Home overview with stat cards and content sections"
      />

      <H3>4 · Settings (single-form) page</H3>
      <P>
        One long form on its own page — Settings. Instead of a scrolling column
        of sections, the content is a <strong>single bordered card</strong>:
        scrollable <code>Section</code> cards inside, and a{" "}
        <strong>fixed footer action bar</strong> (Save) pinned to the bottom —
        the same footer the full-page record form uses. Reach for this whenever a
        page is &quot;a form with a Save button,&quot; not a list.
      </P>
      <CodeBlock title="settings content region">{`<div className="min-h-0 flex-1 overflow-hidden p-4">
  <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
    <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
      {/* <Section title="Profile"> … </Section> cards */}
    </div>
    {/* fixed footer — matches the record form's action bar */}
    <div className="flex shrink-0 items-center justify-end gap-2 border-y border-border bg-muted/40 px-4 py-3">
      <Button variant="primary">Save changes</Button>
    </div>
  </div>
</div>`}</CodeBlock>

      <Shot
        src="/page-types/settings.png"
        alt="Settings page — a single card of Section blocks with a fixed Save footer"
      />

      <H3>5 · Board (Kanban) page</H3>
      <P>
        A horizontally-scrolling column board — the Opportunities pipeline. The
        content region scrolls on the <em>x</em> axis and holds fixed-width
        (<code>w-72</code>) columns; each column is a dashed, droppable card list
        with drag-and-drop between stages. Use it for stage/status pipelines, not
        for flat lists (those are data tables).
      </P>
      <CodeBlock title="board content region">{`<div className="min-h-0 flex-1 overflow-x-auto p-4">
  <div className="flex h-full gap-4">
    {stages.map((stage) => (
      <section key={stage} className="flex h-full w-72 shrink-0 flex-col gap-3">
        {/* column header + count */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg border border-dashed border-border bg-muted/30 p-2">
          {/* draggable cards */}
        </div>
      </section>
    ))}
  </div>
</div>`}</CodeBlock>

      <Shot
        src="/page-types/board.png"
        alt="Board page — the Opportunities pipeline with drag-and-drop stage columns"
      />

      <Note title="Client pages need a layout.tsx for metadata">
        The Dashboard, Settings and Board pages are Client Components
        (<code>&quot;use client&quot;</code>), so they can&apos;t{" "}
        <code>export const metadata</code>. Put a tiny sibling{" "}
        <code>layout.tsx</code> that exports{" "}
        <code>metadata = pageMeta(&quot;/route&quot;)</code> and returns its
        children — Dashboard and Settings both do this. Data table pages keep
        their server <code>page.tsx</code>, so they export metadata directly.
      </Note>

      <H2>Sections</H2>
      <P>
        A section is a bordered, rounded card: a muted header bar with a bottom
        border, then the content. Stack them in the <code>gap-4</code> column and
        they space themselves.
      </P>
      <CodeBlock title="section.tsx">{`<section className="overflow-hidden rounded-lg border border-border bg-card">
  <div className="border-b border-border bg-muted/40 px-4 py-2.5">
    <h2 className="font-medium">Section title</h2>
  </div>
  <div className="p-4">
    {/* content */}
  </div>
</section>`}</CodeBlock>

      <H2>Breadcrumbs</H2>
      <P>
        Drop <code>&lt;Breadcrumbs /&gt;</code> into the action header — that is
        its defined position. It renders the back button and the trail from the
        current route automatically; you don&apos;t build the trail by hand.
      </P>
      <Ul>
        <li>
          The trail is derived from the pathname and the nav config
          (<code>nav-config.ts</code>), so labels stay in sync with the sidebar.
          It is always rooted at <strong>Home</strong> — the single landing page
          at <code>/dashboard</code>; the last crumb is the current page
          (non-interactive).
        </li>
        <li>
          <strong>Group parents resolve automatically.</strong> A section that
          has no index page (e.g. <code>/crm</code>) links to its first child
          (<code>/crm/companies</code>) instead of 404-ing — derived from the
          nav config, no per-page wiring.
        </li>
      </Ul>
      <Note title="Datatable pages">
        The <code>RecordView</code> renders its own action header and accepts the
        breadcrumbs via context, so a datatable page is just{" "}
        <code>&lt;RecordView … /&gt;</code> — the header, breadcrumbs and padded
        card come for free.
      </Note>

      <H2>Command palette — Quick actions &amp; Global search</H2>
      <P>
        Two ⌘K-style palettes ship in the shell, both built on the same headless{" "}
        <code>CommandPalette</code> from <code>@viliha/vui-ui</code>. They differ
        only in <em>what</em> they search:
      </P>
      <Ul>
        <li>
          <strong>Quick actions</strong> (<code>⌘K</code>, or <code>/</code> when
          not typing) — jumps between <strong>pages</strong>. Launched from the
          sidebar button; its actions are derived from <code>nav-config.ts</code>
          , so a new page shows up automatically.
        </li>
        <li>
          <strong>Global search</strong> (<code>⌘⌥K</code>) — searches{" "}
          <strong>records</strong> (organizations, people, opportunities,
          reference data…). Launched from the top-bar search box; each result
          navigates to where the record lives.
        </li>
      </Ul>
      <Shot
        src="/page-types/quick-actions.png"
        alt="Quick actions (⌘K) — jump to any page, grouped like the sidebar"
      />
      <Shot
        src="/page-types/global-search.png"
        alt="Global search (⌘⌥K) — find records across the app, grouped by type"
      />

      <H3>How to implement one</H3>
      <P>
        <code>CommandPalette</code> is headless and router-agnostic: you own the
        open state and pass an <code>actions</code> array; each action carries
        its own <code>onSelect</code>. A small provider holds the open state,
        wires the global shortcut, and mounts the palette once — copy{" "}
        <code>app/_components/quick-actions.tsx</code> (pages) or{" "}
        <code>global-search.tsx</code> (records) as your starting point.
      </P>
      <CodeBlock title="a command-palette provider (the whole pattern)">{`"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CommandPalette, type CommandAction } from "@viliha/vui-ui/command-palette";

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Global shortcut — ⌘K here; use e.altKey to tell ⌘K from ⌘⌥K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.code === "KeyK") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Build actions from anything — NAV pages, or records from your API.
  const actions: CommandAction[] = useMemo(
    () => [
      { id: "orgs", label: "Organizations", group: "Go to",
        onSelect: () => router.push("/organizations") },
      // …one entry per page (Quick actions) or per record (Global search)
    ],
    [router],
  );

  return (
    <>
      {children}
      <CommandPalette open={open} onClose={() => setOpen(false)} actions={actions} />
    </>
  );
}`}</CodeBlock>
      <P>
        Each <code>CommandAction</code> is{" "}
        <code>{`{ id, label, group?, icon?, keywords?, onSelect }`}</code> —{" "}
        <code>group</code> renders a heading, <code>keywords</code> widen the
        match, <code>onSelect</code> does the work. Global search&apos;s record
        index is the demo&apos;s stand-in for a backend: swap it for your API
        results and everything else stays the same.
      </P>
      <Note title="Two shortcuts, no clash">
        <code>⌘K</code> opens Quick actions, <code>⌘⌥K</code> opens Global
        search, and <code>/</code> opens Quick actions when you aren&apos;t
        typing in a field. Each is registered by its own provider, distinguished
        by <code>e.altKey</code>.
      </Note>

      <H2>Open tabs</H2>
      <P>
        The shell keeps a <strong>browser-style strip of the pages you&apos;ve
        opened</strong> under the top bar (labelled <em>Tabs</em>), so several
        pages stay one click apart. Navigating opens (or focuses) a tab;{" "}
        <code>⌘</code>/<code>Ctrl</code>-clicking a sidebar item opens it in a{" "}
        <strong>background tab</strong> without leaving the current page; the{" "}
        <code>✕</code> closes one. Tabs can be <strong>dragged to reorder</strong>{" "}
        (each shows a grip handle; the shift animates via FLIP) and{" "}
        <strong>right-clicked to tag with one of seven color labels</strong>. The
        open list, order and colors persist across reloads via{" "}
        <code>sessionStorage</code>, capped by{" "}
        <code>NEXT_PUBLIC_MAX_TABS</code> (default 5 — opening more evicts the
        oldest with a warning).
      </P>
      <Shot
        src="/page-types/open-tabs.png"
        alt="Open tabs — a labelled strip under the top bar with the active tab in the primary color"
      />
      <P>
        It&apos;s <code>OpenTabsProvider</code> + <code>&lt;TabStrip /&gt;</code>{" "}
        +{" "}
        <code>&lt;KeepAliveTabs /&gt;</code> mounted once in{" "}
        <code>(app)/layout.tsx</code>. It is{" "}
        <strong>keep-alive</strong>: every open page stays mounted (inactive ones
        hidden), so switching tabs is <strong>instant — no remount, no flash</strong>
        , and each page keeps its live state (scroll, inputs, in-progress work).
        New menu items mount on first visit. Tab labels/icons/colors derive from
        the same <code>nav-config.ts</code> / <code>route-meta.ts</code> source as
        the sidebar, so a new page is tab-able with no extra wiring. For a custom
        &quot;open in new tab&quot; button, call{" "}
        <code>{`useOpenTabs().openTab(href, { background: true })`}</code>.
      </P>
      <Note title="Why keep-alive here">
        The app is a <strong>static export</strong> (all client at runtime), so
        keeping pages mounted costs no server work and loses no SSR — it just
        makes tab switching feel native. The <code>MAX_TABS</code> cap bounds how
        many stay mounted.
      </Note>

      <H2>Multi-step wizard</H2>
      <P>
        For a guided flow (registration, onboarding, checkout), pair the exported{" "}
        <code>Steps</code> indicator with your own step state. <code>Steps</code>{" "}
        is controlled and presentational — pass the steps and the current index;
        completed steps fill with the primary color and a check, the current one
        is ringed, upcoming ones are muted. Build each step&apos;s body from the
        usual primitives (<code>Input</code>, <code>Select</code>, the shared{" "}
        <code>Field</code>) inside a section card, with a Back/Next footer. Live
        demo: <code>/register-business</code>.
      </P>
      <CodeBlock title="a stepper-driven wizard">{`import { Steps, type Step } from "@viliha/vui-ui/steps";

const STEPS: Step[] = [
  { label: "Organization", description: "Business details" },
  { label: "Account", description: "Your credentials" },
  { label: "Review", description: "Confirm details" },
];

function Wizard() {
  const [step, setStep] = useState(0);
  return (
    <>
      <Steps steps={STEPS} current={step} />
      {step === 0 && <OrganizationFields />}
      {/* … */}
      <div className="flex justify-between border-t border-border bg-muted/40 px-4 py-3">
        <Button onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Back</Button>
        <Button variant="primary" onClick={() => setStep((s) => s + 1)}>Next</Button>
      </div>
    </>
  );
}`}</CodeBlock>
      <Shot
        src="/page-types/wizard.png"
        alt="Register Your Business — a three-step wizard built with the Steps indicator"
      />
      <P>
        See the{" "}
        <a
          href="/docs/templates"
          className="font-medium text-foreground underline"
        >
          workflow requirement template
        </a>{" "}
        for how to brief an agent to build one of these.
      </P>

      <H2>Bordered list components</H2>
      <P>
        Any component that renders a list of records — dropdown menus, selects,
        the account menu, searchable comboboxes — uses{" "}
        <strong>bottom-border dividers between items</strong> by default. Rather
        than remember the classes, build lists from the <code>Menu</code>{" "}
        primitive: the divider, hover and last-row handling come baked in, so a
        hand-rolled list can&apos;t miss the border.
      </P>
      <CodeBlock title="account-menu.tsx">{`import { Menu, MenuItem, MenuLabel } from "@viliha/vui-ui/menu";

<Menu className="w-56">
  <MenuLabel>Account</MenuLabel>
  <MenuItem onClick={editProfile}>Profile</MenuItem>
  {/* render a link instead of a button with \`as\` */}
  <MenuItem as={Link} href="/settings">Settings</MenuItem>
  <MenuItem onClick={signOut}>Sign out</MenuItem>
</Menu>`}</CodeBlock>
      <P>
        The shipped <code>Dropdown</code>, <code>Select</code> and the account
        menu already follow this — you get it for free when you use them. Need
        the raw class for a bespoke element? Import{" "}
        <code>menuItemClass</code> from <code>@viliha/vui-ui/menu</code>.
      </P>

      <H2>Dialogs</H2>
      <P>
        Dialogs are sectioned like everything else: a bordered{" "}
        <strong>header</strong>, a scrollable <strong>body</strong>, and a
        bordered <strong>footer</strong> for actions. The <code>Dialog</code>{" "}
        primitive gives you the shell (centered panel, dimmed backdrop, entrance
        animation, Escape / backdrop-click to close) plus those three
        placeholders — you only pass content.
      </P>
      <CodeBlock title="invite-dialog.tsx">{`import {
  Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@viliha/vui-ui/dialog";
import { Button } from "@viliha/vui-ui/button";

<Dialog open={open} onClose={close} label="Invite teammate">
  <DialogHeader>
    <DialogTitle>Invite teammate</DialogTitle>
  </DialogHeader>
  <DialogBody>
    {/* your form / content */}
  </DialogBody>
  <DialogFooter>
    <Button onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={submit}>Send invite</Button>
  </DialogFooter>
</Dialog>`}</CodeBlock>
      <H3>Confirmations</H3>
      <P>
        For a yes/no prompt (like delete), <code>ConfirmDialog</code> is built on{" "}
        <code>Dialog</code> — pass a title, description and handlers:
      </P>
      <CodeBlock title="delete-confirm.tsx">{`import { ConfirmDialog } from "@viliha/vui-ui/confirm-dialog";

<ConfirmDialog
  open={open}
  title="Delete organization?"
  description="This can't be undone."
  destructive
  confirmLabel="Delete"
  onConfirm={remove}
  onCancel={close}
/>`}</CodeBlock>

      <DocPager
        prev={{ label: "Theming", href: "/docs/theming" }}
        next={{ label: "Building with AI agents", href: "/docs/ai-agents" }}
      />
    </article>
  );
}

/** A captioned screenshot of a real page (from public/page-types/). */
function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="my-4 overflow-hidden rounded-lg border border-border shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={2560}
        height={1600}
        className="h-auto w-full"
      />
      <figcaption className="border-t border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        {alt}
      </figcaption>
    </figure>
  );
}

/* ── Schematic page-type thumbnails (theme-aware, no image assets) ────────── */

function Thumb({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="m-0">
      <div className="flex aspect-[4/3] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {/* window chrome / action header */}
        <div className="flex shrink-0 items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
          <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          <span className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
        </div>
        <div className="min-h-0 flex-1 p-2">{children}</div>
      </div>
      <figcaption className="mt-1.5 text-center text-xs text-muted-foreground">
        {label}
      </figcaption>
    </figure>
  );
}

/** A form label + input pair. */
function Field() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-4 shrink-0 rounded bg-muted-foreground/30" />
      <span className="h-2 flex-1 rounded border border-border bg-background" />
    </div>
  );
}

function PageTypeGallery() {
  return (
    <div className="my-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <Thumb label="1 · Data table">
        <div className="flex h-full flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <span className="h-2 w-6 rounded bg-muted" />
            <span className="h-2 w-2 rounded bg-muted" />
            <span className="ml-auto h-2 w-5 rounded bg-[var(--button-primary)]" />
          </div>
          <span className="h-2 w-full rounded bg-muted/70" />
          <span className="h-2 w-full rounded bg-muted/70" />
          <span className="h-2 w-full rounded bg-muted/70" />
          <span className="h-2 w-full rounded bg-muted/70" />
        </div>
      </Thumb>

      <Thumb label="2 · Form — full page">
        <div className="flex h-full gap-1.5">
          <div className="flex flex-1 flex-col gap-1">
            <Field />
            <Field />
            <Field />
            <div className="mt-auto flex justify-end gap-1">
              <span className="h-2 w-4 rounded border border-border" />
              <span className="h-2 w-5 rounded bg-[var(--button-primary)]" />
            </div>
          </div>
          {/* AWS-style documentation panel */}
          <div className="w-1/3 rounded border border-border bg-muted/30" />
        </div>
      </Thumb>

      <Thumb label="2 · Form — slide-over">
        <div className="flex h-full gap-1.5">
          <div className="flex flex-1 flex-col gap-1.5 opacity-40">
            <span className="h-2 w-full rounded bg-muted/70" />
            <span className="h-2 w-full rounded bg-muted/70" />
            <span className="h-2 w-full rounded bg-muted/70" />
            <span className="h-2 w-full rounded bg-muted/70" />
          </div>
          <div className="flex w-2/5 flex-col gap-1 rounded border border-border bg-card p-1 shadow">
            <Field />
            <Field />
            <span className="mt-auto h-2 w-full rounded bg-[var(--button-primary)]" />
          </div>
        </div>
      </Thumb>

      <Thumb label="3 · Dashboard">
        <div className="flex h-full flex-col gap-1.5">
          <div className="grid grid-cols-4 gap-1">
            <span className="h-3 rounded bg-muted" />
            <span className="h-3 rounded bg-muted" />
            <span className="h-3 rounded bg-muted" />
            <span className="h-3 rounded bg-muted" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1">
            <span className="col-span-2 rounded bg-muted/70" />
            <span className="rounded bg-muted/70" />
          </div>
        </div>
      </Thumb>

      <Thumb label="4 · Settings">
        <div className="flex h-full flex-col gap-1.5">
          <span className="h-4 w-full rounded bg-muted/70" />
          <span className="h-4 w-full rounded bg-muted/70" />
          <div className="mt-auto flex justify-end border-t border-border pt-1.5">
            <span className="h-2 w-6 rounded bg-[var(--button-primary)]" />
          </div>
        </div>
      </Thumb>

      <Thumb label="5 · Board (Kanban)">
        <div className="grid h-full grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((c) => (
            <div
              key={c}
              className="flex flex-col gap-1 rounded border border-dashed border-border bg-muted/30 p-1"
            >
              <span className="h-2 rounded bg-card shadow-sm" />
              <span className="h-2 rounded bg-card shadow-sm" />
            </div>
          ))}
        </div>
      </Thumb>
    </div>
  );
}
