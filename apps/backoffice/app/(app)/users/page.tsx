import { pageMeta } from "@/lib/seo";

import { UsersTable } from "./users-table";

export const metadata = pageMeta("/users");

export default function UsersPage() {
  return (
    <main className="h-full">
      <UsersTable />
    </main>
  );
}
