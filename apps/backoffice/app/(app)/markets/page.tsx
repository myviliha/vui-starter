import { pageMeta } from "@/lib/seo";

import { MarketsTable } from "./markets-table";

export const metadata = pageMeta("/markets");

export default function MarketsPage() {
  return (
    <main className="h-full">
      <MarketsTable />
    </main>
  );
}
