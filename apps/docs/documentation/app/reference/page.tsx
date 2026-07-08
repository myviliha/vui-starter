import { ReferenceTable } from "@/components/reference-table";

export default function ReferencePage() {
  return (
    <main className="container mx-auto py-10">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Reference</h1>
        <p className="text-sm text-muted-foreground">
          Documentation index, sorted with TanStack Table.
        </p>
      </div>
      <ReferenceTable />
    </main>
  );
}
