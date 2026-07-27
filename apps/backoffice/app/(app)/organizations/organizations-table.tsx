"use client";

import dynamic from "next/dynamic";

// Paint the UI shell first: this loader is a tiny chunk that renders the
// skeleton instantly on navigation, while the heavier datatable + its data
// stream in behind it. See AGENTS.md → "Architecture: three layers".
const OrganizationsView = dynamic(
  () => import("./organizations-view").then((m) => m.OrganizationsView),
  { ssr: false, loading: () => <TableSkeleton /> },
);

export function OrganizationsTable() {
  return <OrganizationsView />;
}

/** Matches the datatable frame (header bar + rows) so the swap is seamless. */
function TableSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="vui-shimmer h-6 w-48 rounded-md" />
        <div className="vui-shimmer h-8 w-28 rounded-md" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="vui-shimmer h-11 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
