"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RecordView } from "@viliha/vui-ui/record-view";
import { toast } from "@viliha/vui-ui/toast";

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

  // Surface a load failure as a toast — a UI concern, so it lives here, not in
  // the controller or data layer.
  useEffect(() => {
    if (error) toast.error("Couldn't load organizations", { description: error.message });
  }, [error]);

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
      initialData={data}
      data={data}
      onDataChange={save}
      getPrimary={getPrimary}
      makeEmptyRow={makeEmptyRow}
    />
  );
}
