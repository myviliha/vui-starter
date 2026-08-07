import type { Organization } from "@viliha/vui-ui/org-switcher";

/**
 * DATA — the organizations the signed-in person belongs to, for the sidebar
 * switcher. Mock today: swap the body for `fetch("/api/me/organizations",
 * { signal })` and nothing above changes.
 *
 * These are **tenants**, not the customer records in the Organizations table.
 * A person can belong to several, and the current one scopes what the app
 * shows.
 */
const WORKSPACES: Organization[] = [
  {
    id: "luxecart",
    name: "LuxeCart",
    plan: "Plan",
    planStatus: "active",
    // Each tenant carries its own brand, handed to ThemeConfigProvider on a
    // switch, so the app repaints in their colours.
    theme: { brand: "#d33c4e" },
  },
  {
    id: "northwind",
    name: "Northwind Retail",
    plan: "Enterprise",
    planStatus: "active",
    theme: { brand: "#266df0" },
  },
  {
    id: "sakura",
    name: "Sakura Foods",
    plan: "Trial",
    planStatus: "trialing",
    theme: { brand: "#3fae7f" },
  },
  {
    id: "alpine",
    name: "Alpine Logistics",
    plan: "Past due",
    planStatus: "past_due",
    theme: { brand: "#8b5cf6" },
  },
];

/** The list for the switcher. */
export async function listWorkspaces(
  signal?: AbortSignal,
): Promise<Organization[]> {
  await new Promise((r) => setTimeout(r, 120));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return WORKSPACES;
}

/**
 * Move the session to another tenant. The mock resolves; a real one posts to
 * your API, and throwing here cancels the switch, so a refused change leaves
 * the person where they were.
 */
export async function switchWorkspace(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  if (!WORKSPACES.some((w) => w.id === id))
    throw new Error(`No access to workspace ${id}`);
}
