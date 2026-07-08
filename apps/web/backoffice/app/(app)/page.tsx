import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { SidebarExpandButton } from "@/app/_components/app-sidebar";
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
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <SidebarExpandButton />
          <h1 className="text-[12px] font-semibold tracking-tight">Home</h1>
        </div>
        <p className="text-[12px] text-muted-foreground">
          Overview of organizations, teams, and markets across the platform.
        </p>
      </div>

      {/* Stats */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            trend={stat.trend}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent organizations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent organizations</CardTitle>
            <CardDescription>
              The latest tenants added or updated on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                                <p className="truncate font-medium">
                                  {org.name}
                                </p>
                                <p className="truncate text-[12px] text-muted-foreground">
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
          </CardContent>
        </Card>

        {/* Side column */}
        <div className="space-y-6">
          {/* Region breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Organizations by region</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {regionBreakdown.map((entry) => (
                <div key={entry.region} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
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
            </CardContent>
          </Card>

          {/* Recently added employees */}
          <Card>
            <CardHeader>
              <CardTitle>New team members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employees.slice(0, 5).map((person) => (
                <div key={person.id} className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {person.firstName[0]}
                      {person.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">
                      {person.firstName} {person.lastName}
                    </p>
                    <p className="truncate text-[12px] text-muted-foreground">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="text-[12px] font-medium">No organizations yet</p>
      <p className="text-[12px] text-muted-foreground">
        New tenants will appear here once they are onboarded.
      </p>
    </div>
  );
}
