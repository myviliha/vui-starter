"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RecordForm } from "@viliha/vui-ui/record-view";
import { SetPageTitle } from "@/app/_components/set-page-title";
import {
  fields,
  getPrimary,
  ORG_PROFILE_DESCRIPTION,
  ORG_PROFILE_ICON,
  ORG_PROFILE_SINGULAR,
  ORG_PROFILE_TITLE,
} from "./organization-config";
import { useOrgProfile } from "./use-org-profile";

/**
 * ORGANIZATION PROFILE (type 2 — record form, page variant) for the single
 * organization the admin manages. Opens read-only; the Edit button switches to
 * edit mode with the standard Cancel + Save footer. Reference implementation of
 * a full-page profile built entirely from `RecordForm` + a `fields` array —
 * copy it and reshape the fields for your own profile screens.
 */
export default function OrganizationProfilePage() {
  const router = useRouter();
  const { data, loading, save } = useOrgProfile();
  const [mode, setMode] = useState<"view" | "edit">("view");
  // Bumped on Save/Cancel to remount RecordForm so it re-seeds its buffered
  // draft from the latest saved record — this is what makes Cancel revert.
  const [formKey, setFormKey] = useState(0);

  return (
    <main className="h-full">
      <SetPageTitle title={ORG_PROFILE_TITLE} icon={ORG_PROFILE_ICON} />
      {loading || !data ? (
        <div className="flex h-full flex-col">
          <div className="h-12 shrink-0 border-b border-border" />
          <div className="min-h-0 flex-1 p-4">
            <div className="h-full animate-pulse rounded-lg border border-border bg-muted/30" />
          </div>
        </div>
      ) : (
        <RecordForm
          key={formKey}
          columns={2}
          readOnly={mode === "view"}
          onEdit={() => setMode("edit")}
          fields={fields}
          row={data}
          title={ORG_PROFILE_TITLE}
          singular={ORG_PROFILE_SINGULAR}
          icon={ORG_PROFILE_ICON}
          getPrimary={getPrimary}
          formDescription={ORG_PROFILE_DESCRIPTION}
          crumbs={[
            { label: "Home", onClick: () => router.push("/dashboard") },
            {
              label: "Organization",
              onClick: () => router.push("/organization/profile"),
            },
            { label: "Profile" },
          ]}
          onSave={(saved) => {
            save(saved);
            setMode("view");
            setFormKey((k) => k + 1);
          }}
          onCancel={() => {
            // Edit → Cancel reverts to the saved record (via remount); View →
            // Close returns to the dashboard.
            if (mode === "edit") {
              setMode("view");
              setFormKey((k) => k + 1);
            } else {
              router.push("/dashboard");
            }
          }}
        />
      )}
    </main>
  );
}
