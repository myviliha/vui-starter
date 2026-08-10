import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Templates, checklists and files you can take",
  description: "Everything here is free and free of a form. Take what is useful.",
  path: "/resources/",
});

export default function ResourcesPage() {
  return (
    <CollectionPage
      collection="resources"
      eyebrow="Resources"
      title="Templates, checklists and files you can take"
      lead="Everything here is free and free of a form. Take what is useful."
      columns={3}
      groupByCategory
    />
  );
}
