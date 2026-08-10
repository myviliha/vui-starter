import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Sessions run live, mistakes included",
  description: "An hour, a real repo and no slides. Recordings go up afterwards.",
  path: "/webinars/",
});

export default function WebinarsPage() {
  return (
    <CollectionPage
      collection="webinars"
      eyebrow="Webinars"
      title="Sessions run live, mistakes included"
      lead="An hour, a real repo and no slides. Recordings go up afterwards."
      columns={2}
      
    />
  );
}
