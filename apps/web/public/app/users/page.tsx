import { DataTable } from "@/components/data-table";

export default function UsersPage() {
  return (
    <main className="container mx-auto py-10">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          TanStack Table demo powered by shadcn UI primitives.
        </p>
      </div>
      <DataTable />
    </main>
  );
}
