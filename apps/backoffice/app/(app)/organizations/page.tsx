import { pageMeta } from "@/lib/seo";

import { OrganizationsTable } from "./organizations-table";

export const metadata = pageMeta("/organizations");

export default function OrganizationsPage() {
  return (
    <main className="h-full">
      <OrganizationsTable />
    </main>
  );
}
