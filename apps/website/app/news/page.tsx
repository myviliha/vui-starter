import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Company and product news",
  description: "Releases, decisions and the occasional thing worth writing down.",
  path: "/news/",
});

export default function NewsPage() {
  return (
    <CollectionPage
      collection="news"
      eyebrow="News"
      title="Company and product news"
      lead="Releases, decisions and the occasional thing worth writing down."
      columns={3}
      groupByCategory
    />
  );
}
