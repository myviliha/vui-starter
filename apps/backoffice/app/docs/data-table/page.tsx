import type { Metadata } from "next";

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
  alternates: { canonical: "/docs/data-table/" },
  title: "Data table (RecordView)",
  description:
    "RecordView is Vui Starter's batteries-included data table: editable cells, sorting, filtering, pagination, row actions, a buffered add/edit panel, bulk actions, CSV/JSON/Excel/PDF import & export, and auto-aligned columns, all from one fields array.",
};

export default function DataTablePage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Data table (RecordView)"
        lead="RecordView is the component shadcn/ui leaves you to build yourself: a complete, themed admin data table driven by a single fields array. Point it at your data and editing, sorting, filtering, pagination, row actions, a buffered add/edit panel, bulk actions, and import/export all come for free."
      />

      <H2>Import</H2>
      <CodeBlock title="terminal">{`import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";`}</CodeBlock>
      <Note title="One component, many features">
        Editable cells · auto-sizing columns (opt-in resize) · sticky header · sort ·
        filter · column show/hide · pagination · row actions (view / edit /
        delete) · required-field markers · buffered add/edit form (slide-over or
        full-page) · bulk actions (set field / delete) · CSV / JSON / Excel / PDF
        import &amp; export · auto-aligned columns.
      </Note>

      <H2>Full example</H2>
      <P>
        Describe your columns in a <code>fields</code> array, pass your data, and
        wire up two small callbacks. That&apos;s the entire integration.
      </P>
      <CodeBlock title="organizations-table.tsx">{`"use client";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { Badge } from "@viliha/vui-ui/badge";

type Org = {
  id: number;
  name: string;
  domain: string;
  country: string;
  employees: number;
  status: "active" | "trial" | "suspended";
};

const fields: RecordField<Org>[] = [
  // hideInTable: shown only in the add/edit panel, used as the row title
  { key: "name", label: "Name", editable: true, required: true, hideInTable: true },
  { key: "domain", label: "Domain", editable: true, copyable: true },
  { key: "country", label: "Country", editable: true },
  // number → auto-centers
  { key: "employees", label: "Employees", editable: true },
  // options → "Set status" bulk action + a choice field
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "trial", label: "Trial" },
      { value: "suspended", label: "Suspended" },
    ],
    render: (row) => <Badge>{row.status}</Badge>,
  },
];

export function OrganizationsTable({ data }: { data: Org[] }) {
  return (
    <RecordView
      title="Organizations"
      singular="Organization"
      fields={fields}
      initialData={data}
      makeEmptyRow={() => ({
        id: Date.now(), name: "", domain: "", country: "",
        employees: 0, status: "trial",
      })}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.domain,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
    />
  );
}`}</CodeBlock>

      <H2>Props</H2>
      <Ul>
        <li><code>title</code>: plural page title (e.g. &quot;Organizations&quot;).</li>
        <li><code>singular</code>: used on the add button and dialogs (&quot;Organization&quot;).</li>
        <li><code>fields</code>: the column/field definitions (see below).</li>
        <li><code>initialData</code>: the rows (any array of objects with an <code>id</code>).</li>
        <li><code>makeEmptyRow</code>: returns a blank row for &quot;+ Add&quot;.</li>
        <li><code>getPrimary(row)</code>: returns <code>{`{ title, subtitle?, initials }`}</code> for the row&apos;s identity (avatar + panel header).</li>
        <li><code>icon</code>: optional page icon.</li>
        <li><code>formMode</code>: <code>&quot;panel&quot;</code> (default, slide-over) or <code>&quot;page&quot;</code> (full-page form). See form layouts below.</li>
        <li><code>formColumns</code>: <code>1</code> (default) or <code>2</code> field-group columns, in page mode.</li>
        <li><code>formDescription</code>: intro text for the page-form documentation panel.</li>
        <li><code>resizableColumns</code>: <code>false</code> by default (columns auto-size, no resize handle); set <code>true</code> to let users drag column edges.</li>
        <li><code>persistKey</code>: a stable key (e.g. the route) that persists the view&apos;s filter / sort / page and the add/edit draft to <code>sessionStorage</code>, so work survives leaving and returning via the open-tabs strip.</li>
        <li><code>onFilter(values)</code>: called from the Filter panel&apos;s Search / Clear when any field is <code>filterable</code> (see Filtering). Receives the per-field values; run your query or client-side filter here.</li>
        <li><code>loading</code>: while <code>true</code>, the table body shows shimmering skeleton rows (for an initial fetch or a refetch). The toolbar stays usable.</li>
        <li><code>fetcher</code> + <code>cacheKey</code>: server-side mode where RecordView owns the fetch, caching, and loading (see Server-side data). Optional <code>cache</code> (LRU tuning) and <code>onError</code>.</li>
        <li><code>manual</code> + <code>rowCount</code> + <code>onQueryChange</code>: the lower-level server mode — RecordView reports the query and you manage <code>data</code>/<code>loading</code> yourself.</li>
      </Ul>

      <H2>Field options</H2>
      <P>Each entry in <code>fields</code> is a <code>RecordField</code>:</P>
      <Ul>
        <li><code>key</code> / <code>label</code>: the data key and column header.</li>
        <li><code>editable</code>: inline-editable cell + shows in the add/edit panel.</li>
        <li><code>required</code>: marks the field with <code>*</code> (in the column header, including the primary Name column, and beside the form label) and validates on save.</li>
        <li><code>copyable</code>: a copy-to-clipboard button on hover.</li>
        <li><code>hideInTable</code>: keep it in the panel but not as a column.</li>
        <li><code>sortable</code>: decouple sorting from column visibility. Defaults to sortable when it&apos;s a visible column; set <code>true</code> to sort a field with no column (e.g. a <code>hideInTable</code> name shown via <code>getPrimary</code>), or <code>false</code> to keep a visible column unsortable.</li>
        <li><code>render(row)</code>: custom cell content (badges, formatted numbers…).</li>
        <li><code>description</code>: help text shown in the page-form documentation panel.</li>
        <li><code>options</code>: makes it a choice field and adds a &quot;Set {`{label}`}&quot; bulk action. Renders a <code>Select</code> in the form; add <code>input: &quot;combobox&quot;</code> for a searchable <code>Combobox</code> (long lists). A static array, or a <strong>function of the draft</strong> for dependent/cascading options (see below).</li>
        <li><code>input</code>: form control — <code>&quot;text&quot;</code> (default), <code>&quot;number&quot;</code>, <code>&quot;date&quot;</code>, or <code>&quot;combobox&quot;</code> (searchable, needs <code>options</code>).</li>
        <li><code>renderInput</code>: render a custom Add/Edit control (checkbox, radio group, anything). Overrides the default; you get <code>{`{ value, onChange, field, invalid }`}</code>.</li>
        <li><code>filterable</code>: expose the field in the Filter panel as a labeled control (see Filtering). <code>true</code> = text input; pass a config to choose the control.</li>
        <li><code>icon</code>: column-header icon.</li>
        <li><code>width</code>: initial column width (px). Columns auto-size by default; pass <code>resizableColumns</code> on <code>RecordView</code> to let users drag-resize them.</li>
        <li><code>align</code>: <code>&quot;left&quot;</code> / <code>&quot;center&quot;</code> / <code>&quot;right&quot;</code> (see below).</li>
      </Ul>

      <H3>Auto-aligned columns</H3>
      <P>
        Leave <code>align</code> off and columns align themselves from the data:{" "}
        <strong>numeric columns and short codes (all values ≤ 4 characters, e.g.
        &quot;USD&quot;, &quot;EN&quot;) center</strong>; everything else stays
        left. Set <code>align</code> explicitly to override.
      </P>
      <CodeBlock title="alignment">{`{ key: "employees", label: "Employees" }        // number → centered
{ key: "code", label: "Code" }                   // "USD","EUR" → centered
{ key: "name", label: "Name" }                   // long text → left
{ key: "total", label: "Total", align: "right" } // explicit override`}</CodeBlock>

      <H2>Sorting</H2>
      <P>
        Click a column header or use the Sort dropdown. Every sortable column
        shows a caret indicator — a muted up/down caret by default, then a solid
        caret for the active direction (up = ascending, down = descending). By
        default a field is sortable when it&apos;s a visible column;{" "}
        <code>sortable</code> decouples the two, so your sort set can differ from
        your column set (a non-sortable column shows no caret).
      </P>
      <CodeBlock title="sortable, independent of columns">{`{ key: "name", hideInTable: true, sortable: true }  // sorted, but no column
{ key: "code", label: "Code" }                      // column + sortable (default)
{ key: "notes", label: "Notes", sortable: false }   // column, but not sortable`}</CodeBlock>

      <H2>Filtering</H2>
      <P>
        By default the toolbar&apos;s Filter panel is a single keyword box that
        matches across every field (built in, nothing to wire). For a labeled
        control per field, mark fields <code>filterable</code>. When any field is
        filterable the panel switches to a control per field plus{" "}
        <strong>Search</strong> and <strong>Clear</strong>.
      </P>
      <P>
        The control is dynamic, so the front end composes a different filter form
        per screen: <code>filterable: true</code> is a text input, or pass a
        config to pick the control.
      </P>
      <CodeBlock title="per-field filters">{`const fields: RecordField<Region>[] = [
  { key: "name", label: "Name", filterable: true },                    // text input
  { key: "code", label: "Code", filterable: { control: "text",
                                              placeholder: "e.g. APAC" } },
  { key: "status", label: "Status", options: STATUS,                   // reuses options
    filterable: { control: "select" } },
  { key: "tags", label: "Tags",
    filterable: { control: "checkbox", options: TAGS } },              // → string[]
];`}</CodeBlock>
      <P>
        <code>control</code> is one of{" "}
        <code>&quot;text&quot; | &quot;number&quot; | &quot;date&quot; | &quot;select&quot; | &quot;combobox&quot; | &quot;checkbox&quot;</code>{" "}
        (unknown or omitted → text). <code>combobox</code> is a searchable
        single-select (type-to-filter) for long option lists; <code>select</code>{" "}
        is the plain dropdown. <code>options</code> is a static array or a{" "}
        <strong>function of the current filter values</strong> (cascading — see
        Cascading options), and falls back to the field&apos;s own{" "}
        <code>options</code>. The exported types are{" "}
        <code>FilterControl</code>, <code>FieldFilter</code>, and{" "}
        <code>FilterValues&lt;T&gt;</code>.
      </P>
      <Note variant="warning" title="Per-field mode doesn't match rows for you">
        The panel <strong>collects</strong> values; it does not filter the table
        in per-field mode. Handle <code>onFilter(values)</code> to run a query or
        your own client-side filter (Search and Clear both call it). The built-in
        keyword matching only applies when no field is <code>filterable</code>.
      </Note>
      <CodeBlock title="wire onFilter (server or client)">{`<RecordView
  fields={fields}
  data={rows}
  onDataChange={setRows}
  // values = { name: "asia", code: "AP", tags: ["eu","us"] }
  onFilter={(values) => refetch(values)}   // or filter client-side
/>`}</CodeBlock>
      <P>
        Live example: <code>system/regions</code> filters Name and Code
        client-side. To add a control kind not listed, extend the{" "}
        <code>FilterControl</code> union in the component.
      </P>

      <H2>Loading state</H2>
      <P>
        When rows come from a server, set <code>loading</code> while the request
        is in flight and the table body shows skeleton rows (matched to your
        columns) with a highlight <strong>shimmering left to right</strong> —
        instead of an empty &ldquo;No records&rdquo; flash. The toolbar stays
        usable. Clear it when the data arrives. The Markets demo simulates this on
        first load; the Data Table demo shows it on every server fetch.
      </P>
      <CodeBlock title="loading around a fetch">{`const [rows, setRows] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetch("/api/markets")
    .then((r) => r.json())
    .then(setRows)
    .finally(() => setLoading(false));
}, []);

<RecordView loading={loading} data={rows} onDataChange={setRows} /* … */ />`}</CodeBlock>

      <H2>Server-side data</H2>
      <P>
        By default RecordView does filtering, sorting, and pagination in the
        browser over the <code>data</code> you pass. For large tables that live on
        a server, there are two ways to go manual.
      </P>

      <H3>Let RecordView own the fetch (recommended)</H3>
      <P>
        Pass a <code>fetcher</code> and RecordView owns the whole read path: it
        calls your endpoint on every query change, manages{" "}
        <code>data</code> / <code>rowCount</code> / <code>loading</code>, and{" "}
        <strong>caches responses in memory</strong> under <code>cacheKey</code>{" "}
        (a module-scoped map that survives remounts) — so returning to a tab is
        served from memory with <strong>no server round-trip</strong>. Add{" "}
        <code>persistKey</code> and the page/sort/filters restore on remount and
        hit that cache. No <code>data</code>/<code>onQueryChange</code>/
        <code>loading</code> wiring. The shimmer still shows for a short minimum on
        every load (cache or server), so the feedback is consistent.
      </P>
      <CodeBlock title="fetcher + cacheKey">{`<RecordView
  fetcher={(query, signal) => fetch(url(query), { signal }).then((r) => r.json())}
  //     → resolves { rows, total }
  cacheKey="members"        // caches responses per query, survives tab switches
  persistKey="/members"     // restores page/sort/filters on return
  fields={fields}
  initialData={[]}
  /* … */
/>`}</CodeBlock>
      <Ul>
        <li>
          Superseded requests are aborted via the <code>signal</code>, and stale
          responses are ignored — no out-of-order flicker to handle yourself.
        </li>
        <li>
          Edits/adds/deletes update optimistically, invalidate the cache, and
          refetch the current query in the background.
        </li>
        <li>
          <code>cache=&#123;&#123; max, ttlMs &#125;&#125;</code> tunes the LRU;{" "}
          <code>onError</code> is called if a fetch rejects (the last data stays).
        </li>
      </Ul>

      <H3>Or manage it yourself (onQueryChange)</H3>
      <P>
        For full control, set <code>manual</code> instead: RecordView stops
        processing <code>data</code> (renders it as the current page verbatim) and{" "}
        <strong>reports the query</strong> via <code>onQueryChange</code> so your
        backend does the work. Pair it with <code>rowCount</code> (for the totals
        and page count) and <code>loading</code> (for the shimmer).
      </P>
      <Ul>
        <li>
          <code>onQueryChange(query)</code> fires on page, page-size, sort, and
          keyword changes (and once on mount for the initial load); per-field
          filters fire it on the Filter panel&apos;s <strong>Search / Clear</strong>.
        </li>
        <li>
          <code>query</code> is{" "}
          <code>{`{ page, pageSize, sort, search, filters }`}</code> —{" "}
          everything you need to build the request (<code>page</code> is 1-based).
        </li>
        <li>
          Feed the response back into <code>data</code> + <code>rowCount</code>,
          and toggle <code>loading</code> around the fetch.
        </li>
      </Ul>
      <CodeBlock title="server-side table">{`const [data, setData] = useState([]);
const [rowCount, setRowCount] = useState(0);
const [loading, setLoading] = useState(true);

const onQueryChange = useCallback((q) => {   // { page, pageSize, sort, search, filters }
  setLoading(true);
  fetchPage(q)                               // your API call
    .then(({ rows, total }) => { setData(rows); setRowCount(total); })
    .finally(() => setLoading(false));
}, []);

<RecordView
  manual
  rowCount={rowCount}
  loading={loading}
  onQueryChange={onQueryChange}
  data={data}
  onDataChange={setData}
  fields={fields}
  /* … */
/>`}</CodeBlock>
      <Note title="Guard against out-of-order responses">
        A fast user can fire several queries before earlier ones resolve. Track a
        request id (a <code>useRef</code> counter) and ignore a response whose id
        isn&apos;t the latest, so a slow earlier page doesn&apos;t overwrite a
        newer one. Debounce the fetch if keyword changes are chatty. The live{" "}
        <strong>Data Table</strong> demo (shadcn/ui section) does both against a
        simulated backend.
      </Note>
      <H3>Persisting across tab switches (no reload on return)</H3>
      <P>
        Keep-alive keeps a page mounted, but under the App Router an async page
        can still remount when you switch tabs — which would re-run the fetch and
        flash the shimmer. Make returning to the tab feel instant with two things:
      </P>
      <Ul>
        <li>
          <strong>Cache responses</strong> in a module-scoped <code>Map</code>{" "}
          keyed by the query (or your data layer&apos;s cache — React Query, SWR).
          A remount then finds the page in memory: serve it synchronously and skip
          the loading state, so there&apos;s no round-trip and no shimmer.
        </li>
        <li>
          Pass <code>persistKey</code> so the current page, sort, and filters
          survive the remount — <code>onQueryChange</code> fires with the restored
          query, hits the cache, and you land back on the exact same view.
        </li>
      </Ul>
      <CodeBlock title="cache + persistKey → instant return">{`const cache = new Map();   // module scope: survives remounts

const onQueryChange = useCallback((q) => {
  const hit = cache.get(key(q));
  if (hit) { setData(hit.rows); setRowCount(hit.total); setLoading(false); return; }
  setLoading(true);
  fetchPage(q).then((res) => { cache.set(key(q), res); /* setData… */ });
}, []);

<RecordView manual persistKey="/data-table" onQueryChange={onQueryChange} /* … */ />`}</CodeBlock>

      <H2>Add &amp; edit form layouts</H2>
      <P>
        Every RecordView comes with a buffered add/edit form: edits stay in a
        draft and commit only when you hit <strong>Save</strong>. The form is{" "}
        <strong>designed from your <code>fields</code> array</strong>. Each row
        aligns the label, icon, required <code>*</code>, and control on one
        baseline, and every bit of spacing and color comes from theme tokens, so
        you never style a field by hand. It renders in one of two layouts.
      </P>

      <H3>Form controls</H3>
      <P>
        Each field picks its control from the same <code>fields</code> array:{" "}
        <code>options</code> → a <code>Select</code>, plus{" "}
        <code>input: &quot;combobox&quot;</code> for a searchable{" "}
        <code>Combobox</code>, <code>input: &quot;number&quot; | &quot;date&quot;</code>{" "}
        for native inputs, else an auto-growing text area.
      </P>
      <P>
        Need something the built-ins don&apos;t cover — a checkbox, a radio group,
        a slider, a date-range, your own widget? Use <code>renderInput</code> to
        drop in <strong>any component</strong>. It overrides the default control;
        the field still owns the label, required mark, and Save validation. The
        Organizations form uses it to render Status as a radio group.
      </P>
      <CodeBlock title="custom control via renderInput">{`{
  key: "status",
  label: "Status",
  options: STATUS,                    // still used for View + bulk actions
  renderInput: ({ value, onChange, field }) => (
    <div role="radiogroup" aria-label={field.label} className="flex gap-4">
      {(field.options ?? []).map((o) => (
        <label key={o.value} className="flex items-center gap-1.5">
          <input type="radio" name={field.key}
            checked={value === o.value}
            onChange={() => onChange(o.value)} />
          {o.label}
        </label>
      ))}
    </div>
  ),
}`}</CodeBlock>

      <H3>Cascading (dependent) options</H3>
      <P>
        Make <code>options</code> a <strong>function</strong> and one field&apos;s
        choices depend on another. In the form it receives the live draft; in the
        filter it receives the current filter values. When the parent changes and
        the child&apos;s value is no longer valid, RecordView <strong>clears the
        child</strong> automatically — both in the Add/Edit form and the Filter.
        The Cities demo derives State from the selected Country in both.
      </P>
      <CodeBlock title="Country → State cascade">{`const statesFor = (country) =>
  [...new Set(cities.filter((c) => c.country === country).map((c) => c.state))]
    .map((s) => ({ value: s, label: s }));

const fields = [
  { key: "country", input: "combobox", options: COUNTRIES,
    filterable: { control: "select", options: COUNTRIES } },
  { key: "state", input: "combobox",
    options: (draft) => statesFor(draft.country),                 // form: from draft
    filterable: { control: "combobox",
      options: (values) => statesFor(values.country) } },         // filter: from values
];`}</CodeBlock>
      <Note title="renderInput + function options">
        If a field uses both a function <code>options</code> and{" "}
        <code>renderInput</code>, guard with{" "}
        <code>Array.isArray(field.options)</code> before mapping — inside{" "}
        <code>renderInput</code> you only get the field, not the draft, so a
        function isn&apos;t resolved for you there.
      </Note>

      <H3>Slide-over panel (default)</H3>
      <P>
        By default the form slides in from the right, over the table. There is
        nothing to configure.
      </P>

      <H3>Full-page form</H3>
      <P>
        Set <code>formMode=&quot;page&quot;</code> to render the form as a full
        page instead, with a breadcrumb bar, a padded bordered card, and a fixed
        Save/Cancel action bar. Use <code>formColumns</code> to arrange the field
        groups in one or two columns.
      </P>
      <CodeBlock title="page form">{`<RecordView formMode="page" formColumns={1} /* … */ />`}</CodeBlock>

      <H3>Field documentation panel</H3>
      <P>
        In page mode, add a <code>formDescription</code> intro and a{" "}
        <code>description</code> on any field, and the form gains an AWS-style
        help column alongside it.
      </P>
      <CodeBlock title="documentation panel">{`const fields = [
  { key: "email", label: "Email", editable: true,
    description: "Used for billing and account notices." },
];

<RecordView
  formMode="page"
  formDescription="Organizations are the top-level tenants in the system…"
  fields={fields}
  /* … */
/>`}</CodeBlock>

      <H3>Dedicated routes</H3>
      <P>
        To give the form its own URL (say <code>/organizations/new</code>),
        render the exported <code>RecordForm</code> on that route and have the
        table navigate to it. Pass <code>data</code> and{" "}
        <code>onDataChange</code> so the table and form share a single data
        source, and use <code>onCreate</code> / <code>onView</code> /{" "}
        <code>onEdit</code> to navigate rather than open the built-in overlay.
      </P>
      <CodeBlock title="routed create form">{`import { RecordForm } from "@viliha/vui-ui/record-view";

// table — navigate instead of opening the overlay
<RecordView
  data={rows}
  onDataChange={setRows}
  onCreate={() => router.push("/organizations/new")}
  onEdit={(id) => router.push(\`/organizations/edit?id=\${id}\`)}
  /* … */
/>

// /organizations/new/page.tsx
<RecordForm
  isNew
  fields={fields}
  row={emptyRow}
  singular="Organization"
  getPrimary={getPrimary}
  onSave={(row) => { addRow(row); router.push("/organizations"); }}
  onCancel={() => router.push("/organizations")}
/>`}</CodeBlock>
      <Note title="Consistent breadcrumbs">
        Both layouts and the rest of the app pages share a single{" "}
        <code>@viliha/vui-ui/breadcrumbs</code> component, so the trail, chevron,
        and back button look identical everywhere.
      </Note>

      <H2>Bulk actions</H2>
      <P>
        Check a few rows and an <strong>Actions</strong> menu appears in the
        toolbar, next to Filter. From there you can set any choice field across
        the selection (&quot;Set status → …&quot;) or delete the whole selection
        behind a confirm dialog. Any field with <code>options</code> joins the
        &quot;Set …&quot; list automatically.
      </P>

      <H2>Import &amp; export</H2>
      <P>
        The toolbar includes Import (CSV / JSON) and Export (CSV / JSON / Excel /
        PDF) out of the box. Both read the same <code>fields</code>, so there is
        nothing to configure.
      </P>

      <Note title="Layout">
        Drop <code>&lt;RecordView /&gt;</code> straight into a page. It renders
        its own action header (with breadcrumbs), toolbar, and padded, bordered
        card, following the{" "}
        <a href="/docs/layout" className="font-medium text-foreground underline">
          page layout
        </a>{" "}
        conventions without any extra work.
      </Note>

      <DocPager
        prev={{ label: "Components", href: "/docs/components" }}
        next={{ label: "Charts", href: "/docs/charts" }}
      />
    </article>
  );
}
