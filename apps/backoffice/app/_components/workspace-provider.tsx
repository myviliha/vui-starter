"use client";

import * as React from "react";

import { OrgProvider, useOrg, type Organization } from "@viliha/vui-ui/org-switcher";
import { ThemeConfigProvider } from "@viliha/vui-ui/theme-provider";
import { listWorkspaces, switchWorkspace } from "@/lib/api/workspaces";
import { ORG_THEME } from "@/lib/app-config";

/**
 * CONTROLLER — bridges the workspace data layer to the sidebar switcher, and
 * hands the current tenant's brand to the theme.
 *
 * The switching logic lives here rather than in the package: `onSwitch` posts to
 * the API and throws when it refuses, which cancels the switch. Replace that one
 * function to change what switching means in your app.
 */
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);

  // Paint the shell first, load the list after mount (see AGENTS.md).
  React.useEffect(() => {
    const controller = new AbortController();
    listWorkspaces(controller.signal)
      .then(setOrganizations)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // The switcher hides itself with an empty list; the app still works.
        console.error("[workspaces] could not load", err);
      });
    return () => controller.abort();
  }, []);

  return (
    <OrgProvider
      organizations={organizations}
      onSwitch={(org) => switchWorkspace(org.id)}
    >
      <WorkspaceTheme>{children}</WorkspaceTheme>
    </OrgProvider>
  );
}

/**
 * The tenant's brand becomes the organization layer of the theme, so switching
 * repaints the app. A personal override still wins over it, which is the whole
 * point of the two layers.
 */
function WorkspaceTheme({ children }: { children: React.ReactNode }) {
  const org = useOrg();
  const orgTheme = org?.current?.theme ?? ORG_THEME;
  return <ThemeConfigProvider orgTheme={orgTheme}>{children}</ThemeConfigProvider>;
}
