# @viliha/vui-web

Marketing blocks for [VUI](https://vui.viliha.com): heroes, features, testimonials,
pricing, FAQ, headers and footers.

They are not a separate design system. Blocks read the same tokens and the same
class strings as the admin components, so a landing page and the dashboard it
sells look like one product.

```bash
npm install @viliha/vui-web
npm install -D tailwindcss @tailwindcss/postcss
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@viliha/vui-web/theme.css";
```

## Compose a page

Every block takes its content as props. There is no hard-coded copy, which is
what lets an agent fill them in.

```tsx
import { Hero, LogoCloud, FeatureGrid, Pricing, Faq, Cta } from "@viliha/vui-web";

export default function Home() {
  return (
    <>
      <Hero
        variant="product"
        eyebrow="New"
        title="The admin app your team will enjoy using"
        lead="Datatables, forms and charts that already match."
        actions={<a href="/signup">Start free</a>}
        visual={<img src="/product.png" alt="The dashboard" />}
      />
      <LogoCloud title="Trusted by" items={customers} />
      <FeatureGrid title="What you get" items={features} />
      <Pricing plans={plans} showToggle yearlyNote="Save 20%" />
      <Faq items={questions} />
      <Cta title="Ready?" actions={<a href="/signup">Start free</a>} />
    </>
  );
}
```

Import one block and a bundler drops the rest:

```tsx
import { Hero } from "@viliha/vui-web/hero";
```

## What's here

**Layout** `Section` · `SectionHeader`

**Hero** one component, seven variants: centered · split · product · gradient ·
minimal · image · video. Four more shapes people ask for by name are these plus a
prop, so there is no second name for the same markup: full screen is
`fullScreen`, breadcrumb is `breadcrumbs`, search is `search`, and a conversion
hero is `minimal` or `gradient` with actions and no visual.

**Content** `FeatureGrid` · `FeatureList` · `FeatureSplit` · `FeatureTabs` ·
`Benefits` · `ProcessSteps` · `Timeline` · `TeamGrid`

**Proof** `Stats` · `LogoCloud` (grid and marquee) · `Testimonials` (single,
grid, columns) · `QuoteBlock` · `RatingBlock` · `TrustBadges` · `CaseStudyGrid`

**Pricing** `Pricing` with a monthly/yearly toggle · `ComparisonTable` ·
`PricingCalculator` and `UsagePricingTable` for metered billing

**Media** `ImageBlock` · `ImageGallery` (with a lightbox) · `VideoBlock` ·
`EmbedBlock` · `MapBlock` · `CardGrid` · `MasonryGrid` · `Carousel` · `Marquee` ·
`CodeBlock` · `DownloadBlock`

**Discovery** `SearchBlock` · `FilterBar` · `Pagination` · `LoadMore` ·
`EmptyState` · `LoadingCards`

**Article** `Prose` · `ArticleHeader` · `AuthorCard` · `TableOfContents` ·
`ReadingProgress` · `ShareBlock` · `ArticlePager` · `ArticleTags`

**Conversion** `Cta` (banner, split, card) · `Newsletter` · `ContactForm` · `Faq`
(accordion and grid)

**Chrome** `SiteHeader` (sticky, transparent, mega menu, mobile drawer) ·
`SiteFooter` (standard and minimal) · `AnnouncementBar` · `CookieBanner` ·
`Callout`

## Things worth knowing

- **Forms post nowhere by default.** A static site has no endpoint. Pass
  `action` for a native post to Formspree or similar, or `onSubmit` to handle it
  yourself. With neither, the form warns in the console rather than quietly
  dropping a customer's message.
- **The bars render nothing on the server.** Dismissal lives in `localStorage`,
  which the server cannot read, so `AnnouncementBar` and `CookieBanner` return
  `null` until mount. That is what stops a dismissed bar flashing back on reload.
- **Right to left works** because blocks use logical properties (`ms-`, `pe-`,
  `start-`). Set `dir="rtl"` and the layout follows.
- **Motion respects the reader.** The marquee and the spinner stop under
  `prefers-reduced-motion`, and the marquee also stops when focus lands inside
  it: a keyboard user cannot hit a link on a moving strip.
- **Only three blocks are client components.** `ShareBlock`, `TableOfContents`
  and `ReadingProgress` need the browser. Everything else renders on the server,
  which is what lets a page pass a block a function like `hrefFor`.
- **An agent can ask what exists.** The MCP server in `@viliha/vui-ui` gained
  `list_blocks`, `get_block` and `compose_page`, and they read this package
  wherever it resolves. `compose_page "SaaS landing page"` returns the block
  order; `get_block Hero` returns its props and source.

## Styling a block

You do not. Blocks read tokens, so a brand change repaints them. What you choose
per block is `tone` (the full-bleed background: `default`, `muted`, `card`,
`brand`) and `width` (the content column). A `className` that sets a colour, a
size or a margin is how a site starts drifting.

For decoration there are six classes in `theme.css`, all mixed from
`--button-primary` so none of them carries a colour of its own: `.vui-aurora` for
a brand wash behind a hero, `.vui-grid-bg` and `.vui-dot-bg` for a faint texture,
`.vui-glow` for a spotlight, `.vui-gradient-text` for a gradient headline,
`.vui-lift` for a card that answers the pointer, and `.vui-reveal` for a section
that fades in as it scrolls into view. The last one is built on
`animation-timeline: view()`, so it needs no JavaScript and no observer.

MIT © VILIHA PTE. LTD.
