import { pageMeta } from "@/lib/seo";

import { RegionsTable } from "./regions-table";

export const metadata = pageMeta("/system/regions");

export default function RegionsPage() {
  return (
    <main className="h-full">
      <RegionsTable />
    </main>
  );
}
