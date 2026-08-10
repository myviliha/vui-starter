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
**Hero** centered · split · product · minimal · image · video
**Content** `FeatureGrid` · `FeatureList` · `FeatureSplit` · `Stats` · `LogoCloud`
(grid and marquee) · `Testimonials` (single, grid, columns) · `QuoteBlock` ·
`TrustBadges` · `Callout`
**Pricing** `Pricing` with a monthly/yearly toggle · `ComparisonTable`
**Conversion** `Cta` (banner, split, card) · `Newsletter` · `ContactForm` · `Faq`
**Chrome** `SiteHeader` (sticky, transparent, mega menu, mobile drawer) ·
`SiteFooter` (standard and minimal) · `AnnouncementBar` · `CookieBanner`

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
  `prefers-reduced-motion`.

MIT © VILIHA PTE. LTD.
