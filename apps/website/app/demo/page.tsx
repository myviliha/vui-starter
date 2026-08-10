import { CardGrid, CodeBlock, Cta, Faq, Hero, ProcessSteps, TrustBadges } from "@viliha/vui-web";

import { FAQS, STEPS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Demo",
  description:
    "Open the live VUI admin demo: real datatables, record forms, charts, a command palette and auth screens, with no signup and nothing to install.",
  path: "/demo/",
});

const DEMO = "https://vui.viliha.com";

/** The screens worth opening first, in the order they answer the obvious
 *  questions: does the list work, does the form work, does it look like ours. */
const SCREENS = [
  {
    title: "Datatable",
    body: "Sort, filter per field, select rows, run a bulk action and export. The same screen in server mode hands the query to an API.",
    meta: "Organizations",
    href: `${DEMO}/organizations/`,
  },
  {
    title: "Record form",
    body: "Add and edit as a slide-over, generated from the same field definitions the table uses.",
    meta: "Departments",
    href: `${DEMO}/departments/`,
  },
  {
    title: "Full-page form",
    body: "The long variant: its own route, a dynamic info panel, and a fixed save footer.",
    meta: "New organization",
    href: `${DEMO}/organizations/new/`,
  },
  {
    title: "Dashboard",
    body: "Stat cards and charts reading the theme tokens, so they repaint with the brand and follow dark mode.",
    meta: "Home",
    href: `${DEMO}/dashboard/`,
  },
  {
    title: "Theme settings",
    body: "Change colour, radius, density, sidebar layout and reading direction, and watch the whole app follow.",
    meta: "Settings",
    href: `${DEMO}/settings/`,
  },
  {
    title: "Auth and error screens",
    body: "Sign in, sign up, password reset, and the 401, 403, 404, 500 and maintenance pages, all on one shell.",
    meta: "Sign in",
    href: `${DEMO}/auth/signin/`,
  },
];

const INSTALL = [
  {
    name: "Terminal",
    language: "bash",
    code: `# Scaffold a new project with the demo app included
npx @viliha/vui-ui init my-admin

cd my-admin
pnpm install
pnpm dev`,
  },
  {
    name: "Existing project",
    language: "bash",
    code: `# Add the library to a project you already have
pnpm add @viliha/vui-ui

# Import the theme once, at the root of your app
# app/globals.css
@import "@viliha/vui-ui/theme.css";`,
  },
  {
    name: "First screen",
    language: "tsx",
    code: `import { RecordView } from "@viliha/vui-ui/record-view";

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "country", label: "Country", filterable: true },
];

export default function Customers() {
  return <RecordView title="Customers" fields={fields} data={rows} />;
}`,
  },
];

export default function DemoPage() {
  return (
    <>
      <Hero
        variant="product"
        pattern="grid"
        eyebrow="Live demo"
        title="See it running"
        lead="A complete back office with real datatables, record forms, charts, a command palette and auth screens. Nothing to install and no account to create."
        actions={
          <>
            <LinkButton href={`${DEMO}/dashboard/`}>Open the live demo</LinkButton>
            <LinkButton href={`${DEMO}/docs/`} variant="secondary">Read the docs</LinkButton>
          </>
        }
        footnote="No signup, no sandbox reset, no sales call."
        visual={
          <div className="grid aspect-[16/9] w-full place-items-center bg-muted/40 text-muted-foreground">
            {/* A screenshot goes here. The frame reserves the space either way,
                so the page never jumps once the image loads. */}
            <span className="text-caption">Dashboard screenshot</span>
          </div>
        }
      />

      <CardGrid
        eyebrow="Where to start"
        title="Six screens worth opening"
        lead="In the order they answer the questions people actually have: does the list hold up, does the form, and can it look like ours."
        columns={3}
        items={SCREENS}
      />

      <CodeBlock
        eyebrow="Run it yourself"
        title="Four minutes from an empty folder"
        lead="The scaffolder writes the demo app into your repository. It is yours from that point, with no runtime dependency on us."
        files={INSTALL}
        tone="muted"
      />

      <ProcessSteps eyebrow="How it works" title="Four steps" items={STEPS} />

      <TrustBadges
        items={[
          { label: "MIT licensed" },
          { label: "No telemetry" },
          { label: "Static export ready" },
          { label: "React and Vue" },
        ]}
        tone="muted"
      />

      <Faq eyebrow="Questions" title="About the demo" items={FAQS} defaultOpen={0} />

      <Cta
        variant="card"
        title="Prefer to run it locally?"
        lead="One command scaffolds the whole thing into a new project, demo data included."
        actions={
          <>
            <LinkButton href={`${DEMO}/docs/installation/`}>Installation guide</LinkButton>
            <LinkButton href="/contact/" variant="secondary">Ask a question</LinkButton>
          </>
        }
      />
    </>
  );
}
