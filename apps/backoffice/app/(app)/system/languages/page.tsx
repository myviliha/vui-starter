import { pageMeta } from "@/lib/seo";

import { LanguagesTable } from "./languages-table";

export const metadata = pageMeta("/system/languages");

export default function LanguagesPage() {
  return (
    <main className="h-full">
      <LanguagesTable />
    </main>
  );
}
