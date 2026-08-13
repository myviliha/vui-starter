import { CardGrid, Cta, FeatureSplit, FeatureTabs, Hero, LogoCloud, Stats, TrustBadges } from "@viliha/vui-web";

import { FEATURE_PAGES } from "@/lib/catalog";
import { LOGOS, STATS } from "@/lib/content";
import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Features",
  description:
    "Datatables, record forms, charts, auth screens and a themeable shell. What the library does, and what it deliberately leaves to you.",
  path: "/features/",
});

const TABS = [
  {
    label: "Datatable",
    title: "One field array, a whole table",
    body: "Sorting, filtering, pagination, selection, bulk actions and import/export come from the same definitions that generate the forms. Server-side mode hands the query to your API and keeps the shimmer.",
  },
  {
    label: "Forms",
    title: "Add, edit and view, generated",
    body: "Declare rows of sections and the layout follows. Validation shows on the field itself, so a form never grows a line of red text that pushes everything down while you type.",
  },
  {
    label: "Charts",
    title: "Two engines, one palette",
    body: "Recharts in React, TanStack Charts across frameworks. Both read the chart tokens, so a tenant's brand and dark mode reach the charts with nothing to configure.",
  },
  {
    label: "Theming",
    title: "Change one value, repaint everything",
    body: "Colour, radius, type scale, motion, density and reading direction are tokens. There is no per-component colour prop, which is what keeps it consistent.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="Features"
        title="The parts every admin app needs, already built"
        lead="Not a box of primitives to assemble. The screens themselves, generated from the data you describe."
      />
      <FeatureTabs items={TABS} />
      <CardGrid
        eyebrow="In depth"
        title="Every feature, written up"
        lead="What each one does, how it is wired, and where it stops being the right tool."
        columns={2}
        items={FEATURE_PAGES.map((f) => ({
          title: f.title,
          body: f.summary,
          meta: f.category,
          href: `/features/${f.slug}/`,
        }))}
      />
      <FeatureSplit
        eyebrow="Consistency"
        title="It stays consistent without anyone policing it"
        body="Components read tokens rather than hard-coded values, so there is nothing to review in a pull request and nothing to drift."
        points={[
          "One source for colour, spacing, radius and motion",
          "Dark mode from the same tokens, not a second stylesheet",
          "Right to left with no extra CSS",
        ]}
        visual={<div className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-border bg-muted/40 text-caption text-muted-foreground">Theme editor</div>}
        tone="muted"
      />
      <FeatureSplit
        reverse
        eyebrow="Agents"
        title="Built to be built by an agent"
        body="An MCP server ships with the library, so a coding assistant can ask what exists instead of guessing at an API and inventing imports."
        points={["Query components, pages and guides", "Compose a page from blocks", "Answers match the version you installed"]}
        visual={<div className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-border bg-muted/40 text-caption text-muted-foreground">MCP session</div>}
      />
      <Stats items={STATS} tone="muted" />
      <LogoCloud title="Built on" items={LOGOS} />
      <TrustBadges title="Checked in CI" items={[{ label: "Semgrep SAST" }, { label: "Secret scanning" }, { label: "Dependency audit" }, { label: "CodeQL" }]} tone="muted" />
      <Cta
        title="See it running"
        lead="A full admin demo with real datatables, forms and charts. No signup."
        actions={<LinkButton href="https://internal.viliha.com/dashboard/">Open the demo</LinkButton>}
      />
    </>
  );
}
