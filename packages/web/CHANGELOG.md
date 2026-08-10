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

Version 0.x on purpose. The block set is incomplete and the prop shapes may still
move.
