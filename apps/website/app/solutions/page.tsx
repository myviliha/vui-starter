import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Start from the problem, not the feature list",
  description: "Three shapes most teams arrive with. Each one is the same components arranged for a different job.",
  path: "/solutions/",
});

export default function SolutionsPage() {
  return (
    <CollectionPage
      collection="solutions"
      eyebrow="Solutions"
      title="Start from the problem, not the feature list"
      lead="Three shapes most teams arrive with. Each one is the same components arranged for a different job."
      columns={3}
      
    />
  );
}
