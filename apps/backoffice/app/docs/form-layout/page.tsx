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
      <CodeBlock title="the model">{`Form
└─ Rows           you declare them: as many as you want
   └─ Sections    each row says how many sit side by side: 1, 2 or 3
      └─ Fields   always two columns, one field per row:

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
        Say it in rows. &quot;One column, two rows: two sections on top, three
        underneath&quot; is the declaration, more or less word for word.
      </P>
      <CodeBlock title="what you are describing">{`ROW 1  ── two sections ───────────────────────────────────────────
┌── Customer ──────────────────┐  ┌── Delivery ──────────────────┐
│ [i] Full Name  * │ [_______] │  │ [i] Address  * │ [_______]   │
│ ─────────────────┼────────── │  │ ───────────────┼──────────   │
│     Email      * │ [_______] │  │     City       │ [_______]   │
└──────────────────┴───────────┘  └────────────────┴─────────────┘

ROW 2  ── three sections ─────────────────────────────────────────
┌── Items ─────────┐ ┌── Payment ───────┐ ┌── Notes ─────────┐
│ [i] SKU * │ [__] │ │ [i] Method│ [__] │ │     Note  │ [__] │
│ ──────────┼───── │ │ ──────────┼───── │ │           │      │
│     Qty   │ [__] │ │     Terms │ [__] │ │           │      │
└───────────┴──────┘ └───────────┴──────┘ └───────────┴──────┘

[ Cancel ]  [ Save ]   ← always pinned; the rows above scroll`}</CodeBlock>
      <CodeBlock title="order-form.tsx">{`const fields: RecordField<Order>[] = [
  { key: "fullName", label: "Full Name", group: "Customer", editable: true, required: true,
    description: "Who the invoice goes to, not who receives the parcel." },
  { key: "email", label: "Email", group: "Customer", editable: true, required: true, format: "email" },

  { key: "address", label: "Address", group: "Delivery", editable: true, required: true },
  { key: "city", label: "City", group: "Delivery", editable: true },

  { key: "sku", label: "SKU", group: "Items", editable: true, required: true },
  { key: "qty", label: "Qty", group: "Items", editable: true, input: "number" },

  { key: "method", label: "Method", group: "Payment", editable: true, options: PAYMENT_METHODS },
  { key: "terms", label: "Terms", group: "Payment", editable: true },

  { key: "note", label: "Note", group: "Notes", editable: true },
];

<RecordView
  title="Orders"
  singular="Order"
  fields={fields}
  formRows={[
    { sections: [{ group: "Customer" }, { group: "Delivery" }] },
    { sections: [{ group: "Items" }, { group: "Payment" }, { group: "Notes" }] },
  ]}
  /* … */
/>`}</CodeBlock>
      <P>
        A field joins a card by sharing its <code>group</code>. That is the only
        wiring, and it is why the rows list only ever names groups.
      </P>

      <H2>What each setting does</H2>
      <H3>formRows</H3>
      <P>
        The form&apos;s rows, in order. Each row lists the sections that sit side
        by side on it. One section on a row fills the row, so nothing needs a
        width: a card&apos;s width is just how many share its row.
      </P>
      <Ul>
        <li>
          <strong>Three to a row is the most that stays readable.</strong> Past
          that the label column starts squeezing the control, so a fourth wraps
          onto the next line within the row.
        </li>
        <li>
          A section with no fields is dropped, and its row with it if that
          empties the row.
        </li>
        <li>
          A group you forgot to place gets a full-width row at the end rather
          than disappearing, so adding a field can never lose it.
        </li>
        <li>
          Omit <code>formRows</code> entirely and every section gets its own
          full-width row, which is how forms looked before this existed.
        </li>
      </Ul>
      <H3>Section options</H3>
      <P>
        A section is <code>{`{ group }`}</code> plus an optional{" "}
        <code>description</code>, a line under the title saying what the card is
        for. Nothing else: order and width both come from the rows.
      </P>
      <H3>Inside a card</H3>
      <P>
        Not configurable, on purpose. Every card is two columns and one field per
        row: the tooltip, label and required mark on the left, the control on the
        right. A form gets wider by adding sections to a row, not by cramming
        fields into one, which is what keeps two screens built by two people
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
        Rows belong to a form, because they name that form&apos;s sections. What
        an app can set once is how forms behave, like where a validation message
        appears:
      </P>
      <CodeBlock title="app/(app)/layout.tsx">{`<VuiProvider
  config={{ form: { errorDisplay: "tooltip" } }}
>
  {children}
</VuiProvider>`}</CodeBlock>
      <P>
        Values resolve per-instance prop → provider config → package default, so
        a prop on one <code>RecordView</code> always wins.
      </P>

      <H2>Where do validation errors show?</H2>
      <P>
        On the field, not under it. A failing control gets a red border and its
        message moves onto the info icon, so hovering shows what is wrong. The
        message is not printed as a line of text under the control and never as
        a toast: text under a control pushes the rest of the form down while
        someone is still typing in it, and a toast is gone before they look.
      </P>
      <P>
        This is the default across the package. Set{" "}
        <code>{`form: { errorDisplay: "text" }`}</code> on{" "}
        <code>VuiProvider</code> for the old behaviour. Either way the message is
        also announced to screen readers, since a border colour and a hover
        aren&apos;t available to everyone.
      </P>

      <Note title="Older props still work">
        <code>sectionColumns</code> and <code>sections[].span</code> are
        deprecated as of 1.59 and still honoured: they force one column count on
        the whole form, which is exactly what rows exist to fix. Migrate by
        writing the rows you actually want. <code>formColumns</code> on a
        full-page form keeps working too.
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
