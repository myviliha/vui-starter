import { notFound } from "next/navigation";

import { EntryPage } from "@/app/_components/entry-page";
import { COLLECTIONS, entryBySlug } from "@/lib/catalog";
import { pageMeta } from "@/lib/site";

/** Static export, so every slug has to be known at build time. */
export function generateStaticParams() {
  return COLLECTIONS.solutions.entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entryBySlug("solutions", slug);
  if (!entry) return {};
  return pageMeta({
    title: entry.title,
    description: entry.summary,
    path: `/solutions/${slug}/`,
  });
}

export default async function SolutionsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entryBySlug("solutions", slug);
  if (!entry) notFound();
  return (
    <EntryPage entry={entry} collection="solutions" backLabel="Solutions" backHref="/solutions/" />
  );
}
