"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RecordView, type FilterValues } from "@viliha/vui-ui/record-view";
import { toast } from "@viliha/vui-ui/toast";
import { type DemoOrganization } from "@/lib/demo-data";
import { filterRows, reconcile } from "@/lib/use-client-filter";

import {
  fields,
  getPrimary,
  makeEmptyRow,
  ORG_FORM_DESCRIPTION,
  ORG_ICON,
  ORG_SINGULAR,
  ORG_TITLE,
} from "./organizations-config";
import { useOrganizations } from "./use-organizations";

/**
 * PRESENTATION — pure UI. Reads the controller and renders the datatable; it
 * does zero fetching or data processing. Lazy-loaded by organizations-table.tsx
 * so the skeleton paints before this (heavier) chunk arrives.
 */
export function OrganizationsView() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading, error, save } = useOrganizations();
  const [filters, setFilters] = useState<FilterValues<DemoOrganization>>({});
  // Soft-deleted organizations (the backend owns this in a real app; here it's
  // local state so the Trash view + Restore are live).
  const [trashed, setTrashed] = useState<DemoOrganization[]>([]);

  // Surface a load failure as a toast — a UI concern, so it lives here, not in
  // the controller or data layer.
  useEffect(() => {
    if (error) toast.error("Couldn't load organizations", { description: error.message });
  }, [error]);

  // Filter for display only; reconcile edits back into the full list before save.
  const rows = filterRows(data, filters);

  return (
    <RecordView
      persistKey={pathname}
      title={ORG_TITLE}
      singular={ORG_SINGULAR}
      icon={ORG_ICON}
      formMode="page"
      formColumns={1}
      loading={loading}
      onHome={() => router.push("/dashboard")}
      onCreate={() => router.push("/organizations/new")}
      onView={(id) => router.push(`/organizations/edit?id=${id}`)}
      onEdit={(id) => router.push(`/organizations/edit?id=${id}`)}
      formDescription={ORG_FORM_DESCRIPTION}
      fields={fields}
      initialData={rows}
      data={rows}
      onFilter={setFilters}
      onDataChange={(next) => {
        // Deleted rows are soft-deleted into Trash (skip a blank, un-saved add).
        const nextIds = new Set(next.map((r) => r.id));
        const removed = rows.filter(
          (r) => !nextIds.has(r.id) && r.name.trim() !== "",
        );
        if (removed.length) setTrashed((t) => [...removed, ...t]);
        save(reconcile(data, rows, next));
      }}
      showTrash
      trashedData={trashed}
      onRestore={(toRestore) => {
        const ids = new Set(toRestore.map((r) => r.id));
        setTrashed((t) => t.filter((r) => !ids.has(r.id)));
        save(reconcile(data, rows, [...rows, ...toRestore]));
      }}
      getPrimary={getPrimary}
      makeEmptyRow={makeEmptyRow}
    />
  );
}
