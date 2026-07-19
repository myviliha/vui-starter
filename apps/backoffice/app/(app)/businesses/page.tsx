import { pageMeta } from "@/lib/seo";

import { BusinessesTable } from "./businesses-table";

export const metadata = pageMeta("/businesses");

export default function BusinessesPage() {
  return (
    <main className="h-full">
      <BusinessesTable />
    </main>
  );
}
