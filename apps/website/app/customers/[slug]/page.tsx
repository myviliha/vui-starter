import { notFound } from "next/navigation";

import { EntryPage } from "@/app/_components/entry-page";
import { COLLECTIONS, entryBySlug } from "@/lib/catalog";
import { pageMeta } from "@/lib/site";

/** Static export, so every slug has to be known at build time. */
export function generateStaticParams() {
  return COLLECTIONS.customers.entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entryBySlug("customers", slug);
  if (!entry) return {};
  return pageMeta({
    title: entry.title,
    description: entry.summary,
    path: `/customers/${slug}/`,
  });
}

export default async function CustomersDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entryBySlug("customers", slug);
  if (!entry) notFound();
  return (
    <EntryPage entry={entry} collection="customers" backLabel="Customers" backHref="/customers/" />
  );
}
