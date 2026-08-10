# Changelog

All notable changes to `@viliha/vui-web` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

## 0.2.0 — 2026-08-11

### Added

- **`Marquee`**, the generic scrolling strip. `LogoCloud` now uses it too, so
  there is one implementation rather than two that drift. It stops on hover, on
  focus inside it, and for anyone who asked for less motion. Each copy of the
  content carries the gap as trailing padding, because otherwise the two halves
  are unequal and the loop jumps by half a gap on every pass.

- **`CodeBlock`**, with a file tab per file and a copy button that confirms it
  worked. No syntax highlighter: highlighting means shipping a grammar bundle for
  every language you might show, and a marketing page rarely shows twenty lines.
  Pass `html` if you want colour, built with Shiki where the cost is paid once.

- **`RatingBlock`**, an aggregate score with an optional per-source breakdown.
  The score is text as well as stars, so a screen reader gets "4.8 out of 5 from
  312 reviews" and so does a search engine looking for something to quote.

- **`PricingCalculator` and `UsagePricingTable`** for metered pricing, graduated
  or flat. `usageCost` is exported because a host computing the same number
  server-side should not reimplement it: quoting one price on the page and
  another on the invoice is the failure the block exists to avoid.

- **`Hero` gains a `gradient` variant**, `breadcrumbs` and `search` slots, a
  `pattern` prop (`grid` or `dots`) and `gradientTitle`.

- **`SectionHeader` gains `eyebrowVariant="pill"`** (the bordered chip a hero
  uses) and `titleClassName`.

### Changed

- **`article.tsx` split.** Only `ShareBlock`, `TableOfContents` and
  `ReadingProgress` need the browser, so they moved to `article-client.tsx`. The
  rest are server components again, which is what lets a page pass `ArticleTags`
  a `hrefFor` function. A function cannot cross the client boundary, and a
  whole-file `"use client"` was silently making every export a client component.

- **`QuoteBlock`'s `role` prop is now `authorRole`.** On a JSX element `role` is
  the ARIA attribute, and "Founder" is not a valid ARIA role.

- **Newsletter, ContactForm, Pricing, Stats, Testimonials and SiteHeader are
  documented.** They had no comment of their own, so the MCP server had nothing
  to say about them. A block an agent cannot read a purpose for is a block it
  will not choose correctly.

## 0.1.0 — 2026-08-10

### Added

- **The first marketing blocks**, built on the same tokens and class strings as
  the admin components: `Section` and `SectionHeader` as the frame every block
  composes, `Hero` in six shapes, `FeatureGrid`/`FeatureList`/`FeatureSplit`,
  `Stats`, `LogoCloud`, `Testimonials`, `QuoteBlock`, `TrustBadges`, `Pricing`
  with a billing toggle, `ComparisonTable`, `Faq`, `Cta`, `Newsletter`,
  `ContactForm`, `SiteHeader` with a mega menu and mobile drawer, `SiteFooter`,
  `AnnouncementBar`, `CookieBanner` and `Callout`.

- **Rhythm and width are decisions made once.** `Section` owns the vertical
  spacing and the content column, so a page is a stack of blocks rather than
  fifty hand-tuned paddings that drift apart.

- **The FAQ is `<details>`,** not a JavaScript disclosure: keyboard operation,
  screen-reader semantics and open-before-hydration come free from the browser.

- **The rest of the content set**: `ProcessSteps`, `Timeline`, `TeamGrid`,
  `FeatureTabs`, `CaseStudyGrid`, `Benefits`, `ImageBlock`, `ImageGallery` with a
  lightbox, `VideoBlock`, `EmbedBlock`, `MapBlock`, `CardGrid`, `MasonryGrid`,
  `Carousel`, `DownloadBlock`, `SearchBlock`, `FilterBar`, `Pagination`,
  `LoadMore`, `EmptyState` and `LoadingCards`.

  `Pagination` and `EmptyState` did not exist anywhere in the repo before, not
  even in the admin package, where pagination was locked inside `RecordView`.

  Three of these earn their keep by what they avoid: `VideoBlock` keeps a YouTube
  embed behind a poster, so the third-party iframe costs nothing until someone
  presses play; `Carousel` scroll-snaps natively, so touch, keyboard and momentum
  all work without a carousel library; `ImageBlock` reserves its space with an
  aspect ratio, which is most of what CLS measures.

Version 0.x on purpose. The block set is incomplete and the prop shapes may still
move.
