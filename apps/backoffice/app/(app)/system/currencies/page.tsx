import { pageMeta } from "@/lib/seo";

import { CurrenciesTable } from "./currencies-table";

export const metadata = pageMeta("/system/currencies");

export default function CurrenciesPage() {
  return (
    <main className="h-full">
      <CurrenciesTable />
    </main>
  );
}
