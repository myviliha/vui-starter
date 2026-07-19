import { pageMeta } from "@/lib/seo";

import { CitiesTable } from "./cities-table";

export const metadata = pageMeta("/system/cities");

export default function CitiesPage() {
  return (
    <main className="h-full">
      <CitiesTable />
    </main>
  );
}
