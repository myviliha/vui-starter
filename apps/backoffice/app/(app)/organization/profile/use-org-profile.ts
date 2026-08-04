"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getOrgProfile,
  updateOrgProfile,
  type OrgProfile,
} from "@/lib/api/organization";

export type OrgProfileController = {
  data: OrgProfile | null;
  loading: boolean;
  error: Error | null;
  /** Persist edits and update the local copy. */
  save: (next: OrgProfile) => void;
};

/**
 * CONTROLLER — bridges the data layer to the Organization Profile page. Starts
 * `loading` with no data so the page can paint a placeholder, fetches after
 * mount, then holds the record. No JSX here.
 */
export function useOrgProfile(): OrgProfileController {
  const [data, setData] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let live = true;
    getOrgProfile(ctrl.signal)
      .then((profile) => {
        if (live) setData(profile);
      })
      .catch((e: unknown) => {
        if (live && (e as Error).name !== "AbortError") setError(e as Error);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
      ctrl.abort();
    };
  }, []);

  const save = useCallback((next: OrgProfile) => {
    updateOrgProfile(next);
    setData(next);
  }, []);

  return { data, loading, error, save };
}
