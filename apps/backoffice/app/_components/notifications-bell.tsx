"use client";

// The bell in the top bar, plus the popup that opens on hover.
//
// Two ways to see the same notifications: this popup for a glance, and
// /notifications for the full list. Both render NotificationList off the same
// controller, so the unread dot here and the page always agree.

import Link from "next/link";
import { BellIcon } from "@radix-ui/react-icons";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@viliha/vui-ui/hover-card";

import { NotificationList } from "./notification-list";
import { useNotifications } from "./use-notifications";

/** How many fit in the popup before it starts scrolling. */
const PREVIEW = 5;

export function NotificationsBell({
  iconControl,
  iconGlyph,
}: {
  /** The top bar's shared control and glyph classes, so the bell matches its neighbours. */
  iconControl: string;
  iconGlyph: string;
}) {
  const { data, loading, unread, markRead, markAllRead } = useNotifications();
  const preview = data.slice(0, PREVIEW);

  return (
    <HoverCard openDelay={120} closeDelay={160}>
      <HoverCardTrigger asChild>
        <Link
          href="/notifications"
          aria-label={
            unread ? `Notifications, ${unread} unread` : "Notifications"
          }
          className={`relative ${iconControl}`}
        >
          <BellIcon className={iconGlyph} />
          {unread > 0 && (
            <span
              className="absolute end-1.5 top-1.5 size-2 rounded-full bg-[var(--button-primary)] ring-2 ring-background"
              aria-hidden="true"
            />
          )}
        </Link>
      </HoverCardTrigger>
      {/* Wider than the hover card default, and unpadded so the rows can run
          edge to edge the way they do on the page. */}
      <HoverCardContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
          <span className="text-sm font-semibold tracking-tight">
            Notifications
            {unread > 0 && (
              <span className="ms-1.5 text-xs font-normal text-muted-foreground">
                {unread} unread
              </span>
            )}
          </span>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="cursor-pointer rounded-sm px-1.5 py-0.5 text-xs font-medium text-[var(--button-primary)] transition-colors hover:bg-accent"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="vui-scroll max-h-80 overflow-y-auto">
          <NotificationList
            items={preview}
            loading={loading}
            onRead={(id) => void markRead(id)}
          />
        </div>

        <Link
          href="/notifications"
          className="block border-t border-border bg-muted/40 px-3 py-2 text-center text-xs font-medium text-[var(--button-primary)] transition-colors hover:bg-accent"
        >
          View all notifications
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
}
