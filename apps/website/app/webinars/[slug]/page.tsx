import { notFound } from "next/navigation";

import { EntryPage } from "@/app/_components/entry-page";
import { COLLECTIONS, entryBySlug } from "@/lib/catalog";
import { pageMeta } from "@/lib/site";

/** Static export, so every slug has to be known at build time. */
export function generateStaticParams() {
  return COLLECTIONS.webinars.entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entryBySlug("webinars", slug);
  if (!entry) return {};
  return pageMeta({
    title: entry.title,
    description: entry.summary,
    path: `/webinars/${slug}/`,
  });
}

export default async function WebinarsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entryBySlug("webinars", slug);
  if (!entry) notFound();
  return (
    <EntryPage entry={entry} collection="webinars" backLabel="Webinars" backHref="/webinars/" />
  );
}
