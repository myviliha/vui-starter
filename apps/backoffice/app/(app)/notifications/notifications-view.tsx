"use client";

// PRESENTATION — reads the controller and renders. No fetching, no filtering.
//
// The full-page half of notifications. The other half is the hover popup in the
// top bar; both render NotificationList, so a row looks the same either way.

import * as React from "react";

import { Breadcrumbs } from "@viliha/vui-ui/breadcrumbs";
import { Button } from "@viliha/vui-ui/button";
import { Page } from "@viliha/vui-ui/page";
import { Tabs, TabsList, TabsTrigger } from "@viliha/vui-ui/tabs";

import { crumbsFor } from "@/app/_components/route-meta";
import { NotificationList } from "@/app/_components/notification-list";
import {
  NOTIFICATION_FILTERS,
  filterNotifications,
  useNotifications,
  type NotificationFilter,
} from "@/app/_components/use-notifications";

export function NotificationsView() {
  const { data, loading, unread, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = React.useState<NotificationFilter>("all");

  const items = filterNotifications(data, filter);

  return (
    <Page
      breadcrumbs={<Breadcrumbs crumbs={crumbsFor("/notifications")} />}
      actions={
        <Button
          variant="default"
          onClick={() => void markAllRead()}
          disabled={unread === 0}
        >
          Mark all read
        </Button>
      }
    >
      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Notifications</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {unread > 0
                ? `${unread} unread of ${data.length}`
                : `${data.length} total, nothing unread`}
            </p>
          </div>
          {/* The filter chips. Tabs is already the theme's segmented control, so
              this is not a new pattern with new styling to maintain. */}
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as NotificationFilter)}
          >
            <TabsList>
              {NOTIFICATION_FILTERS.map((f) => (
                <TabsTrigger key={f.id} value={f.id}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <NotificationList
          items={items}
          loading={loading}
          full
          onRead={(id) => void markRead(id)}
          emptyLabel={
            filter === "all"
              ? "You are all caught up."
              : "Nothing here under this filter."
          }
        />
      </section>
    </Page>
  );
}
