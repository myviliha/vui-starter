"use client";

import { useRouter } from "next/navigation";

import { CubeIcon as Building2 } from "@radix-ui/react-icons";

import {
  getOrgPrimary,
  ORGANIZATION_PROFILE_DESCRIPTION,
  organizationProfileFields,
} from "@viliha/vui-ui/organization-profile";
import { ProfileForm } from "@viliha/vui-ui/profile-form";

import { SetPageTitle } from "@/app/_components/set-page-title";
import { useOrgProfile } from "./use-org-profile";

/**
 * ORGANIZATION PROFILE — a thin consumer of the shipped `ProfileForm` component
 * and the `organizationProfileFields` preset. The page only wires the data
 * source (controller) and navigation; the whole view/edit UI, sections, Save +
 * Cancel and branding come from the package. Copy this to profile any record:
 * swap the fields (or spread the preset) and the data hook.
 */
export default function OrganizationProfilePage() {
  const router = useRouter();
  const { data, save } = useOrgProfile();

  return (
    <main className="h-full">
      <SetPageTitle title="Organization" icon={Building2} />
      <ProfileForm
        data={data}
        fields={organizationProfileFields}
        getPrimary={getOrgPrimary}
        onSave={save}
        title="Organization"
        singular="organization profile"
        icon={Building2}
        formDescription={ORGANIZATION_PROFILE_DESCRIPTION}
        onHome={() => router.push("/dashboard")}
        onExit={() => router.push("/dashboard")}
        crumbs={[
          { label: "Home", onClick: () => router.push("/dashboard") },
          {
            label: "Organization",
            onClick: () => router.push("/organization/profile"),
          },
          { label: "Profile" },
        ]}
      />
    </main>
  );
}
