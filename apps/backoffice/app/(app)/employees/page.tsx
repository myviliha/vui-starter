import { pageMeta } from "@/lib/seo";

import { EmployeesTable } from "./employees-table";

export const metadata = pageMeta("/employees");

export default function EmployeesPage() {
  return (
    <main className="h-full">
      <EmployeesTable />
    </main>
  );
}
