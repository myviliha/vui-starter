# website

The marketing site: 65 static pages built entirely from `@viliha/vui-web`
blocks. If a page here needs markup that is not a block, that is a missing block
rather than a reason to hand-roll a section.

```bash
pnpm --filter website dev     # :3002
pnpm turbo build --filter=website...
```

The `...` matters: `@viliha/vui-core` and `@viliha/vui-theme` ship only generated
output, so a fresh checkout has nothing to import until turbo builds them first.

## Where the content lives

| File | Holds |
| --- | --- |
| `lib/site.ts` | Name, tagline, navigation, footer columns, route list, `pageMeta` |
| `lib/content.ts` | The copy on the standalone pages: features, stats, plans, FAQs, testimonials |
| `lib/catalog.ts` | Every collection with a page each: solutions, services, case studies, jobs, guides, resources, events, webinars, news |
| `lib/posts.ts` | Blog posts |

Renaming the company is one edit in `lib/site.ts`. Changing a headline never
means opening a component, which is also what lets an agent rewrite the site by
editing data.

## One shape for every detail page

A case study, a job posting, a guide and an event differ in what they are called
and almost nothing else: a title, a summary, prose, facts in a sidebar, and a way
to act on it. So there is one `Entry` type in `lib/catalog.ts` and one pair of
components, `EntryPage` and `CollectionPage`, that render all of them. Sixteen
bespoke templates drift apart within a month; one shape with sixteen data sets
cannot.

Adding a collection is three steps: the entries in `lib/catalog.ts`, a listing
route rendering `<CollectionPage collection="…" />`, and a `[slug]` route
rendering `<EntryPage />`. Detail URLs add themselves to the sitemap through
`catalogRoutes()`.

## Deploying

It is a static export (`output: "export"`, `trailingSlash: true`), so `out/` goes
to any static host: Cloudflare Pages, Netlify, S3, nginx. There is no deploy
workflow in this repo because GitHub Pages serves one site per repository and
that slot belongs to the admin demo at vui.viliha.com. Point your host at
`pnpm turbo build --filter=website...` and publish `apps/website/out`.

Set `NEXT_PUBLIC_SITE_URL` before building, or the canonical URLs and the sitemap
will point at the default domain.

## Forms

The contact and newsletter forms submit nowhere, because a static export has no
server. Give them an `action` for a form endpoint or an `onSubmit` for your own
API. They say so rather than pretending to have worked, which is the honest
failure mode.
