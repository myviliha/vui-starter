"use client";

// CONTROLLER — bridges the data layer to the UI. No JSX.
//
// It lives in _components rather than beside the page because two surfaces read
// it: the bell popup in the top bar and the /notifications page. One controller
// means the unread count on the bell cannot disagree with the list.

import * as React from "react";

import {
  listNotifications,
  markAllRead,
  markRead,
  subscribeNotifications,
  unreadCount,
  type Notification,
  type NotificationKind,
} from "@/lib/api/notifications";

export type { Notification, NotificationKind };

/** The filter chips. "all" is not a kind; it is the absence of one. */
export const NOTIFICATION_FILTERS = [
  { id: "all", label: "All" },
  { id: "mention", label: "Mentions" },
  { id: "assignment", label: "Assigned" },
  { id: "system", label: "System" },
] as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTERS)[number]["id"];

export function useNotifications() {
  const [data, setData] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    listNotifications()
      .then((rows) => {
        setData(rows);
        setError(null);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  // Paint first, load after: the list starts empty and loading, so a skeleton
  // shows immediately rather than the page waiting on data.
  React.useEffect(() => {
    load();
    return subscribeNotifications(load);
  }, [load]);

  return {
    data,
    loading,
    error,
    unread: unreadCount(data),
    markRead: React.useCallback((id: number) => markRead(id), []),
    markAllRead: React.useCallback(() => markAllRead(), []),
  };
}

/** Filtering is data work, so it happens here and not in a component. */
export function filterNotifications(
  items: readonly Notification[],
  filter: NotificationFilter,
): Notification[] {
  return filter === "all" ? [...items] : items.filter((n) => n.kind === filter);
}

/**
 * "4m", "2h", "3d". Short enough for a row that already has a lot in it, and
 * computed from the ISO string so the data layer stays free of formatting.
 */
export function relativeTime(iso: string, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.round(days / 7)}w`;
}
