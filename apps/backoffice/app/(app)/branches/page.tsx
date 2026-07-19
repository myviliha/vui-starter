import { pageMeta } from "@/lib/seo";

import { BranchesTable } from "./branches-table";

export const metadata = pageMeta("/branches");

export default function BranchesPage() {
  return (
    <main className="h-full">
      <BranchesTable />
    </main>
  );
}
