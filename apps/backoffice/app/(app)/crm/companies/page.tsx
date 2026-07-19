import { pageMeta } from "@/lib/seo";

import { CompaniesTable } from "./companies-table";

export const metadata = pageMeta("/crm/companies");

export default function CompaniesPage() {
  return (
    <main className="h-full">
      <CompaniesTable />
    </main>
  );
}
