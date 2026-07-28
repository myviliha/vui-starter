"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  listOrganizations,
  organizationsCursor,
  replaceOrganizations,
  snapshotOrganizations,
  subscribeOrganizations,
  syncOrganizations,
  type DemoOrganization,
} from "@/lib/api/organizations";
import { useRefetchOnActive } from "@/lib/use-refetch-on-active";

export type OrganizationsController = {
  data: DemoOrganization[];
  loading: boolean;
  error: Error | null;
  /** Persist the full next list (RecordView `onDataChange`). */
  save: (next: DemoOrganization[]) => void;
};

/** Apply a delta (upserts + deletions) onto the current list, keyed by id. */
function merge(
  prev: DemoOrganization[],
  changed: DemoOrganization[],
  deletedIds: number[],
): DemoOrganization[] {
  if (!changed.length && !deletedIds.length) return prev; // nothing moved
  const byId = new Map(prev.map((r) => [r.id, r]));
  for (const r of changed) byId.set(r.id, r);
  for (const id of deletedIds) byId.delete(id);
  return [...byId.values()];
}

/**
 * CONTROLLER — bridges the data layer to the presentation. Starts empty +
 * loading so the UI paints its skeleton first, fetches after mount, then keeps
 * in sync with writes from any route. The table component reads this and does
 * no data processing of its own.
 *
 * Because this page is kept alive across tab switches, the mount fetch never
 * re-runs on its own. `useRefetchOnActive` calls `sync` when you return to the
 * tab or the window regains focus; `sync` is a *delta* (`?since=cursor`) that
 * pulls only the records another user changed and merges them by id — no full
 * reload.
 */
export function useOrganizations(): OrganizationsController {
  const [data, setData] = useState<DemoOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cursorRef = useRef(0);

  useEffect(() => {
    const ctrl = new AbortController();
    let live = true;

    listOrganizations(ctrl.signal)
      .then((rows) => {
        if (!live) return;
        setData(rows);
        cursorRef.current = organizationsCursor(); // seed delta cursor
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!live || (e instanceof DOMException && e.name === "AbortError")) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setLoading(false);
      });

    // Live-sync: a record added on /new or edited on /edit shows up here.
    const unsub = subscribeOrganizations(() => {
      if (live) setData([...snapshotOrganizations()]);
    });

    return () => {
      live = false;
      ctrl.abort();
      unsub();
    };
  }, []);

  // Cheap revalidate for the kept-alive tab: pull only what changed since our
  // cursor and merge it in. Runs on tab re-activation / window refocus.
  const sync = useCallback(() => {
    const ctrl = new AbortController();
    syncOrganizations(cursorRef.current, ctrl.signal)
      .then(({ changed, deletedIds, cursor }) => {
        cursorRef.current = cursor;
        if (changed.length || deletedIds.length)
          setData((prev) => merge(prev, changed, deletedIds));
      })
      .catch((e: unknown) => {
        // ponytail: a failed background revalidate (abort/offline) is non-fatal
        // — keep the stale-but-usable data; the next focus retries.
        void e;
      });
  }, []);
  useRefetchOnActive("/organizations", sync);

  return { data, loading, error, save: replaceOrganizations };
}
