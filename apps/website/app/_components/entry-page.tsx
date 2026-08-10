import Link from "next/link";

import { CardGrid, Cta, Hero, Prose, Section, SectionHeader } from "@viliha/vui-web";

import { LinkButton } from "@/app/_components/link-button";
import type { CollectionName, Entry } from "@/lib/catalog";
import { COLLECTIONS, relatedEntries } from "@/lib/catalog";

/**
 * One detail page, rendered for every collection on the site.
 *
 * A case study, a job, a guide and an event differ in what they are called and
 * almost nothing else: a title, a summary, some prose, facts in a sidebar, and
 * a way to act on it. Sixteen bespoke templates would drift within a month, so
 * there is one.
 *
 * If a collection ever genuinely needs a different shape, give it its own page
 * rather than a flag here. Two shapes are fine; a template with six booleans is
 * not.
 */
export function EntryPage({
  entry,
  collection,
  backLabel,
  backHref,
  relatedTitle = "More like this",
}: {
  entry: Entry;
  collection: CollectionName;
  /** The listing this page belongs to, for the breadcrumb trail. */
  backLabel: string;
  backHref: string;
  relatedTitle?: string;
}) {
  const related = relatedEntries(collection, entry.slug);
  const base = COLLECTIONS[collection].base;

  return (
    <>
      <Hero
        variant="minimal"
        pattern="grid"
        eyebrow={entry.category}
        title={entry.title}
        lead={entry.summary}
        breadcrumbs={
          <nav aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span aria-hidden> / </span>
            <Link href={backHref} className="hover:text-foreground">
              {backLabel}
            </Link>
          </nav>
        }
      />

      <Section width="lg" tight>
        <div className="grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-14">
          <Prose>
            {entry.sections.map((section, i) => (
              <section key={section.heading ?? i}>
                {section.heading && <h2 id={slugify(section.heading)}>{section.heading}</h2>}
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.quote && <blockquote>{section.quote}</blockquote>}
              </section>
            ))}
          </Prose>

          {entry.facts && entry.facts.length > 0 && (
            <aside className="lg:sticky lg:top-24">
              <dl className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
                {entry.facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-0.5">
                    <dt className="text-caption text-muted-foreground">{fact.label}</dt>
                    <dd className="font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              {entry.tags && entry.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-caption text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )}
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="muted">
          <SectionHeader title={relatedTitle} align="center" className="mb-10" />
          <CardGrid
            columns={3}
            items={related.map((e) => ({
              title: e.title,
              body: e.summary,
              meta: e.meta ?? e.category,
              href: `${base}${e.slug}/`,
            }))}
          />
        </Section>
      )}

      <Cta
        variant="card"
        title={entry.cta?.title ?? "See it running"}
        lead={entry.cta?.lead ?? "The full admin demo, with real datatables, forms and charts."}
        actions={
          <>
            <LinkButton href={entry.cta?.href ?? "/demo/"}>{entry.cta?.label ?? "Open the demo"}</LinkButton>
            <LinkButton href={backHref} variant="secondary">Back to {backLabel.toLowerCase()}</LinkButton>
          </>
        }
      />
    </>
  );
}

/** Matches `headingId` in lib/posts.ts. Kept local so this file has no reason
 *  to import from the blog. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
