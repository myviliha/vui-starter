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
  alternates: { canonical: "/docs/form-layout/" },
  title: "Form Layout",
  description:
    "Design a Vui Starter form by declaring it: how many columns the sections flow across and how many columns the fields flow across inside each section. Labels always sit beside their controls, and everything aligns automatically.",
};

export default function FormLayoutPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Form Layout"
        lead="You design a form by declaring it, not by writing CSS. Say how many columns the sections take and how many columns the fields take inside each section. A label always sits beside its control, and the alignment is handled for you."
      />

      <H2>How is a form put together?</H2>
      <P>
        Three levels, and you configure each one with a single setting. Read it
        from the outside in:
      </P>
      <CodeBlock title="the model">{`Form                 a grid of section cards
└─ sectionColumns: 1 | 2 | 3     how many cards fit across; rows wrap as needed
   └─ Section card               span: 1 | 2 | 3 | "full"
      └─ always two columns, one field per row:

         ┌──────────────────────┬──────────────────────────┐
         │ [i]  Label        *  │  [ control              ]│   row 1
         │ [i]  Label           │  [ control              ]│   row 2
         │      Label        *  │  [ control              ]│   row 3
         └──────────────────────┴──────────────────────────┘
           tooltip · label · *          the control

A label and its control are never stacked. The eye runs along one line
from the name to the box, and every control in a card starts at the same x.`}</CodeBlock>
      <P>
        A field belongs to a section through its <code>group</code>. That is the
        only wiring: put the same <code>group</code> on some fields and they
        share a card.
      </P>

      <H2>How do I lay out an Add Order form?</H2>
      <P>
        Declare the sections. This puts Customer and Delivery side by side and
        gives Items the full width because its fields are long. Inside every
        card the fields stack down in one column of label │ control rows.
      </P>
      <CodeBlock title="order-form.tsx">{`const sections = [
  { group: "Customer" },
  { group: "Delivery" },
  { group: "Items", span: "full" },
];

const fields: RecordField<Order>[] = [
  { key: "customer", label: "Customer", group: "Customer", editable: true, required: true,
    description: "Who the invoice goes to, not who receives the parcel." },
  { key: "poNumber", label: "PO number", group: "Customer", editable: true },

  { key: "address", label: "Address", group: "Delivery", editable: true, required: true },
  { key: "dueAt", label: "Due date", group: "Delivery", editable: true, input: "date" },

  { key: "notes", label: "Notes", group: "Items", editable: true },
];

<RecordView
  title="Orders"
  singular="Order"
  sectionColumns={2}      // Customer and Delivery side by side
  sections={sections}
  fields={fields}
  /* … */
/>`}</CodeBlock>

      <H2>What each setting does</H2>
      <H3>sectionColumns</H3>
      <P>
        How many section cards sit across the form: <code>1</code> (the
        default), <code>2</code> or <code>3</code>. Cards wrap onto as many rows
        as they need and collapse to one column on a small screen, so a
        three-column form steps through two on the way down. A trailing card
        that would leave a gap stretches to fill its row, so an odd number of
        sections doesn&apos;t end in white space. Declaring any{" "}
        <code>span</code> turns that off, since you are then placing the cards
        yourself.
      </P>
      <H3>sections</H3>
      <P>
        Optional. Without it, sections come from the fields&apos;{" "}
        <code>group</code> values in the order those groups first appear.
        Declare it when you want to fix that order, or to give a section:
      </P>
      <Ul>
        <li>
          <code>span</code>: how many columns the card takes.{" "}
          <code>&quot;full&quot;</code> gives it the whole row, which is what a
          card of long fields wants.
        </li>
        <li>
          <code>description</code>: a line under the title saying what the
          section is for.
        </li>
      </Ul>
      <P>
        A declared section with no fields in it is skipped, and a{" "}
        <code>group</code> you forgot to declare is appended rather than
        dropped, so adding a field can never make it disappear.
      </P>
      <H3>Inside a card</H3>
      <P>
        Not configurable, on purpose. Every card is two columns and one field per
        row: the tooltip, label and required mark on the left, the control on the
        right. A form gets wider by putting cards side by side, not by cramming
        fields into a row, which is what keeps two screens built by two people
        looking like one product.
      </P>

      <Note title="You never align anything yourself">
        The label column is sized to its content, so it widens to the longest
        label in that card and never wraps, and every control in the card starts
        at the same x. Hairlines sit between the two columns and between the
        rows, light enough to read the grid without drawing the eye. Card grids
        collapse to one column on small screens.
      </Note>

      <H2>How do I explain a field to whoever fills it in?</H2>
      <P>
        Give the field a <code>description</code>. An info icon appears before
        its label, and hovering shows the text:{" "}
        <code>[i] Label * [control]</code>. It shows wherever the field renders,
        including a slide-over, and full-page forms also collect these into the
        Info panel beside the form.
      </P>
      <P>
        Write it as an instruction rather than a definition. It is read with the
        cursor already in the box, so &quot;The name on the invoice, not the
        trading name&quot; helps and &quot;The customer name&quot; does not.
      </P>

      <H2>Setting a house style once</H2>
      <P>
        Every setting here is also config, so an app can decide its form style
        in one place and a screen can still differ where it needs to:
      </P>
      <CodeBlock title="app/(app)/layout.tsx">{`<VuiProvider
  config={{ form: { sectionColumns: 2 } }}
>
  {children}
</VuiProvider>`}</CodeBlock>
      <P>
        Values resolve per-instance prop → provider config → package default, so
        a prop on one <code>RecordView</code> always wins.
      </P>

      <Note title="sectionColumns is not formColumns">
        <code>formColumns</code> is an older setting on full-page forms that
        flows sections into two columns; it still works and{" "}
        <code>sectionColumns</code> supersedes it, and it works in the
        slide-over too rather than only on full-page forms. Don&apos;t set
        both.
      </Note>

      <H2>Is there a template I can hand to an agent?</H2>
      <P>
        Yes:{" "}
        <a href="/templates/form.md" className="font-medium text-foreground underline">
          form.md
        </a>{" "}
        on the <a href="/docs/templates/" className="font-medium text-foreground underline">Templates</a>{" "}
        page. Copy it, fill in the record, the cards and the fields, and hand it
        over. It only asks what you actually decide: the layout questions are
        already answered here, so a filled-in template plus this page is enough
        for an agent to build the form without guessing.
      </P>

      <DocPager
        prev={{ label: "Layouts", href: "/docs/layout" }}
        next={{ label: "Navigation", href: "/docs/navigation" }}
      />
    </article>
  );
}
