import { CardGrid, Cta, Hero, Section, SectionHeader } from "@viliha/vui-web";

import type { CollectionName } from "@/lib/catalog";
import { COLLECTIONS } from "@/lib/catalog";
import { LinkButton } from "@/app/_components/link-button";

/**
 * One listing page, rendered for every collection.
 *
 * The counterpart to `EntryPage`. Cards link to the detail pages, and the
 * grouping is derived from the entries themselves rather than configured: if
 * every entry shares a category, grouping by it would produce one heading and
 * no information, so it is skipped.
 */
export function CollectionPage({
  collection,
  eyebrow,
  title,
  lead,
  columns = 3,
  groupByCategory,
  cta,
  children,
}: {
  collection: CollectionName;
  eyebrow?: string;
  title: string;
  lead?: string;
  columns?: 2 | 3 | 4;
  /** Sections per category. Ignored when there is only one category. */
  groupByCategory?: boolean;
  cta?: { title: string; lead?: string; label: string; href: string };
  /** Extra blocks between the hero and the list. */
  children?: React.ReactNode;
}) {
  const { base, entries } = COLLECTIONS[collection];
  const categories = [...new Set(entries.map((e) => e.category).filter(Boolean))] as string[];
  const grouped = groupByCategory && categories.length > 1;

  const card = (e: (typeof entries)[number]) => ({
    title: e.title,
    body: e.summary,
    meta: e.meta ?? e.category,
    href: `${base}${e.slug}/`,
  });

  return (
    <>
      <Hero variant="minimal" pattern="dots" eyebrow={eyebrow} title={title} lead={lead} />

      {children}

      {grouped ? (
        categories.map((category, i) => (
          <Section key={category} tone={i % 2 === 1 ? "muted" : undefined} tight>
            <SectionHeader title={category} level={2} size="h3" className="mb-6" />
            <CardGrid
              columns={columns}
              items={entries.filter((e) => e.category === category).map(card)}
            />
          </Section>
        ))
      ) : (
        <Section tight>
          <CardGrid columns={columns} items={entries.map(card)} />
        </Section>
      )}

      <Cta
        variant="card"
        title={cta?.title ?? "Not finding what you need?"}
        lead={cta?.lead ?? "Tell us what you are trying to build and we will point you at the right starting place."}
        actions={
          <>
            <LinkButton href={cta?.href ?? "/contact/"}>{cta?.label ?? "Talk to us"}</LinkButton>
            <LinkButton href="/demo/" variant="secondary">Open the demo</LinkButton>
          </>
        }
      />
    </>
  );
}
