// DATA LAYER (API) — the only place that talks to the "backend".
//
// Three-layer architecture (see AGENTS.md → "Architecture: three layers"):
//   data (this file)  →  controller (use-organizations.ts)  →  presentation.
// Nothing above this file processes raw data; nothing here imports React.
//
// It's a mock in-memory table today. To wire a real API, swap the function
// BODIES for `fetch(url, { signal })` — the signatures stay identical, so the
// controller and UI never change. `listOrganizations` is intentionally async
// (with a small simulated latency) so the "paint UI first, load data after"
// pattern is visible on first load.

import { organizations as seed, type DemoOrganization } from "@/lib/demo-data";

export type { DemoOrganization };

// The in-memory table. A real backend replaces this with your database.
let rows: DemoOrganization[] = [...seed];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// ponytail: simulate network latency so the skeleton is visible; a real
// fetch() has its own. Delete when wiring the API.
const LATENCY_MS = 350;
function wait(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/** Fetch the full list. Async on purpose — this is the real-API seam. */
export async function listOrganizations(
  signal?: AbortSignal,
): Promise<DemoOrganization[]> {
  await wait(signal);
  return [...rows];
}

/** Subscribe to writes so open routes (list, /new, /edit) stay in sync. */
export function subscribeOrganizations(listener: () => void): () => void {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

/** Current snapshot — for `useSyncExternalStore` / optimistic reads. */
export const snapshotOrganizations = (): DemoOrganization[] => rows;

/** Read one record. Sync in-memory read for the demo; a real edit page would
 *  `await fetchOrganization(id)`. */
export const getOrganization = (id: number): DemoOrganization | null =>
  rows.find((r) => r.id === id) ?? null;

// Writes are optimistic: mutate + emit so the UI updates immediately. A real
// API would await the request and reconcile; the signatures are ready for it.
export function replaceOrganizations(next: DemoOrganization[]): void {
  rows = next;
  emit();
}
export function addOrganization(row: DemoOrganization): void {
  rows = [row, ...rows];
  emit();
}
export function updateOrganization(row: DemoOrganization): void {
  rows = rows.map((r) => (r.id === row.id ? row : r));
  emit();
}
