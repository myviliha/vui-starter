"use client";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/app/_components/table-skeleton";

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
