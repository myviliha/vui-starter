"use client";

import { useEffect, useState } from "react";

import {
  listOrganizations,
  replaceOrganizations,
  snapshotOrganizations,
  subscribeOrganizations,
  type DemoOrganization,
} from "@/lib/api/organizations";

export type OrganizationsController = {
  data: DemoOrganization[];
  loading: boolean;
  error: Error | null;
  /** Persist the full next list (RecordView `onDataChange`). */
  save: (next: DemoOrganization[]) => void;
};

/**
 * CONTROLLER — bridges the data layer to the presentation. Starts empty +
 * loading so the UI paints its skeleton first, fetches after mount, then keeps
 * in sync with writes from any route. The table component reads this and does
 * no data processing of its own.
 */
export function useOrganizations(): OrganizationsController {
  const [data, setData] = useState<DemoOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let live = true;

    listOrganizations(ctrl.signal)
      .then((rows) => {
        if (!live) return;
        setData(rows);
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

  return { data, loading, error, save: replaceOrganizations };
}
