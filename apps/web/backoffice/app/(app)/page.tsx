"use client";

import {
  CubeIcon as Building2,
  HomeIcon as Home,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@myviliha/vui-ui/avatar";
import { Badge } from "@myviliha/vui-ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@myviliha/vui-ui/table";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { StatCard } from "@/app/_components/stat-card";
import {
  employees,
  organizations,
  regionBreakdown,
  stats,
  type OrganizationStatus,
} from "@/lib/demo-data";

const statusBadge: Record<
  OrganizationStatus,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  active: { label: "Active", variant: "success" },
  trial: { label: "Trial", variant: "warning" },
  suspended: { label: "Suspended", variant: "destructive" },
};

const statCards = [
  stats.organizations,
  stats.employees,
  stats.activeMarkets,
  stats.branches,
];

export default function HomePage() {
  const maxRegion = Math.max(
    ...regionBreakdown.map((entry) => entry.organizations),
    1,
  );

  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Home" icon={Home} />

      {/* Sub-toolbar — mirrors the datatable's secondary bar */}
      <div className="flex shrink-0 items-center border-b border-border px-4 py-1.5 text-muted-foreground">
        Overview of organizations, teams, and markets across the platform.
      </div>

      {/* Scrollable content — full-bleed, borders separate sections (no gaps/padding) */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Stats — bordered cells, flush to the edges */}
        <section
          aria-label="Key metrics"
          className="grid grid-cols-2 border-b border-border lg:grid-cols-4"
        >
          {statCards.map((stat, i) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              delta={stat.delta}
              trend={stat.trend}
              className={cn(
                "border-border",
                // vertical dividers between columns
                i % 2 === 0 && "border-r",
                "lg:border-r lg:last:border-r-0",
                // horizontal divider for the second row on the 2-col layout
                i < 2 && "border-b lg:border-b-0",
              )}
            />
          ))}
        </section>

        {/* Content boxes — small 5px gutter; each is its own bordered box */}
        <div className="grid grid-cols-1 gap-[5px] p-[5px] lg:grid-cols-3">
          <section className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
            <SectionHeader>Recent organizations</SectionHeader>
            {organizations.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Branches</TableHead>
                      <TableHead className="text-right">Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => {
                      const status = statusBadge[org.status];
                      return (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarFallback>{org.initials}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate">{org.name}</p>
                                <p className="truncate text-muted-foreground">
                                  {org.url}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {org.country}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {org.branches}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {org.employees.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {org.updated}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {/* Side column — separate boxes */}
          <aside className="grid grid-cols-1 content-start gap-[5px]">
            {/* Region breakdown */}
            <section className="overflow-hidden rounded-lg border border-border bg-card">
              <SectionHeader>Organizations by region</SectionHeader>
              <div className="space-y-3 p-4">
                {regionBreakdown.map((entry) => (
                  <div key={entry.region} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{entry.region}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {entry.organizations}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(entry.organizations / maxRegion) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recently added employees */}
            <section className="overflow-hidden rounded-lg border border-border bg-card">
              <SectionHeader>New team members</SectionHeader>
              <div className="divide-y divide-border">
                {employees.slice(0, 5).map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback>
                        {person.firstName[0]}
                        {person.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate">
                        {person.firstName} {person.lastName}
                      </p>
                      <p className="truncate text-muted-foreground">
                        {person.department} · {person.organization}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        person.isActive
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/40",
                      )}
                      aria-label={person.isActive ? "Active" : "Inactive"}
                    />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Section header bar — same treatment as the datatable sub-toolbar. */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border bg-muted/40 px-4 py-2 font-medium">
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="font-medium">No organizations yet</p>
      <p className="text-muted-foreground">
        New tenants will appear here once they are onboarded.
      </p>
    </div>
  );
}
