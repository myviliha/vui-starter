import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/templates/" },
  title: "Requirement templates",
  description:
    "Copy-paste requirement templates for briefing an AI agent to build with Vui Starter — components, pages, features and multi-step workflows — so the first pass lands on the design system instead of around it.",
};

export default function TemplatesPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Requirement templates"
        lead="How you brief the agent decides how close the first pass lands. These are fill-in-the-blank templates for the things you'll ask for most — a component, a page, a feature, a workflow. Copy one, replace the angle-bracket blanks, and paste it to an agent that has loaded the VUI guide."
      />

      <H2>Before you start</H2>
      <P>
        Point your agent at the shipped guide first (it encodes the rules these
        templates lean on): copy{" "}
        <code>node_modules/@viliha/vui-ui/CLAUDE.template.md</code> to your repo
        as <code>CLAUDE.md</code> or <code>AGENTS.md</code>. Then every template
        below can stay short — you name <em>what</em> and <em>where</em>, the
        guide supplies the <em>how</em> (tokens, page types, RecordView, a11y).
      </P>
      <Note title="The six things every good requirement names">
        <strong>What</strong> (the outcome) · <strong>Where</strong> (route /
        file / nav) · <strong>Reuse</strong> (which VUI pieces to build on) ·{" "}
        <strong>Data</strong> (shape + source) · <strong>States</strong>{" "}
        (loading / empty / success / error) · <strong>Done-when</strong> (the
        acceptance checklist). Leave one out and the agent guesses.
      </Note>

      <Note title="Copy any template">
        Every code block below has a <strong>Copy</strong> button (top-right) —
        copy a template, paste it to your agent, fill the blanks. For a full
        CRUD entity there is a bigger, ready-to-save spec:{" "}
        <a
          href="/templates/feature-requirement.md"
          download
          className="font-medium text-foreground underline"
        >
          download <code>feature-requirement.md</code>
        </a>{" "}
        and drop it in your repo (Resource info → Screens/page-type → Fields →
        API contract → Test matrix → Business rules → Definition of done).
      </Note>

      <H2>1 · New component</H2>
      <P>For a reusable UI primitive that belongs in the library.</P>
      <CodeBlock title="requirement — component">{`Build a reusable component: <Name>

Purpose:    <one line — what it renders / does>
Location:   packages/ui/src/<name>.tsx  (auto-exported as @viliha/vui-ui/<name>)
Props:      # the public API
  - <prop>: <type> — <meaning> (required? default?)
Variants:   <e.g. primary | secondary — or "none">
Sizes:      <sm | md | lg — or "none">
States:     <hover, focus, disabled, loading, empty, error — whichever apply>
Rendering:  <Server Component by default; "use client" only if it needs
             hooks / events / browser APIs — keep the boundary on the leaf>
Design:     theme tokens only (no hard-coded color / spacing / radius);
             match the look of the existing components.

Done when: typed (no \`any\`), tokenized, light + dark, accessible
(keyboard + visible focus + ARIA), lint + types pass.`}</CodeBlock>

      <H2>2 · New page</H2>
      <P>
        For a screen in the admin app. First decide the{" "}
        <a
          href="/docs/layout"
          className="font-medium text-foreground underline"
        >
          page type
        </a>{" "}
        — that choice drives everything else.
      </P>
      <CodeBlock title="requirement — page">{`Add a page: <Title>

Page type:  <data table | record form | dashboard | settings | board>   # pick one
Route:      apps/backoffice/app/(app)/<route>/page.tsx
Nav:        add to nav-config.ts under section "<Section>" with icon <Icon>
             (sidebar + breadcrumbs follow automatically)
Data:       <where rows/records come from — a mock module now, your API later>

# If it's a DATA TABLE / RECORD FORM, list the fields (become RecordField[]):
Fields:
  - <key>: <label> — <text | number | badge | select> (required? copyable?
            hideInTable? options=[…]?)
Add/Edit/View: <slide-over (default) | full-page route>
Info panel:    <per-field help text?  formDescription intro?>
Actions:       <row actions, bulk actions, import/export?>

Done when: follows the page frame, uses RecordView/RecordForm (never a
hand-rolled table or form), tokens, light + dark, a11y, lint + types + build pass.`}</CodeBlock>

      <H2>3 · New feature / functionality</H2>
      <P>
        For a capability that isn&apos;t a single page — a command palette, a
        bulk importer, a notifications tray.
      </P>
      <CodeBlock title="requirement — feature">{`Implement: <feature name>

Goal:        <the outcome, in one sentence>
Where:       <route(s) / component(s) / a provider in app/_components>
Reuse first: <which existing VUI pieces — RecordView, Dialog, Menu,
              CommandPalette, ChartContainer — build on these, don't reinvent>
Behavior:    <the rules — triggers, inputs, outputs, edge cases>
States:      loading / empty / success / error  (all required)
Data:        <local state | a store | sessionStorage | your API>
Out of scope: <what NOT to build, so it stays focused>

Done when: reuses existing components (no duplicate UI), tokens, a11y,
every state handled, lint + types + build pass.`}</CodeBlock>

      <H2>4 · Multi-step workflow</H2>
      <P>
        For a guided, multi-screen flow. Describe it step by step — the agent
        turns each step into a screen built from existing blocks.
      </P>
      <CodeBlock title="requirement — workflow">{`Implement a workflow: <name>

Steps (in order):
  1. <step> — route <…>, inputs <…>, validation <…>, primary action <…>
  2. <step> — …
Entry point:       <where the user starts>
Success end state: <where they land + what record(s) get created/updated>
Back / cancel:     <how each step handles going back and cancelling>
Errors:            <inline validation + failure handling per step>
Data model:        <the record(s) + fields the flow produces>
Building blocks:   <RecordForm | Dialog | AuthCard | a stepper — per step>

Done when: each step has loading/error/success, validation (Zod), tokens,
light + dark, a11y, lint + types + build pass.`}</CodeBlock>

      <H3>Worked example — customer signup</H3>
      <P>The same template, filled in. This is the level of detail to aim for:</P>
      <CodeBlock title="requirement — customer signup workflow">{`Implement a workflow: Customer signup

Steps (in order):
  1. Account   — route /auth/signup: Name*, Email*, Password*
                 (Zod: valid email, password >= 8). Primary "Create account".
  2. Verify    — route /auth/verify: 6-digit code + "Resend". On success -> step 3.
  3. Company   — route /onboarding: full-page RecordForm, fields
                 Company name*, Domain, Country, Size. Primary "Finish".
  4. Done      — redirect to /dashboard with a welcome toast.
Entry point:       "Sign up" link on /auth/signin.
Success end state: a Customer + Organization record created; land on /dashboard.
Back / cancel:     Back returns to the previous step keeping input;
                   Cancel returns to /auth/signin.
Errors:            inline field errors; a failed verify keeps the code screen.
Data model:        Customer { name, email }, Organization { name, domain,
                   country, size }.
Building blocks:   AuthCard for steps 1-2 (copy app/_components/auth.tsx),
                   RecordForm formMode="page" for step 3.

Done when: every step has loading/error/success, Zod validation, tokens,
light + dark, a11y, lint + types + build pass.`}</CodeBlock>

      <Note title="Specificity beats length">
        You don&apos;t need long prose — you need the blanks filled. A field
        list, a page type, and a done-when checklist get you a first pass that
        already looks like VUI. Vague requirements get vague components.
      </Note>

      <DocPager
        prev={{ label: "Building with AI agents", href: "/docs/ai-agents" }}
        next={{ label: "Using shadcn/ui", href: "/docs/shadcn-ui" }}
      />
    </article>
  );
}
