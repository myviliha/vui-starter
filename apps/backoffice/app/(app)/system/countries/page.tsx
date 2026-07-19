import { pageMeta } from "@/lib/seo";

import { CountriesTable } from "./countries-table";

export const metadata = pageMeta("/system/countries");

export default function CountriesPage() {
  return (
    <main className="h-full">
      <CountriesTable />
    </main>
  );
}
