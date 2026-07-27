"use client";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/app/_components/table-skeleton";

// Paint the shell first: this loader is a tiny chunk that renders the skeleton
// instantly, while the datatable view + its first page stream in behind it.
const UsersView = dynamic(
  () => import("./users-view").then((m) => m.UsersView),
  { ssr: false, loading: () => <TableSkeleton /> },
);

export function UsersTable() {
  return <UsersView />;
}
