import { CollectionPage } from "@/app/_components/collection-page";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Work you can buy, not just install",
  description: "The library is free and always will be. These are the things a team sometimes wants a person for.",
  path: "/services/",
});

export default function ServicesPage() {
  return (
    <CollectionPage
      collection="services"
      eyebrow="Services"
      title="Work you can buy, not just install"
      lead="The library is free and always will be. These are the things a team sometimes wants a person for."
      columns={3}
      
    />
  );
}
