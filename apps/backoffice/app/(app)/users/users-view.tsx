"use client";

import {
  BackpackIcon,
  CalendarIcon,
  DotFilledIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Badge } from "@viliha/vui-ui/badge";
import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";

import {
  listUsers,
  restoreUsers,
  ROLES,
  STATUSES,
  TEAMS,
  type User,
  type UserStatus,
} from "@/lib/api/users";

const statusVariant: Record<UserStatus, "success" | "warning" | "destructive"> = {
  active: "success",
  invited: "warning",
  suspended: "destructive",
};

const options = <T extends string>(vals: readonly T[]) =>
  vals.map((v) => ({ value: v, label: v[0]!.toUpperCase() + v.slice(1) }));

const fields: RecordField<User>[] = [
  // Identity column (the leading Name). Sortable so the header toggle drives a
  // server sort.
  { key: "name", label: "Name", icon: PersonIcon, sortable: true, hideInTable: true },
  { key: "email", label: "Email", icon: EnvelopeClosedIcon, copyable: true, sortable: true, width: 260 },
  {
    key: "role",
    label: "Role",
    icon: LockClosedIcon,
    filterable: { control: "select", options: options(ROLES) },
  },
  {
    key: "team",
    label: "Team",
    icon: BackpackIcon,
    filterable: { control: "select", options: options(TEAMS) },
  },
  {
    key: "status",
    label: "Status",
    icon: DotFilledIcon,
    filterable: { control: "select", options: options(STATUSES) },
    render: (row) => (
      <Badge variant={statusVariant[row.status]} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    icon: CalendarIcon,
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.createdAt}</span>,
  },
];

/**
 * PRESENTATION — a server-paginated list. `fetcher` hands RecordView the read
 * path: it requests one page (≤ MAX_PAGE_SIZE) at a time, sorts/filters/searches
 * on the server, and caches per query (via `cacheKey`) so tab switches don't
 * refetch. No data processing here.
 */
export function UsersView() {
  return (
    <RecordView
      title="Users"
      singular="User"
      icon={PersonIcon}
      fields={fields}
      fetcher={listUsers}
      cacheKey="/users"
      showTrash
      onRestore={(restored) => restoreUsers(restored.map((u) => u.id))}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.email,
        initials: row.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      })}
    />
  );
}
