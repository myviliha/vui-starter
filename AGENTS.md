# AGENTS.md

Deterministic rules for AI agents working in this repo. Read this first. For the
rationale, see [`Enterprise_NextJS_React_Coding_Standards.md`](./Enterprise_NextJS_React_Coding_Standards.md).

## What this repo is

Turborepo + pnpm monorepo. One app + one published library:

- `apps/backoffice` — Admin app **and** the docs site (docs are routes under `app/docs`, served at `/docs`). Dev on **:3000**.
- `packages/ui` — `@viliha/vui-ui`, shipped as **TypeScript source** (no build).

## Where things go (do exactly this)

| Task | Location |
| --- | --- |
| New reusable component | `packages/ui/src/<name>.tsx` → auto-exported as `@viliha/vui-ui/<name>` (the `./*` export map; **no barrel edit needed**) |
| New admin page | `apps/backoffice/app/(app)/<route>/page.tsx` — copy the page template from docs `/layout`. **Pick a page type** (see "Page types" below) and state which; for a record form default to **slide-over**. |
| New auth page | `apps/backoffice/app/auth/<name>/page.tsx` — inherits the auth shell (`AuthHeader` logo bar + `SiteFooter`). Build fields with `Field` inside a `FieldGrid` (two-column: labels │ inputs) from `_components/auth.tsx`; don't hand-roll |
| New legal/public page (Terms, Privacy, …) | `apps/backoffice/app/(legal)/<name>/page.tsx`, the same brand shell as auth but **indexable**. Compose with `LegalTitle` / `LegalSection` / `LegalList` from `(legal)/_components/legal.tsx`, add the route to `LEGAL_ROUTES` in `lib/seo.ts` (sitemap), and link it from `SiteFooter` if it belongs there |
| shadcn component | `npx shadcn@latest add <name>` (from the backoffice dir) → `components/ui/` |
| Design token / color / radius | `packages/ui/src/theme.css` — **never hard-code**, add/read a token |
| Navigation (sidebar + breadcrumbs) | `apps/backoffice/app/_components/nav-config.ts` — single source; breadcrumbs derive from it |
| Data fetching / API calls (**Data layer**) | `apps/backoffice/lib/api/<entity>.ts` — async functions, no React. Swap the mock bodies for `fetch(url, { signal })` later |
| Page data + loading/error state (**Controller**) | `apps/backoffice/app/(app)/<route>/use-<entity>.ts` — a hook that bridges the data layer to the UI |

## Single sources of truth — never duplicate

- **Tokens/colors/typography/radius/dark-mode** → `theme.css`.
- **Navigation** → `nav-config.ts` (sidebar + breadcrumb trail both derive from it).
- **Page layout / section cards / dialogs / menus / datatable** → documented at docs `/layout` and `/data-table`. Reuse `Dialog`, `Menu`, `RecordView`, `ChartContainer` — don't re-implement.
- **`cn`** → `@viliha/vui-ui/utils`. `utils.ts` is intentional; do not "fix" it.
- **Site footer** → `_components/site-footer.tsx` (`SiteFooter`). The app shell, auth screens, legal pages, and the 404/500 pages all render it — edit once. It carries the copyright line plus the Terms and Privacy links, so those links exist on every surface by construction. The **auth/404/500 shell** (brand header + footer, no menus) is `AuthHeader` + `SiteFooter`; reuse them, don't rebuild a header/footer per page.

## Architecture: three layers (Data → Controller → Presentation)

Data flows one way through three separated layers. **Keep them in separate files
— never process data in a UI component.** `organizations` is the reference
implementation; copy its shape for any data-backed page.

| Layer | File | Rule |
| --- | --- | --- |
| **Data (API)** | `lib/api/<entity>.ts` | Talks to the backend. Async functions (`list…`, `add…`, `update…`), **no React**. Mock in-memory today; swap the bodies for `fetch(url, { signal })` and nothing above changes. |
| **Controller** | `app/(app)/<route>/use-<entity>.ts` | A hook that bridges data ↔ UI. Owns `{ data, loading, error }`, calls the data layer in an effect **after mount**, exposes writes. **No JSX.** For kept-alive pages, revalidate on tab re-focus with `useRefetchOnActive` + a delta sync (see "Open tabs"). |
| **Presentation** | `app/(app)/<route>/<entity>-view.tsx` (+ thin `-table.tsx` loader) | Reads the controller and renders `RecordView`. **Zero fetching or data processing.** |

