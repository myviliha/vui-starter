import { pageMeta } from "@/lib/seo";

import { PeopleTable } from "./people-table";

export const metadata = pageMeta("/crm/people");

export default function PeoplePage() {
  return (
    <main className="h-full">
      <PeopleTable />
    </main>
  );
}
