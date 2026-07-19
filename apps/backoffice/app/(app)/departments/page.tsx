import { pageMeta } from "@/lib/seo";

import { DepartmentsTable } from "./departments-table";

export const metadata = pageMeta("/departments");

export default function DepartmentsPage() {
  return (
    <main className="h-full">
      <DepartmentsTable />
    </main>
  );
}
