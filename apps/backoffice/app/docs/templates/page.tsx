import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { DocPager, H2, H3, Note, P, PageTitle } from "@/components/doc";
import { TemplateBlock } from "@/components/template-block";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/templates/" },
  title: "Requirement templates",
  description:
    "Copy- or download-ready requirement templates for briefing an AI agent to build with Vui Starter — component, page, feature, multi-step workflow, and a full CRUD entity — so the first pass lands on the design system instead of around it.",
};

/** Read a template file at build time so the .md stays the single source. */
function tmpl(name: string): string {
  return readFileSync(join(process.cwd(), "public/templates", name), "utf8");
}

export default function TemplatesPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Requirement templates"
        lead="How you brief the agent decides how close the first pass lands. Each template below has a Copy button and a Download button — grab the .md, drop it in your repo, fill in the angle-bracket blanks, and paste it to an agent that has loaded the VUI guide. Every template ends with happy and unhappy test scenarios, so the agent builds the tests alongside the feature."
      />

      <H2>Before you start</H2>
      <P>
        Point your agent at the shipped guide first — it encodes the rules these
        templates lean on. Copy{" "}
        <code>node_modules/@viliha/vui-ui/CLAUDE.template.md</code> into your repo
        as <code>CLAUDE.md</code> or <code>AGENTS.md</code>. With that in place,
        every template below can stay short: you name <em>what</em> and{" "}
        <em>where</em>, and the guide supplies the <em>how</em> — tokens, page
        types, RecordView, and accessibility.
      </P>
      <Note title="The six things every good requirement names">
        <strong>What</strong> (the outcome) · <strong>Where</strong> (route /
        file / nav) · <strong>Reuse</strong> (which VUI pieces to build on) ·{" "}
        <strong>Data</strong> (shape + source) · <strong>States</strong>{" "}
        (loading / empty / success / error) · <strong>Done-when</strong> (the
        acceptance checklist). Leave one out, and the agent has to guess.
      </Note>

      <H2>1 · New component</H2>
      <P>For a reusable UI primitive that belongs in the library.</P>
      <TemplateBlock filename="component.md" content={tmpl("component.md")} />

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
      <TemplateBlock filename="page.md" content={tmpl("page.md")} />

      <H2>3 · New feature / functionality</H2>
      <P>
        For a capability that spans more than a single page — a command palette,
        a bulk importer, a notifications tray.
      </P>
      <TemplateBlock filename="feature.md" content={tmpl("feature.md")} />

      <H2>4 · Multi-step workflow</H2>
      <P>
        For a guided, multi-screen flow. Describe it one step at a time, and the
        agent turns each step into a screen built from existing blocks.
      </P>
      <TemplateBlock filename="workflow.md" content={tmpl("workflow.md")} />
      <H3>Worked example — customer signup</H3>
      <P>The same template, filled in — this is the level of detail to aim for.</P>
      <TemplateBlock
        filename="customer-signup.md"
        content={tmpl("customer-signup.md")}
      />

      <H2>5 · Full feature (CRUD entity)</H2>
      <P>
        The complete brief for a full resource — screens, fields, API contract,
        test matrix, business rules, and happy and unhappy{" "}
        <strong>test scenarios</strong>, all in one file. It&apos;s generalized
        from a real PRD: fill it in and an agent can design the UI/UX{" "}
        <em>and</em> implement it. Read it below, or copy or download the{" "}
        <code>.md</code> straight into your repo.
      </P>
      <TemplateBlock
        filename="feature-requirement.md"
        content={tmpl("feature-requirement.md")}
      />

      <H2>6 · Worked example — Calendar page</H2>
      <P>
        A filled-in <a href="/docs/layout" className="font-medium text-foreground underline">page</a>{" "}
        brief for the appointments{" "}
        <a href="/docs/calendar" className="font-medium text-foreground underline">Calendar</a>{" "}
        (Month/Week/Day, AM/PM hour grid, color labels, add dialog). Use it as
        the shape to aim for when you brief a rich screen.
      </P>
      <TemplateBlock filename="calendar.md" content={tmpl("calendar.md")} />

      <H2>7 · Worked example — Chat (ChatGPT-style)</H2>
      <P>
        A filled-in brief for the{" "}
        <a href="/docs/chat" className="font-medium text-foreground underline">Chat</a>{" "}
        assistant — centered thread, auto-growing composer, and image/file
        attachments with preview and remove.
      </P>
      <TemplateBlock filename="chat.md" content={tmpl("chat.md")} />

      <H2>8 · Worked example — Support &amp; ticketing</H2>
      <P>
        A filled-in brief for the{" "}
        <a href="/docs/support" className="font-medium text-foreground underline">Support</a>{" "}
        desk — a ticket queue with status/priority, a detail pane, and a reply
        thread.
      </P>
      <TemplateBlock filename="support.md" content={tmpl("support.md")} />

      <Note title="Specificity beats length">
        You don&apos;t need long prose — you need the blanks filled. A field
        list, a page type, and a done-when checklist get you a first pass that
        already looks like VUI. Vague requirements get you vague components.
      </Note>

      <DocPager
        prev={{ label: "Building with AI agents", href: "/docs/ai-agents" }}
        next={{ label: "Using shadcn/ui", href: "/docs/shadcn-ui" }}
      />
    </article>
  );
}
