# Changelog

All notable changes to `@viliha/vui-web` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

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
