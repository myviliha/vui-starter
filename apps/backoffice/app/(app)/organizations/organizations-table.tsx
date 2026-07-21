"use client";

import { useRouter } from "next/navigation";

import { RecordView } from "@viliha/vui-ui/record-view";
import { orgStore, useOrganizations } from "@/lib/org-store";
import {
  fields,
  getPrimary,
  makeEmptyRow,
  ORG_FORM_DESCRIPTION,
  ORG_ICON,
  ORG_SINGULAR,
  ORG_TITLE,
} from "./organizations-config";

export function OrganizationsTable() {
  const router = useRouter();
  const rows = useOrganizations();
  return (
    <RecordView
      title={ORG_TITLE}
      singular={ORG_SINGULAR}
      icon={ORG_ICON}
      formMode="page"
      formColumns={1}
      onHome={() => router.push("/dashboard")}
      onCreate={() => router.push("/organizations/new")}
      onView={(id) => router.push(`/organizations/edit?id=${id}`)}
      onEdit={(id) => router.push(`/organizations/edit?id=${id}`)}
      formDescription={ORG_FORM_DESCRIPTION}
      fields={fields}
      initialData={rows}
      data={rows}
      onDataChange={orgStore.set}
      getPrimary={getPrimary}
      makeEmptyRow={makeEmptyRow}
    />
  );
}
