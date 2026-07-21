"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { RecordForm } from "@viliha/vui-ui/record-view";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { orgStore } from "@/lib/org-store";
import {
  fields,
  getPrimary,
  ORG_FORM_DESCRIPTION,
  ORG_ICON,
  ORG_SINGULAR,
  ORG_TITLE,
} from "../organizations-config";

function EditOrganizationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const row = orgStore.get(Number(searchParams.get("id")));

  if (!row) {
    // Unknown id — e.g. a refresh cleared an in-session record.
    return (
      <main className="grid h-full place-items-center p-8 text-center text-muted-foreground">
        <p>
          Organization not found.{" "}
          <button
            type="button"
            onClick={() => router.push("/organizations")}
            className="text-[var(--button-primary)] hover:underline"
          >
            Back to organizations
          </button>
        </p>
      </main>
    );
  }

  return (
    <main className="h-full">
      <SetPageTitle title={ORG_TITLE} icon={ORG_ICON} />
      <RecordForm
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
          orgStore.update(saved);
          router.push("/organizations");
        }}
        onCancel={() => router.push("/organizations")}
      />
    </main>
  );
}

export default function EditOrganizationPage() {
  // useSearchParams needs a Suspense boundary under static export.
  return (
    <Suspense>
      <EditOrganizationForm />
    </Suspense>
  );
}
