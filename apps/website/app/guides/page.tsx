import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Long-form guides, with the tradeoffs left in",
  description: "Written from projects that shipped, including the parts that did not go well.",
  path: "/guides/",
});

export default function GuidesPage() {
  return (
    <CollectionPage
      collection="guides"
      eyebrow="Guides"
      title="Long-form guides, with the tradeoffs left in"
      lead="Written from projects that shipped, including the parts that did not go well."
      columns={3}
      groupByCategory
    />
  );
}
