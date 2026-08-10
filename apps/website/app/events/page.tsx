import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Where to find us in person",
  description: "Meetups, office hours and the occasional conference. No badges, no pitch.",
  path: "/events/",
});

export default function EventsPage() {
  return (
    <CollectionPage
      collection="events"
      eyebrow="Events"
      title="Where to find us in person"
      lead="Meetups, office hours and the occasional conference. No badges, no pitch."
      columns={2}
      
    />
  );
}
