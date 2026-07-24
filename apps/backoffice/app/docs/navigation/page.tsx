import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  InlineCode,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/navigation/" },
  title: "Navigation, sections & tabs",
  description:
    "The sidebar, its two section types (titled sections vs collapsible groups), and the browser-style keep-alive open-tabs strip — all driven by one nav config. Copy these reference-app patterns when consuming @viliha/vui-ui.",
};

export default function NavigationDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Navigation, sections & tabs"
        lead="One config drives the whole shell: the sidebar, the breadcrumb trail, and the open-tabs strip all read from nav-config.ts. This page covers the two ways to group sidebar items and the browser-style keep-alive tabs — two upgrades that are easy to miss because they live in the app shell, not the component package."
      />

      <Note title="These are reference-app patterns">
        The sidebar, nav config, and open-tabs system are{" "}
        <strong>app-shell patterns</strong>, not <InlineCode>@viliha/vui-ui</InlineCode>{" "}
        exports. Copy <InlineCode>nav-config.ts</InlineCode>,{" "}
        <InlineCode>route-meta.ts</InlineCode>, <InlineCode>app-sidebar.tsx</InlineCode>,
        and <InlineCode>open-tabs.tsx</InlineCode> from the{" "}
        <a
          href="https://github.com/myviliha/vui-starter/tree/main/apps/backoffice/app/_components"
          className="font-medium text-foreground underline"
        >
          backoffice demo
        </a>{" "}
        and adapt. When you install the package fresh, you must wire these in — they
        won&apos;t appear automatically.
      </Note>

      <H2>One nav config</H2>
      <P>
        <InlineCode>nav-config.ts</InlineCode> is the single source of truth. The
        sidebar renders it, the <a href="/docs/layout" className="font-medium text-foreground underline">breadcrumbs</a>{" "}
        derive their trail from it, and the tab strip pulls labels, icons, and
        colors from it. Add or move a page in one place and everything follows.
      </P>

      <H2>Two ways to group sidebar items</H2>
      <P>
        There are exactly two grouping shapes — pick the one the structure calls
        for; don&apos;t hand-roll a third.
      </P>

      <H3>1 · Section (a titled band)</H3>
      <P>
        A <InlineCode>NavSection</InlineCode> is a top-level band with an optional{" "}
        <InlineCode>title</InlineCode> heading. Its items are{" "}
        <strong>always visible</strong> — there is no collapse. Use it to cluster
        related pages under a label (e.g. <em>Records</em>, <em>System</em>). The
        first section usually has no title (Home, Charts, …).
      </P>

      <H3>2 · Collapsible group (hide / unhide)</H3>
      <P>
        A <InlineCode>NavGroup</InlineCode> is an <em>entry inside</em> a section
        that has <InlineCode>children</InlineCode>. It renders as a parent row with
        a chevron that <strong>hides and unhides</strong> its nested links, and it
        opens automatically when one of those children is the active route. Reach
        for it to tuck a cluster of sub-pages under one parent (e.g.{" "}
        <em>Auth</em>, <em>CRM</em>, <em>System</em>) and keep the sidebar short.
      </P>

      <CodeBlock title="nav-config.ts">{`export const NAV: NavSection[] = [
  // Section with NO title — always-visible top-level links + one collapsible group
  {
    items: [
      { label: "Home", href: "/dashboard", icon: Home, color: "text-blue-500" },
      { label: "Charts", href: "/charts", icon: BarChart3, color: "text-fuchsia-500" },
      // A collapsible group: a parent with children (hide / unhide)
      {
        label: "Auth",
        icon: Lock,
        color: "text-rose-500",
        children: [
          { label: "Sign in", href: "/auth/signin", icon: LogIn },
          { label: "Sign up", href: "/auth/signup", icon: Users },
        ],
      },
    ],
  },
  // Section WITH a title heading — a static labeled band of links
  {
    title: "Records",
    items: [
      { label: "Organizations", href: "/organizations", icon: Building2 },
      { label: "Branches", href: "/branches", icon: Network },
    ],
  },
];`}</CodeBlock>

      <Ul>
        <li>
          <strong>Section vs group:</strong> a section is a visual band with a
          heading (flat, always shown); a group is a collapsible parent that nests
          links and toggles them open/closed.
        </li>
        <li>
          A group parent has <strong>no page of its own</strong> — its breadcrumb
          links to its first child (see{" "}
          <a href="/docs/layout" className="font-medium text-foreground underline">breadcrumbs</a>).
        </li>
        <li>
          Every link takes an <InlineCode>icon</InlineCode> and an optional{" "}
          <InlineCode>color</InlineCode> (a Tailwind <InlineCode>text-*</InlineCode>{" "}
          class); mirror it in <InlineCode>route-meta.ts</InlineCode> so the page
          title, breadcrumb, and tab share the accent.
        </li>
      </Ul>

      <H2>Open tabs (keep-alive)</H2>
      <P>
        Admin users tend to keep several pages open at once, so the shell ships a
        browser-style <strong>tab strip</strong> under the top bar. It&apos;s{" "}
        <strong>keep-alive</strong>: every opened page stays mounted (inactive ones
        hidden), so switching tabs is instant — no remount, no flash — and each
        page keeps its live state, from scroll position to form input to active
        filters. New routes mount on first visit.
      </P>

      <H3>Wiring (mount once in the app layout)</H3>
      <CodeBlock title="app/(app)/layout.tsx">{`<OpenTabsProvider>
  <AppSidebar />
  <TopBar />
  <TabStrip />              {/* the strip, under the top bar */}
  <div className="…overflow-hidden">
    {/* Keep-alive: open pages stay mounted so switching is instant */}
    <KeepAliveTabs>{children}</KeepAliveTabs>
  </div>
</OpenTabsProvider>`}</CodeBlock>

      <H3>What you get</H3>
      <Ul>
        <li>
          Labels, icons, and colors derive from <InlineCode>nav-config.ts</InlineCode>{" "}
          + <InlineCode>route-meta.ts</InlineCode> — no per-tab wiring.
        </li>
        <li>
          The open list persists in <InlineCode>sessionStorage</InlineCode>, capped
          by <InlineCode>NEXT_PUBLIC_MAX_TABS</InlineCode> (default 5; oldest is
          FIFO-evicted with a warning).
        </li>
        <li>Tabs are drag-reorderable and right-click-taggable with one of seven colors.</li>
        <li>
          <strong>⌘/Ctrl-click</strong> a sidebar item opens a background tab. For a
          custom &ldquo;open in new tab&rdquo; button, call{" "}
          <InlineCode>useOpenTabs().openTab(href, {"{ background: true }"})</InlineCode>.
        </li>
        <li>
          Tab identity is normalized via <InlineCode>tabKey</InlineCode>{" "}
          (trailing-slash safe), so <InlineCode>/foo</InlineCode> and{" "}
          <InlineCode>/foo/</InlineCode> are the same tab.
        </li>
      </Ul>

      <Note title="Keep-alive needs a static export">
        Keep-alive works because the reference app is a static export (all client
        at runtime). If your app uses server components per route, either adopt the
        static-export shell from the demo or fall back to a lighter
        navigation-tab model (a plain router push per tab) — but the strip,
        persistence, and nav-config wiring stay the same.
      </Note>

      <P>
        Env config for the shell — <InlineCode>NEXT_PUBLIC_MAX_TABS</InlineCode>,
        your <InlineCode>NEXT_PUBLIC_LOGO_URL</InlineCode>, and footer branding —
        lives in{" "}
        <a
          href="/docs/configuration"
          className="font-medium text-foreground underline"
        >
          Configuration
        </a>
        .
      </P>

      <DocPager
        prev={{ label: "Layout & patterns", href: "/docs/layout" }}
        next={{ label: "Building with AI agents", href: "/docs/ai-agents" }}
      />
    </article>
  );
}