Two consequences you must preserve:

1. **Paint the UI first, load data after.** The controller starts `loading: true`
   with empty data, so `RecordView`'s skeleton shows immediately; data fills in
   when the fetch resolves. The thin `*-table.tsx` loader `next/dynamic`-imports
   the (heavier) view behind a `TableSkeleton`, so the shell paints on the first
   click instead of waiting for the datatable chunk to parse.
2. **No data work in the UI.** Filtering, sorting, mapping, and persistence live
   in the data/controller layers (or `RecordView`'s own `fetcher`), never in the
   view. If a component is both fetching and rendering, split it.

For large server-backed lists, prefer `RecordView`'s built-in `fetcher` /
`manual` (server-side query + shimmer + cache) over hand-rolling it in the
controller.

## Page types

There are **five** page shapes — **pick the one the requirement calls for, don't invent a sixth.** State which type you're building. Visuals + full structure at docs `/layout` ("Page types").

| # | Type | Build with | Example route | Use when |
| --- | --- | --- | --- | --- |
| 1 | **Data table** | `RecordView` + a `fields` array (thin server `page.tsx` → client `*-table.tsx`) | `organizations`, `branches`, `departments` | Any list of records |
| 2 | **Record form** (Add / Edit / View) | `RecordView`/`RecordForm` from the same `fields` | slide-over: `branches`; full-page: `organizations/new` | Create/edit/view a record |
| 3 | **Dashboard** | manual frame: `StatCard` grid + bordered-card sections | `dashboard` | An overview / landing screen |
| 4 | **Settings (single-form)** | one bordered card of `Section`s + a fixed Save footer | `settings` | "A form with a Save button," not a list |
| 5 | **Board (Kanban)** | `overflow-x-auto` row of fixed-width column sections | `crm/opportunities` | Stage/status pipelines |

Types 3–5 use the standard page frame (`flex h-full flex-col` → action header with `<Breadcrumbs/>` → scrolling `p-4` content). Client pages (3–5) put their `metadata` in a sibling `layout.tsx` (they can't `export const metadata`).

### Record form — two variants (type 2)

Both come from the same `RecordForm`; **pick one, don't invent a third:**

- **Slide-over (standard / default).** Add/edit/view open as an overlay panel from `RecordView`. Nothing to configure. Uncontrolled (`initialData`). Example: `departments`.
- **Full-page route.** `formMode="page"` + dedicated `/new` & `/edit` routes rendering `<RecordForm layout="page" columns={1|2} … />`; controlled, config shared via `*-config.tsx`. Adds a breadcrumb bar, a **dynamic Info panel** (from `formDescription` + per-field `description`), and a fixed Save/Cancel footer. Use for long forms or when the flow needs its own URL. Example: `organizations/new`.
- **Full-page profile (view → edit).** A single record shown read-only, with an **Edit** button that opens the same Cancel + Save footer. Don't hand-wire it — use the shipped `ProfileForm` (`@viliha/vui-ui/profile-form`): `<ProfileForm data={…} fields={…} onSave={…} getPrimary={…} title="Organization" />`. For a company profile, spread the `organizationProfileFields` preset (`@viliha/vui-ui/organization-profile`). Example: `organization/profile` (the current org — company info, branding, contact, locale), a thin consumer of both.

When asked to add a page, **state which variant and default to slide-over.** Both inherit the blue Save, header/body/footer separators and token colors from the component — you never copy those styles. Same rule downstream in `packages/ui/AGENT.md`.

**Form layout is declared, not styled** (full write-up: docs `/form-layout`, template `templates/form.md`). A form is **rows**; each row names the sections that sit side by side on it: `formRows={[{ sections: [{ group: "Customer" }, { group: "Delivery" }] }, …]}`. Fields join a card through their `group`. One section on a row fills the row, so nothing needs a width, and three to a row is the readable maximum. **Every card is the same two columns, one field per row**: `[i] Label *` then the control, with hairlines between. Never stack a label above its control, and never add a per-field column count: a form is made wider by adding sections to a row, not by cramming fields into one. `sectionColumns` and `sections[].span` are deprecated since 1.59.

**Validation shows on the field, never as text or a toast.** A failing control gets a red border and its message moves onto the field's info icon, so the form never grows a line of red text that shifts everything below it mid-typing. That is the package default (`form.errorDisplay`, `"tooltip"`); `"text"` restores the old under-the-control message. The message is announced to screen readers either way.

**From a field spec to a form — never style fields by hand.** A request like "Add Customer: Name (mandatory, text), Email (mandatory), Country" becomes a `RecordField[]`, nothing more: `{ key, label, required: true }` per field (add `description` for the Info-panel help). The component designs Add/Edit/View from that array — required renders the `*`, the label + icon + control are center-aligned on one baseline, colors come from theme tokens. Do **not** add per-field className, padding, or color; if a field looks unstyled, you built a raw input instead of feeding `fields`.

## Command palette (Quick actions & Global search)

Two ⌘K palettes, **both the same headless `CommandPalette`** (`@viliha/vui-ui/command-palette`) — never hand-roll a search dropdown:

- **Quick actions** (`⌘K` / `/`) → navigates **pages**; actions derived from `nav-config.ts`. Wiring: `app/_components/quick-actions.tsx`.
- **Global search** (`⌘⌥K`) → searches **records**; index built from the data modules. Wiring: `app/_components/global-search.tsx`.

Each is a provider (open state + a `keydown` effect, told apart by `e.altKey`) mounting `CommandPalette` with a `CommandAction[]` (`{ id, label, group?, icon?, keywords?, onSelect }`). To add a searchable source, push more actions — for real data, swap the demo record index for API results. Docs + examples at `/layout`.

## Top-bar feature flags (configurable chrome)

The seven top-bar affordances — **Quick actions, Global search, Help, Documentation, Notifications, Settings, User menu** — are **on by default and each can be turned off.** Single source: `lib/app-config.ts` (`ChromeFeature`, `CHROME_FEATURES`, `CHROME_DEFAULTS`). Two layers, do not add a third:

- **Install-time default** → `NEXT_PUBLIC_SHOW_*` env var (`=0`/`false` to hide); referenced literally so Next inlines it — never a dynamic `process.env[…]` lookup. Declare any new one in `turbo.json` `globalEnv`.
- **Runtime override** → `ChromeConfigProvider` + `useChrome()`/`useChromeConfig()` in `app/_components/chrome-config.tsx` (localStorage key `vui.chrome`), toggled on the Settings page's *Top bar* section. `ChromeConfigProvider` wraps the app shell in `(app)/layout.tsx`.

Gate a feature by reading `useChrome().<feature>` where it renders (hide the control **and** skip its shortcut/palette — see `top-bar.tsx`, `quick-actions.tsx`, `global-search.tsx`). To add a new toggleable feature: add a `ChromeFeature` key + `CHROME_FEATURES` entry + `CHROME_DEFAULTS` line + `turbo.json` env, then gate the render.

## Theme config (`VuiProvider`)

The theme ships configured and stays changeable. `vuiPreset` (`@viliha/vui-ui/config`) is the shipped behaviour as a plain value, applied by default, so there is no separate "configurable" component set. Values resolve **per-instance prop → user preference → `<VuiProvider config>` → `vuiPreset` → package default**, and a layer overrides only the keys it names.

- **App-wide config** → `<VuiProvider config={…}>`, mounted in `(app)/layout.tsx`. Sections: `form` (footer `actions`) and `behaviour` (`rowClick`, `closeOnSave`, `flashMs`, `confirmDelete`, `confirmDiscardWhenDirty`).
- **Per screen** → `behaviour` / `formActions` / `renderFooter` props on `RecordView`. A prop always wins.
- **Per person** → `userConfigurable` lists the keys the app hands to whoever is using it; their choices persist in localStorage (`vui.prefs`) and are edited on the Settings page's *Data tables* section via `useVuiPreferences()`. The allow-list lives in `lib/app-config.ts` (`DATA_TABLE_PREFERENCES` + `DATA_TABLE_PREFERENCE_FIELDS`), next to the chrome flags it mirrors.

Colors, radius, spacing and typography are **not** in here: they stay in `theme.css`. What they do have is a **runtime source**: `ThemeConfigProvider` (`@viliha/vui-ui/theme-provider`) applies a `ThemeConfig` as CSS variables, with the organization's theme as the floor and each user's overrides on top. `THEME_FIELDS` in `theme-config.ts` is the complete themeable list; `ORG_THEME` and `THEME_CHOICES` in `lib/app-config.ts` wire the demo, and Settings → *Theme* is the reference UI. To persist per user, pass `source={{ load, save }}` pointing at your API. Never add a per-component colour prop instead. Adding a behaviour key is fine when a screen genuinely needs it and the alternative is forking a component; it is not the place for anything the tokens already own. Roadmap for the remaining slices: `docs/proposals/configurable-theme-roadmap.md`.

## Organization switcher (multi-tenant)

The sidebar's brand block is the tenant switcher: `OrgSwitcher` (`@viliha/vui-ui/org-switcher`) mounted in `app-sidebar.tsx`, fed by `WorkspaceProvider` (`app/_components/workspace-provider.tsx`) over the `lib/api/workspaces.ts` data layer. Three layers as usual: the API lists the tenants, the provider owns the switch, the component only renders.

- **Switching logic lives in the host**, in `WorkspaceProvider`'s `onSwitch`. It runs before the change and throwing cancels it, so a refused API call doesn't drop someone into a tenant they can't see. The package's default (set current, remember per browser) is what you get without one.
- **Chrome is config**: `heading`, `currentLabel`, `addLabel`, `showPlan`, `showAdd` under `orgSwitcher` in `VuiProvider`. Don't add a prop for something that belongs there.
- **The tenant's brand follows the switch**: each `Organization` carries a `theme` that `WorkspaceProvider` hands to `ThemeConfigProvider` as the org layer, under any personal override.
- **Where "Add organization" goes is config**, in `ORG_SWITCHER` (`lib/app-config.ts`), currently `/register-business`. Change the route there, not in `app-sidebar.tsx`. Use the component's `onAdd` only when creating should open a dialog instead of navigating. Don't build a second creation path.

## Sidebar sections & groups

The sidebar is driven by `nav-config.ts` (`NAV: NavSection[]`). **Two grouping shapes — use them, don't invent a third:** a **Section** (`NavSection`, `{ title?, items }`) is a top-level band with an optional `title` heading whose items are always visible (static, no collapse — e.g. *Records*, *System*; the first section usually has no title); a **collapsible group** (`NavGroup`, an entry with `children`) is a parent row with a chevron that **hides/unhides** its nested links and auto-opens when a child is active (e.g. *Auth*, *CRM*, *System*) — use it to keep the sidebar short. A group parent has no page of its own, so its breadcrumb points at its first child (see `SECTION_INDEX`). When adding a page, add it to `NAV` and mirror its color in `route-meta.ts`; default to an existing Section and only add a Group when nesting several related sub-pages. Full write-up at docs `/navigation`.

## Open tabs

A browser-style strip of opened pages (labelled "Tabs") lives in the shell: `OpenTabsProvider` + `<TabStrip/>` + `<KeepAliveTabs/>` in `app/_components/open-tabs.tsx`, mounted once in `(app)/layout.tsx`. **Keep-alive**: every open page stays mounted (inactive hidden) so switching is instant with no remount/flash and preserved state; new routes mount on first visit. The list persists in `sessionStorage`, capped by `NEXT_PUBLIC_MAX_TABS` (default 5, FIFO-evict oldest + warn). Tab identity is normalized via `tabKey` (trailingSlash-safe). Labels/icons/colors derive from `nav-config.ts` + `route-meta.ts` (no per-tab wiring). Tabs are **drag-reorderable** (FLIP-animated) and **right-click-taggable** with one of seven color labels (order + colors persisted). ⌘/Ctrl-click a sidebar item opens a background tab; for a custom "open in new tab" call `useOpenTabs().openTab(href, { background: true })`. Keep-alive works because the app is a static export (all client at runtime). **Keep-alive is toggleable:** set `NEXT_PUBLIC_KEEP_ALIVE_TABS=0` (default on) to disable it — `KeepAliveTabs` then renders only the active route (Next remounts on navigation) while the tab strip stays as a plain navigation shortcut. Use this while the feature is being stabilised.

**Stale data (keep-alive tradeoff).** A kept-alive controller fetches once on mount and never again, so another user's edit won't show until you reopen the tab. Revalidate with `useRefetchOnActive(routePath, refetch)` (`lib/use-refetch-on-active.ts`) — it re-runs `refetch` when the tab becomes active again or the window regains focus. Make `refetch` a **delta** (`?since=cursor` → only changed rows + deleted ids, merged by `id`), not a full reload; `use-organizations.ts` + `syncOrganizations()` are the reference. This narrows but doesn't close the conflict window — guard the write with optimistic concurrency (version/updatedAt → 409) if conflicts matter.

## Multi-step wizards

For guided flows (registration, onboarding, checkout) use the exported `Steps` indicator (`@viliha/vui-ui/steps`) + your own step index — never hand-roll a stepper. Build each step's body from `Input`/`Select`/`Field` in a section card with a Back/Next footer. Reference: `app/register-business/`. See docs `/layout` ("Multi-step wizard") and the workflow requirement template at `/docs/templates`.

## Breadcrumbs

One trail, **route-derived, never hand-written per page.** Two layers:

- **Design** → the shared `Breadcrumbs` component (`@viliha/vui-ui/breadcrumbs`). Last crumb = current page (bold, non-interactive); earlier crumbs are links; chevron separators; optional back arrow. Never build a trail from raw `<a>`/`<span>`.
- **Logic** → `crumbsFor(pathname)` in `app/_components/route-meta.ts`, driven by `nav-config.ts`. The trail is computed from the URL:
  - always rooted at **Home** (`/dashboard`);
  - one crumb per path segment; label from `SEGMENT_LABELS`, else Title-cased;
  - a section/group parent has no index page, so `SECTION_INDEX` (auto-derived from `NAV`) points its crumb at its **first child** — clicking `System` lands on the first System page. This is the standard; keep it.
  - the last segment is the current page (non-interactive).

To change the trail, edit `nav-config.ts` (structure/order) and the label/color maps in `route-meta.ts`; breadcrumbs follow automatically. A one-off page may pass an explicit `crumbs` array to the shared component (as `RecordForm` does for "Create new …"), but the default is always route-derived — never re-implement the deriver per page.

**Landing page:** ship exactly one, at `/dashboard`, labeled "Home" (sidebar first item + breadcrumb root). Do **not** add a separate `/home`. Add a "Dashboards" section only when multiple dashboards are actually needed.

## Hard rules

1. **Server Components by default.** Add `"use client"` only for hooks, event handlers, browser APIs, or interactive Radix/cmdk. Keep the boundary on the smallest leaf.
2. **Strict TypeScript. No `any`** (use `unknown` + narrowing). Export public types with their component.
3. **No hard-coded design values** — use theme tokens / shared components.
4. **No new dependency** for what a few lines can do. Prefer stdlib/native/existing deps.
5. **Any scroll region gets `vui-scroll`.** macOS hides overlay scrollbars until you scroll, so a wide table looks like it ends at the last column and a long form looks complete at the fold. The class (in `theme.css`) keeps both bars visible whenever there is somewhere to scroll, in theme colours, with the gutter reserved so content doesn't shift. `RecordView` applies it to its table and form body; apply it to anything scrollable you add.
6. **Follow the page pattern:** `flex h-full flex-col` → action header with `<Breadcrumbs/>` → content `min-h-0 flex-1 overflow-y-auto` → `flex flex-col gap-4 p-4`. Content padding is always `p-4`/`gap-4`. Prefer the shipped `Page` component (`@viliha/vui-ui/page`), which **is** that pattern with slots for `breadcrumbs`, `actions` and `footer`: `<Page breadcrumbs={<Breadcrumbs />} actions={…}>`. Reference: the `dashboard` page. Hand-rolled frames are being migrated to it, so don't add new ones.
7. **Import and Export are placeholders with a working default.** The CSV/Excel/JSON/PDF entries ship and work in the browser; they are built from the same `IoAction` type a host uses, so `importActions` / `exportActions` (per table, or `table.*` on `VuiProvider`) replace or extend them with the same API. A function edits the shipped list, an array replaces it, an empty array hides the menu. For anything server-side use `ctx.query`, not `ctx.rows`: in `fetcher` mode the browser only holds the page on screen, so "export all" means asking your API with the query.
8. **Datatables & record forms:** use `RecordView`/`RecordForm` (`@viliha/vui-ui/record-view`) with a `fields` array; never hand-roll a table, an add/edit form, **or a filter form**. This is what enforces the design — the blue primary `Save` (`--button-primary`), the section-header / body / footer separators, and the field-icon accent all come from the component. A hand-built `<form>` gets none of it. For **per-field filtering**, set `filterable` on the fields (`true`, or `{ control, options, … }`) and handle `onFilter(values)` — don't build your own filter inputs. See docs `/layout` and `/data-table`.
9. **Floating UI: one surface, and it must clear what opened it and be portalled.** Menus, popovers, selects, hover cards and tooltips all use `bg-popover` with a border and shadow; backdrops all use `bg-foreground/25`. Never a dark bubble or `bg-black` (both ignore the theme).  Dropdowns, pickers, popovers, tooltips and confirms have to sit above the panel, dialog or scrolling card they were opened from, or they are invisible or unclickable. Use the documented z-scale at the top of `packages/ui/src/theme.css` (60 slide-over · 70 Dialog · 80 confirm · 100 palette · 200 pickers/menus · 210 HoverCard · 220 Tooltip · 250 Toast) and never invent a value: `packages/ui/src/z-layers.test.ts` fails on anything off it. Position alone isn't enough, portal to the body as well, since a section card's `overflow-hidden` clips an `absolute` child at any z-index.
10. **Lists/menus:** use `Menu`/`MenuItem` (bordered-row standard) or the shared `Dropdown`/`Select`; don't hand-roll list borders.
11. **Icons:** Radix Icons (`@radix-ui/react-icons`) for app chrome; leave shadcn's internal Lucide icons as-is.
12. **Comment deliberate no-ops** (e.g. clipboard/storage `catch`). Never silently swallow errors elsewhere.
13. **Every feature reaches the MCP server (mandatory).** The server in
    `packages/ui/bin/mcp.mjs` is how a consumer's agent learns this package, so a
    feature it can't answer for does not exist. It derives everything from
    `src/`, `template/`, `docs/`, `AGENT.md` and `README.md`, so the usual work
    (ship the component, document it) covers it. What is on you: if the thing you
    added lives somewhere new (a new export-map entry, a new file type, a docs
    page that isn't a normal route, a concept with no doc section), teach the
    server to serve it and add the case to `bin/mcp.test.mjs`. Two tests there
    fail when the package exports something the server doesn't list, or the docs
    site grows a page with no guide. See "MCP server" below.
14. **Changelog + docs on every change (mandatory; see below).** No feature or fix is "done" until the changelog and the relevant docs are updated in the same change. After writing them, you **re-read and humanize** the prose (plain, human voice, no AI tells, and no em dashes) and make them **SEO and AEO friendly**. See the humanize and SEO/AEO rules in "Changelog & docs".

## Changelog & docs — mandatory on every change (never skip)

Any change that adds, changes, removes, or fixes behaviour **must** update the docs in the **same commit/PR**. This is not optional and cannot be deferred:

1. **`packages/ui/CHANGELOG.md`** — add an entry under the target version (Added / Changed / Fixed / Removed), Keep-a-Changelog style. If the change ships in the npm package (`packages/ui/**` — components, `theme.css`, `AGENT.md`, `README.md`, `bin/`, `template/`), also **bump `packages/ui/package.json`** per semver (patch = fix, minor = feature, major = breaking).
2. **Every doc surface that describes the thing** — keep them in sync (they are single sources, don't let them drift):
   - `packages/ui/README.md` (npm-facing) and `packages/ui/AGENT.md` (consumer agent guide) for anything user/consumer-facing.
   - the docs site under `apps/backoffice/app/docs/**` (the matching page, and `components/docs-shell.tsx` nav + `DocPager` prev/next if you add a page).
   - the reference/agent docs (`README.md`, `CONTRIBUTING.md`, this `AGENTS.md`) when the workflow or rules change.
   - requirement templates in `apps/backoffice/public/templates/**` when a page/feature pattern changes.
3. **A new `init` scaffolder feature or new demo page** must also be reflected in the shipped `template/` (it regenerates from `apps/backoffice` on publish) and documented in `AGENT.md` + the docs.
4. **The MCP server must be able to answer for it** (hard rule 13). Ask the question a consumer's agent would ask and check `bin/mcp.mjs` returns it: a new component through `list_components` / `get_component`, a new page or shell pattern through `list_pages` / `get_page`, a new docs page through `list_guides` / `get_guide`, a new rule through `search_docs`. All four read generated sources, so writing the docs is usually the whole job. Serving a new kind of surface is not: add it to `TOOLS` and cover it in `bin/mcp.test.mjs`.
5. **After writing any docs, check and humanize them (mandatory).** Once the prose is drafted (READMEs, CHANGELOG entries, docs-site pages, reader-facing comments, this file), re-read it before committing and rewrite anything that sounds machine-generated. This is a required final pass, not optional. In that pass:
   - **Remove every em dash (the `—` character) used as punctuation, no exceptions.** It is the single biggest AI tell. Rewrite around it with a comma, a colon, parentheses, or by splitting into two sentences. The only acceptable `—` is a literal reference to the character itself, as in this rule.
   - Use plain, direct language and vary sentence length.
   - Cut filler and the usual AI tells: "delve", "seamless", "robust", "leverage", "in today's fast-paced…", "it's worth noting", hedging, padded bullet lists.
   - Prefer a concrete example over an abstract claim, and match the voice already in the repo.
   - If a sentence reads like boilerplate, rewrite it or delete it.

   Applies to every doc surface above, no exceptions.
6. **Docs must be SEO and AEO friendly (mandatory).** Write every doc so both search engines and answer engines (Google, plus AI assistants like ChatGPT, Claude, and Perplexity) can find, index, and quote it. Apply this in the same pass as the humanize check.
   - **SEO:** give each docs-site page a unique, keyword-led `title` and `description` in its `metadata` (client pages put it in the sibling `layout.tsx`); use one `H1` (`PageTitle`) per page, then a logical `H2`/`H3` outline that uses real search terms; write descriptive link text and image `alt`; set a self-canonical. Add any new route to `PUBLIC_ROUTES` in `lib/seo.ts` so it reaches the sitemap.
   - **AEO:** open the page, and each major section, with a direct one-sentence answer to the question it addresses, before the detail. Phrase headings the way people actually ask ("How do I add a page?"). Keep statements factual, self-contained, and quotable, define a term on first use, and show concrete code or steps. Those are the passages an answer engine lifts.

If you're unsure whether a doc applies, it does, so update it. A change that touches code but no docs/changelog is incomplete.

## Verify before "done" (must pass)

```bash
pnpm --filter @viliha/vui-ui check-types
pnpm --filter backoffice lint            # eslint --max-warnings 0
pnpm --filter backoffice build           # or the app you changed
pnpm --filter @viliha/vui-ui test      # includes the MCP coverage tests
```

Plus (not optional): the **CHANGELOG + docs update** from the "Changelog & docs" rule above, a `packages/ui` version bump if the change ships in the package, and the **MCP check** from hard rule 13 (ask the server the question a consumer's agent would ask, and see that it answers).

## Knowledge graph (graphify)

This repo ships a prebuilt knowledge graph so an agent can answer "how does X work?" or "what calls Y?" without re-reading the tree. The graph lives at `graphify-out/graph.json` (portable, relative paths, committed) with a human-readable `graphify-out/GRAPH_REPORT.md` next to it.

- **Query it before searching.** For a codebase question, run `graphify query "<question>"` against `graphify-out/graph.json` instead of grepping blind. The graph maps god nodes (`cn`, `RecordView`), communities, and cross-file edges.
- **Update it with every change.** After a fix or feature lands, refresh the graph incrementally (`graphify --update`, or the `detect_incremental` → AST + semantic re-extract → `build_merge` → write flow). If the merge's fuzzy dedup shrinks the node count and the guard refuses to overwrite `graph.json`, force the write so `graph.json` and `GRAPH_REPORT.md` stay consistent. This sits alongside the CHANGELOG/docs rule, it does not replace it.
- **What's tracked vs ignored.** Commit `graph.json` and `GRAPH_REPORT.md`. The `cache/`, `manifest.json`, `cost.json`, regenerable `graph.html`, and `.graphify_*` scratch files are machine-specific and git-ignored, so regenerate those locally.

## MCP server (`bin/mcp.mjs`)

The package ships an MCP server (`npx @viliha/vui-ui mcp`, a `mcp` subcommand of
the same `bin/vui.mjs` CLI) so a consumer's agent can query VUI over stdio. It
serves seven tools: `list_guides`, `get_guide`, `list_components`,
`get_component`, `list_pages`, `get_page`, `search_docs`.

**It has no index of its own.** Components are read from `src/` (including
`theme.css`, so tokens and the z-scale are one call away), pages and layouts from
`template/` (the backoffice snapshot), rules from `AGENT.md` and `README.md`, and
the guides from `docs/`, a markdown snapshot of the docs site written by
`scripts/snapshot-docs.mjs` from `apps/backoffice/out/docs`. So a new component,
demo page or docs page shows up for free, and the rule that keeps it honest is
the existing one: keep the docs current.

`search_docs` ranks with tf-idf over sections, splitting on headings **and** on
the bold lead-ins this repo writes ("**Multi-tenant apps: the organization
switcher.**"), so a query lands on the paragraph that answers it instead of the
longest section on the page. Changelog entries are down-weighted unless the
question is about a release.

Both snapshots are git-ignored and regenerated on `prepublishOnly`, so a publish
now needs the docs site built first (`pnpm --filter backoffice build`, then
`pnpm --filter @viliha/vui-ui snapshot-docs`). `bin/mcp.test.mjs` covers the
handshake, each tool, and the path guards on `get_page` and `get_guide`; the
guide assertions skip themselves when `docs/` hasn't been generated locally.
Adding a tool means adding an entry to `TOOLS` and a case to that test, nothing
else.

## Working style: build the least that works

Prefer the smallest change that solves the problem. Reach for the standard library or an already-installed dependency before adding a new one, a native platform feature before hand-rolled code, and one line before fifty. Skip speculative abstractions (no interface with one implementation, no config for a value that never changes) and say so in a line rather than building for a future that may not arrive. Non-trivial logic still leaves one runnable check behind. This is the default for both humans and agents here.

## Git conventions

- Author is **Suman Bonakurthi**. Do **not** add a Claude/AI co-author trailer or attribution.
- Small, focused commits with imperative messages (`feat(ui): …`, `fix(backoffice): …`).
- **Every task runs the same loop. Don't skip a step.**

  **Before starting**
  1. `git checkout main && git pull` (rebase if the tree diverged).
  2. Run the verify set on the untouched tree, so a pre-existing failure is never mistaken for yours: `check-types`, both lints, tests, `build`.
  3. Branch: one branch per feature, bug or issue.

  **Before committing**
  4. `git pull --rebase origin main` again, to pick up whatever landed while you worked.
  5. Run the full verify set again. It has to be green: your local run is the gate, because CI on `main` only reports after the code is already in.
  6. Update the CHANGELOG and every doc the change touches, and bump `packages/ui/package.json` if it ships in the package.

  **Finishing**
  7. Merge into `main`, push, then delete the branch (local and remote).
  8. One task, one branch. Follow-up work for the same task goes on the same branch. If a second branch already exists and both are unmerged, rebase it onto the first and continue there, so `main` never gets a half-consistent merge.

- **Pushing to `main` is allowed** (granted 2026-08-07, replacing the PR-only rule). It is allowed because step 5 is done, not instead of it. Never push a tree you haven't just verified, and never leave `main` red: if something lands broken, fix it forward immediately rather than waiting to be asked.

## Performance defaults

- Route-splitting is automatic — a heavy dep only loads on routes that import it.
- `next/dynamic` for heavy/client-only widgets (charts, command palette).
- Memoize only measured hot paths; keep `"use client"` small; fonts via `next/font`; images via `next/image`.
- Virtualize tables before rendering thousands of rows.
