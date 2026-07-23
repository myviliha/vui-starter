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
    "RecordView is Vui Starter's batteries-included data table: editable cells, sorting, filtering, pagination, row actions, a buffered add/edit panel, bulk actions, CSV/JSON/Excel/PDF import & export, and auto-aligned columns — all from one fields array.",
};

export default function DataTablePage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Data table (RecordView)"
        lead="RecordView is the one component shadcn/ui doesn't give you: a complete, themed admin data table driven by a single fields array. Point it at your data and you get editing, sorting, filtering, pagination, row actions, a buffered add/edit panel, bulk actions, and import/export — no wiring required."
      />

      <H2>Import</H2>
      <CodeBlock title="terminal">{`import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";`}</CodeBlock>
      <Note title="One component, many features">
        Editable cells · resizable + auto-sizing columns · sticky header · sort ·
        filter · column show/hide · pagination · row actions (view / edit /
        delete) · required-field markers · buffered add/edit form (slide-over or
        full-page) · bulk actions (set field / delete) · CSV / JSON / Excel / PDF
        import &amp; export · auto-aligned columns.
      </Note>

      <H2>Full example</H2>
      <P>
        Describe your columns with a <code>fields</code> array, pass your data,
        and provide two small callbacks. That&apos;s the whole integration.
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
        <li><code>title</code> — plural page title (e.g. &quot;Organizations&quot;).</li>
        <li><code>singular</code> — used on the add button and dialogs (&quot;Organization&quot;).</li>
        <li><code>fields</code> — the column/field definitions (see below).</li>
        <li><code>initialData</code> — the rows (any array of objects with an <code>id</code>).</li>
        <li><code>makeEmptyRow</code> — returns a blank row for &quot;+ Add&quot;.</li>
        <li><code>getPrimary(row)</code> — returns <code>{`{ title, subtitle?, initials }`}</code> for the row&apos;s identity (avatar + panel header).</li>
        <li><code>icon</code> — optional page icon.</li>
        <li><code>formMode</code> — <code>&quot;panel&quot;</code> (default, slide-over) or <code>&quot;page&quot;</code> (full-page form). See form layouts below.</li>
        <li><code>formColumns</code> — <code>1</code> (default) or <code>2</code> field-group columns, in page mode.</li>
        <li><code>formDescription</code> — intro text for the page-form documentation panel.</li>
      </Ul>

      <H2>Field options</H2>
      <P>Each entry in <code>fields</code> is a <code>RecordField</code>:</P>
      <Ul>
        <li><code>key</code> / <code>label</code> — the data key and column header.</li>
        <li><code>editable</code> — inline-editable cell + shows in the add/edit panel.</li>
        <li><code>required</code> — marks the field with <code>*</code> (in the column header, including the primary Name column, and beside the form label) and validates on save.</li>
        <li><code>copyable</code> — a copy-to-clipboard button on hover.</li>
        <li><code>hideInTable</code> — keep it in the panel but not as a column.</li>
        <li><code>render(row)</code> — custom cell content (badges, formatted numbers…).</li>
        <li><code>description</code> — help text shown in the page-form documentation panel.</li>
        <li><code>options</code> — makes it a choice field and adds a &quot;Set {`{label}`}&quot; bulk action.</li>
        <li><code>icon</code> — column-header icon.</li>
        <li><code>width</code> — initial column width (px); columns are also user-resizable.</li>
        <li><code>align</code> — <code>&quot;left&quot;</code> / <code>&quot;center&quot;</code> / <code>&quot;right&quot;</code> (see below).</li>
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

      <H2>Add &amp; edit form layouts</H2>
      <P>
        Every RecordView includes a buffered add/edit form — edits are held in a
        draft and only committed on <strong>Save</strong>. The form is{" "}
        <strong>designed from your <code>fields</code> array</strong>: each row
        centers the label, icon, required <code>*</code> and control on one
        baseline, with all spacing and color from theme tokens — you never style
        a field by hand. It renders in one of two layouts.
      </P>

      <H3>Slide-over panel (default)</H3>
      <P>
        By default the form opens as a right-hand slide-over panel over the
        table — nothing to configure.
      </P>

      <H3>Full-page form</H3>
      <P>
        Set <code>formMode=&quot;page&quot;</code> to render the form as a full
        page instead: a breadcrumb bar, a padded bordered card, and a fixed
        Save/Cancel action bar. Use <code>formColumns</code> to lay the field
        groups in one or two columns.
      </P>
      <CodeBlock title="page form">{`<RecordView formMode="page" formColumns={1} /* … */ />`}</CodeBlock>

      <H3>Field documentation panel</H3>
      <P>
        In page mode, add a <code>formDescription</code> intro and a{" "}
        <code>description</code> on any field to show an AWS-style help column
        beside the form.
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
        To put the form on its own URL (e.g. <code>/organizations/new</code>),
        render the exported <code>RecordForm</code> on the route and let the
        table navigate to it. Pass <code>data</code> + <code>onDataChange</code>{" "}
        so the table and form share one data source, and{" "}
        <code>onCreate</code> / <code>onView</code> / <code>onEdit</code> to
        navigate instead of opening the built-in overlay.
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
        Both layouts and the app pages share one{" "}
        <code>@viliha/vui-ui/breadcrumbs</code> component, so the trail, chevron,
        and back button look identical everywhere.
      </Note>

      <H2>Bulk actions</H2>
      <P>
        Select rows via the checkboxes and an <strong>Actions</strong> menu
        appears in the toolbar (next to Filter): set any choice field
        (&quot;Set status → …&quot;) across the selection, or delete the
        selection with a confirm dialog. Give a field <code>options</code> to add
        it to the &quot;Set …&quot; list.
      </P>

      <H2>Import &amp; export</H2>
      <P>
        The toolbar ships Import (CSV / JSON) and Export (CSV / JSON / Excel /
        PDF) — no configuration, they read the same <code>fields</code>.
      </P>

      <Note title="Layout">
        Drop <code>&lt;RecordView /&gt;</code> straight into a page — it renders
        its own action header (with breadcrumbs), toolbar, and a padded, bordered
        card, matching the{" "}
        <a href="/docs/layout" className="font-medium text-foreground underline">
          page layout
        </a>{" "}
        conventions automatically.
      </Note>

      <DocPager
        prev={{ label: "Components", href: "/docs/components" }}
        next={{ label: "Charts", href: "/docs/charts" }}
      />
    </article>
  );
}
