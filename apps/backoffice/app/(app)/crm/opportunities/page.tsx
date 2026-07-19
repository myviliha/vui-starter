import { pageMeta } from "@/lib/seo";

import { OpportunitiesBoard } from "./opportunities-board";

export const metadata = pageMeta("/crm/opportunities");

export default function OpportunitiesPage() {
  return (
    <main className="h-full">
      <OpportunitiesBoard />
    </main>
  );
}
