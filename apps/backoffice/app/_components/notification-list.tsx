"use client";

// PRESENTATION — rows only. No fetching, no filtering; both are done above.
//
// One list, two homes: the hover popup in the top bar and the /notifications
// page render this same component, so the two can never drift into looking like
// different products. The page passes `full` for the roomier layout.

import Link from "next/link";
import {
  BellIcon,
  ChatBubbleIcon,
  CheckCircledIcon,
  CursorArrowIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";

import { relativeTime, type Notification, type NotificationKind } from "./use-notifications";

/** One glyph per kind, so a row is scannable before it is read. */
const KIND_ICON: Record<NotificationKind, typeof BellIcon> = {
  mention: ChatBubbleIcon,
  assignment: CursorArrowIcon,
  comment: ChatBubbleIcon,
  system: BellIcon,
  billing: IdCardIcon,
};

/** Tint the glyph by kind, from the chart tokens so it follows the theme. */
const KIND_TINT: Record<NotificationKind, string> = {
  mention: "text-[var(--chart-1)]",
  assignment: "text-[var(--chart-2)]",
  comment: "text-[var(--chart-3)]",
  system: "text-muted-foreground",
  billing: "text-[var(--chart-4)]",
};

export function NotificationRow({
  item,
  full,
  onRead,
}: {
  item: Notification;
  /** The page's roomier spacing. The popup uses the compact default. */
  full?: boolean;
  onRead: (id: number) => void;
}) {
  const Icon = KIND_ICON[item.kind];
  const body = (
    <>
      <span
        className={cn(
          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-border bg-muted/50",
          KIND_TINT[item.kind],
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block", full ? "text-sm leading-relaxed" : "text-[13px] leading-snug")}>
          <span className="font-medium text-foreground">{item.actor}</span>{" "}
          <span className="text-muted-foreground">{item.message}</span>
        </span>
        {item.meta && (
          <span className="mt-1 block truncate text-[11px] text-muted-foreground/80">
            {item.meta}
          </span>
        )}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[11px] text-muted-foreground">{relativeTime(item.at)}</span>
        {!item.read && (
          <span
            className="size-1.5 rounded-full bg-[var(--button-primary)]"
            aria-label="Unread"
          />
        )}
      </span>
    </>
  );

  // Bordered rows, the same list standard as Menu: separators between, none
  // trailing, hover tint from the accent token.
  const rowClass = cn(
    "flex w-full items-start gap-3 border-b border-border text-left transition-colors last:border-b-0 hover:bg-accent/50",
    full ? "px-4 py-3.5" : "px-3 py-2.5",
    !item.read && "bg-[var(--button-primary)]/[0.04]",
  );

  if (item.href) {
    return (
      <Link href={item.href} className={rowClass} onClick={() => onRead(item.id)}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" className={rowClass} onClick={() => onRead(item.id)}>
      {body}
    </button>
  );
}

export function NotificationList({
  items,
  loading,
  full,
  onRead,
  emptyLabel = "You are all caught up.",
}: {
  items: readonly Notification[];
  loading?: boolean;
  full?: boolean;
  onRead: (id: number) => void;
  emptyLabel?: string;
}) {
  if (loading) {
    return (
      <div className="divide-y divide-border" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("flex items-start gap-3", full ? "px-4 py-3.5" : "px-3 py-2.5")}>
            <span className="mt-0.5 size-7 shrink-0 animate-pulse rounded-md bg-accent" />
            <span className="flex-1 space-y-2">
              <span className="block h-3 w-4/5 animate-pulse rounded bg-accent" />
              <span className="block h-2.5 w-1/3 animate-pulse rounded bg-accent" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid place-items-center gap-2 px-4 py-10 text-center">
        <CheckCircledIcon className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <NotificationRow key={item.id} item={item} full={full} onRead={onRead} />
      ))}
    </div>
  );
}
