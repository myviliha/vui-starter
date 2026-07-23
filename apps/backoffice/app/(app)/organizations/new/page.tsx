"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RecordForm } from "@viliha/vui-ui/record-view";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { orgStore } from "@/lib/org-store";
import {
  fields,
  getPrimary,
  makeEmptyRow,
  ORG_FORM_DESCRIPTION,
  ORG_ICON,
  ORG_SINGULAR,
  ORG_TITLE,
} from "../organizations-config";

export default function NewOrganizationPage() {
  const router = useRouter();
  // Stable draft row (a fresh id per mount) so the form doesn't reset on render.
  const [row] = useState(makeEmptyRow);
  return (
    <main className="h-full">
      <SetPageTitle title={ORG_TITLE} icon={ORG_ICON} />
      <RecordForm
        isNew
        persistKey="/organizations/new"
        columns={1}
        fields={fields}
        row={row}
        title={ORG_TITLE}
        singular={ORG_SINGULAR}
        icon={ORG_ICON}
        getPrimary={getPrimary}
        formDescription={ORG_FORM_DESCRIPTION}
        onHome={() => router.push("/dashboard")}
        onSave={(saved) => {
          orgStore.add(saved);
          router.push("/organizations");
        }}
        onCancel={() => router.push("/organizations")}
      />
    </main>
  );
}
