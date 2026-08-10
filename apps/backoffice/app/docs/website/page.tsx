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
  alternates: { canonical: "/docs/website/" },
  title: "Website blocks",
  description:
    "Build a marketing website from VUI's website blocks: heroes, features, pricing, testimonials, FAQ, site header and footer. MIT licensed, composable by an agent, and built on the same design tokens as the admin app.",
};

export default function WebsitePage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Website blocks"
        lead="VUI is two halves. The admin half generates screens from data. This half builds the public site in front of it: 60 marketing blocks in @viliha/vui-web, on the same tokens, composable by an agent."
      />

      <H2>What are website blocks?</H2>
      <P>
        A block is one section of a marketing page, taking all of its content as
        props. A hero, a feature grid, a pricing table, an FAQ. You compose a
        page by stacking them, and you never write the markup for a section
        yourself. If a page needs a section that is not a block, that is a
        missing block rather than a reason to hand-roll one.
      </P>
      <P>
        They are MIT licensed and always will be, like everything else already
        published. They live in a separate package because a marketing site does
        not need the datatable, and an admin app does not need a cookie banner.
      </P>

      <CodeBlock title="Install">{`pnpm add @viliha/vui-web

# The theme comes from the same file the admin app uses.
# app/globals.css
@import "@viliha/vui-ui/theme.css";`}</CodeBlock>

      <H2>How do I build a page?</H2>
      <P>
        Stack blocks in the order the page should read. Here is a landing page in
        full. There is no bespoke markup in it, which is the test the library has
        to pass.
      </P>
      <CodeBlock title="app/page.tsx">{`import { Cta, Faq, FeatureGrid, Hero, LogoCloud, Pricing, Stats } from "@viliha/vui-web";

export default function HomePage() {
  return (
    <>
      <Hero
        variant="product"
        eyebrow="Now with Vue"
        title="The admin app your team will enjoy using"
        lead="Datatables, forms, charts and auth screens that already match each other."
        actions={<a href="/pricing/">Start free</a>}
        visual={<img src="/screenshot.png" alt="" />}
      />
      <LogoCloud title="Used by teams at" items={LOGOS} variant="marquee" />
      <FeatureGrid title="An admin app, not a box of parts" items={FEATURES} />
      <Stats items={STATS} tone="muted" />
      <Pricing plans={PLANS} showToggle yearlyNote="Save 20%" />
      <Faq title="Before you ask" items={FAQS} defaultOpen={0} />
      <Cta title="Build your admin app this week" actions={<a href="/pricing/">Start free</a>} />
    </>
  );
}`}</CodeBlock>

      <Note title="Content lives beside the page, not inside it">
        Every block takes its copy as props, so keep the copy in a{" "}
        <code>lib/content.ts</code> and let the page read as a list of sections.
        Changing a headline then never means opening a component, and an agent
        editing that one file changes the whole site without touching JSX.
      </Note>

      <H2>What blocks are there?</H2>
      <P>
        Around 60, in eight groups. The full list with props is in the package
        README, and an agent can ask for it directly (see below).
      </P>
      <Ul>
        <li>
          <strong>Frame</strong>: <code>Section</code>, <code>SectionHeader</code>,{" "}
          <code>SiteHeader</code>, <code>SiteFooter</code>,{" "}
          <code>AnnouncementBar</code>, <code>CookieBanner</code>
        </li>
        <li>
          <strong>Hero</strong>: one <code>Hero</code> with seven variants,
          covering all eleven shapes people ask for by name
        </li>
        <li>
          <strong>Features</strong>: <code>FeatureGrid</code>,{" "}
          <code>FeatureList</code>, <code>FeatureSplit</code>,{" "}
          <code>FeatureTabs</code>, <code>Benefits</code>,{" "}
          <code>ProcessSteps</code>, <code>Timeline</code>
        </li>
        <li>
          <strong>Proof</strong>: <code>Stats</code>, <code>LogoCloud</code>,{" "}
          <code>Testimonials</code>, <code>QuoteBlock</code>,{" "}
          <code>RatingBlock</code>, <code>TrustBadges</code>,{" "}
          <code>CaseStudyGrid</code>, <code>TeamGrid</code>
        </li>
        <li>
          <strong>Pricing</strong>: <code>Pricing</code>,{" "}
          <code>ComparisonTable</code>, <code>PricingCalculator</code>,{" "}
          <code>UsagePricingTable</code>
        </li>
        <li>
          <strong>Media</strong>: <code>ImageBlock</code>,{" "}
          <code>ImageGallery</code>, <code>VideoBlock</code>,{" "}
          <code>EmbedBlock</code>, <code>MapBlock</code>, <code>CardGrid</code>,{" "}
          <code>MasonryGrid</code>, <code>Carousel</code>, <code>Marquee</code>,{" "}
          <code>CodeBlock</code>, <code>DownloadBlock</code>
        </li>
        <li>
          <strong>Discovery</strong>: <code>SearchBlock</code>,{" "}
          <code>FilterBar</code>, <code>Pagination</code>, <code>LoadMore</code>,{" "}
          <code>EmptyState</code>, <code>LoadingCards</code>
        </li>
        <li>
          <strong>Article</strong>: <code>Prose</code>,{" "}
          <code>ArticleHeader</code>, <code>AuthorCard</code>,{" "}
          <code>TableOfContents</code>, <code>ReadingProgress</code>,{" "}
          <code>ShareBlock</code>, <code>ArticlePager</code>,{" "}
          <code>ArticleTags</code>
        </li>
      </Ul>

      <H2>How does an agent build my site?</H2>
      <P>
        The MCP server that ships inside <code>@viliha/vui-ui</code> gained three
        tools for this. An agent asks the installed package what to build with,
        rather than guessing from documentation that is a year older than your
        version.
      </P>
      <Ul>
        <li>
          <code>compose_page</code> turns &ldquo;SaaS landing page for a
          developer tool&rdquo; into an ordered block list with a note on what
          each one is for
        </li>
        <li>
          <code>list_blocks</code> returns every block and its purpose
        </li>
        <li>
          <code>get_block</code> returns one block&rsquo;s props and source
        </li>
      </Ul>
      <CodeBlock title="Connect it">{`claude mcp add vui -- npx -y @viliha/vui-ui mcp`}</CodeBlock>
      <P>
        The recipes behind <code>compose_page</code> are filtered against the
        blocks actually installed, so it can never recommend one that was
        renamed away.
      </P>

      <H2>How do I style a block?</H2>
      <P>
        You do not. Blocks read the same tokens as the admin app, so a brand
        change repaints both. What you choose per block is its{" "}
        <code>tone</code> (the full-bleed background: default, muted, card,
        brand) and its <code>width</code> (the content column). Passing a{" "}
        <code>className</code> that sets a colour, a font size or a margin is the
        thing that makes a site drift.
      </P>
      <CodeBlock title="Alternating sections">{`<FeatureGrid items={FEATURES} />
<Stats items={STATS} tone="muted" />
<Testimonials items={QUOTES} />
<Pricing plans={PLANS} tone="muted" />`}</CodeBlock>

      <H3>Decoration</H3>
      <P>
        A few classes in <code>theme.css</code> handle the effects a marketing
        page wants and an admin page never did:{" "}
        <code>.vui-aurora</code> for a brand wash behind a hero,{" "}
        <code>.vui-grid-bg</code> and <code>.vui-dot-bg</code> for a faint
        texture, <code>.vui-glow</code> for a spotlight,{" "}
        <code>.vui-gradient-text</code> for a gradient headline,{" "}
        <code>.vui-lift</code> for a card that answers the pointer, and{" "}
        <code>.vui-reveal</code> for a section that fades in as it arrives. All
        of them are mixed from <code>--button-primary</code>, so they follow the
        tenant&rsquo;s brand and none of them carries a colour of its own.
      </P>

      <H2>Do the forms work?</H2>
      <P>
        <code>Newsletter</code> and <code>ContactForm</code> submit nowhere until
        you wire them, and they say so rather than pretending. A static export
        has no server to post to. Give them an <code>action</code> for a form
        endpoint, or an <code>onSubmit</code> to call your own API. The eight
        field states, the validation and the success and error messages are
        already written either way.
      </P>
      <CodeBlock title="Wiring a form">{`<ContactForm action="https://formspree.io/f/xxxx" method="post" />

// or
<ContactForm onSubmit={async (data) => { await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) }); }} />`}</CodeBlock>

      <H2>Where is the reference site?</H2>
      <P>
        <code>apps/website</code> in the repository is 65 pages built entirely
        from these blocks: home, pricing, features and their detail pages,
        solutions, services, customers, careers, blog, guides, resources, events,
        webinars, news, press and the legal pages. It is a static export, so it
        deploys to any static host. Copy its <code>lib/site.ts</code> and{" "}
        <code>lib/catalog.ts</code> to start your own.
      </P>
      <Note title="One shape for every detail page">
        A case study, a job posting, a guide and an event differ in what they are
        called and almost nothing else. The reference site has one{" "}
        <code>Entry</code> type and one pair of components rendering all of them,
        rather than sixteen templates that drift apart within a month.
      </Note>

      <DocPager
        prev={{ label: "Blocks", href: "/docs/blocks" }}
        next={{ label: "Data table", href: "/docs/data-table" }}
      />
    </article>
  );
}
