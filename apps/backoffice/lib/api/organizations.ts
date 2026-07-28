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

// Change tracking for delta sync. A real DB does this with an `updated_at`
// column (or a change-feed); here a monotonic revision stands in. `cursor` is
// the highest revision the client has seen; `revOf`/`tombstones` let us answer
// "what changed since `cursor`?" without shipping the whole table.
let cursor = 1;
const revOf = new Map<number, number>(seed.map((r) => [r.id, cursor]));
const tombstones = new Map<number, number>(); // deleted id → revision at delete
function bump(id: number): number {
  revOf.set(id, ++cursor);
  tombstones.delete(id);
  return cursor;
}

/** What changed since `cursor` (0 = everything). Real API:
 *  `GET /organizations?since=cursor`. Returns only the touched rows + the ids
 *  of any deletions, so a kept-alive tab revalidates cheaply instead of
 *  re-pulling the full list. Merge the result by `id` in the controller. */
export type OrganizationsDelta = {
  changed: DemoOrganization[];
  deletedIds: number[];
  cursor: number;
};
export async function syncOrganizations(
  since: number,
  signal?: AbortSignal,
): Promise<OrganizationsDelta> {
  await wait(signal);
  return {
    changed: rows.filter((r) => (revOf.get(r.id) ?? 0) > since),
    deletedIds: [...tombstones]
      .filter(([, rev]) => rev > since)
      .map(([id]) => id),
    cursor,
  };
}

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

/** Latest revision, to seed a controller's delta cursor after its full load so
 *  the first `syncOrganizations` is a real delta, not a re-pull of everything.
 *  A real API returns this alongside the list (`{ rows, cursor }`). */
export const organizationsCursor = (): number => cursor;

/** Read one record. Sync in-memory read for the demo; a real edit page would
 *  `await fetchOrganization(id)`. */
export const getOrganization = (id: number): DemoOrganization | null =>
  rows.find((r) => r.id === id) ?? null;

// Writes are optimistic: mutate + emit so the UI updates immediately. A real
// API would await the request and reconcile; the signatures are ready for it.
export function replaceOrganizations(next: DemoOrganization[]): void {
  const before = new Set(rows.map((r) => r.id));
  const after = new Set(next.map((r) => r.id));
  for (const r of next) bump(r.id); // upserts (over-approximates, harmless)
  for (const id of before) if (!after.has(id)) tombstones.set(id, ++cursor);
  rows = next;
  emit();
}
export function addOrganization(row: DemoOrganization): void {
  bump(row.id);
  rows = [row, ...rows];
  emit();
}
export function updateOrganization(row: DemoOrganization): void {
  bump(row.id);
  rows = rows.map((r) => (r.id === row.id ? row : r));
  emit();
}
