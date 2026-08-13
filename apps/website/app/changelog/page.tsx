import { Cta, Hero, Timeline } from "@viliha/vui-web";

import { LinkButton } from "@/app/_components/link-button";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Changelog",
  description: "What shipped and when: components, framework support, theming and tooling.",
  path: "/changelog/",
});

const RELEASES = [
  { date: "August 2026", title: "Website blocks", body: "Forty-one marketing blocks, a fluid type scale, container and elevation tokens, and a demo site composed entirely from them." },
  { date: "August 2026", title: "Vue components", body: "Buttons through dialogs, selects and menus, on Reka UI, sharing the React class strings so the two cannot drift." },
  { date: "August 2026", title: "TanStack Charts", body: "Charts that are not React-only, wearing the theme palette through one CSS class." },
  { date: "August 2026", title: "Layout preferences", body: "Sidebar variant, density and right-to-left, as attributes on the root element." },
  { date: "July 2026", title: "MCP server", body: "Seven tools so a coding agent can query the library instead of reading node_modules." },
];

export default function ChangelogPage() {
  return (
    <>
      <Hero variant="minimal" eyebrow="Changelog" title="What shipped" lead="The short version. The full log lives with the packages, one entry per release." />
      <Timeline items={RELEASES} />
      <Cta variant="card" title="Read the full changelog" lead="Every release, with the reasoning, in the package itself." actions={<LinkButton href="https://internal.viliha.com/docs/changelog/" variant="secondary">Open the docs changelog</LinkButton>} />
    </>
  );
}
