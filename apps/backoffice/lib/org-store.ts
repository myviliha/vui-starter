"use client";

import { useSyncExternalStore } from "react";

import { organizations as seed, type DemoOrganization } from "./demo-data";

// Client-side store shared by the organizations table and the create/edit
// routes so a record added on /organizations/new shows up in the list.
// A real app would back this with an API; the shape is intentionally simple.
// ponytail: module-level array is fine for a demo/template; swap for a data
// layer (React Query, server actions) when wiring a backend.
let rows: DemoOrganization[] = [...seed];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export const orgStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  snapshot: () => rows,
  set(next: DemoOrganization[]) {
    rows = next;
    emit();
  },
  add(row: DemoOrganization) {
    rows = [row, ...rows];
    emit();
  },
  get(id: number) {
    return rows.find((r) => r.id === id) ?? null;
  },
};

export function useOrganizations(): DemoOrganization[] {
  return useSyncExternalStore(
    orgStore.subscribe,
    orgStore.snapshot,
    orgStore.snapshot,
  );
}
