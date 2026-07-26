import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Table",
  description:
    "Server-side data table demo — pagination, sorting, keyword and per-field filtering handled by the backend, with a loading shimmer, built on RecordView.",
};

export default function DataTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
