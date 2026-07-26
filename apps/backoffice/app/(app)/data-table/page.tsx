"use client";

import { useCallback, useRef, useState } from "react";
import {
  BackpackIcon as TeamIcon,
  PersonIcon as RoleIcon,
  SewingPinFilledIcon as LocationIcon,
  TableIcon,
} from "@radix-ui/react-icons";

import {
  RecordView,
  type RecordField,
  type ServerQuery,
} from "@viliha/vui-ui/record-view";

// A self-contained demo type + dataset. In a real app this lives in your
// database; here it stands in for the backend table so pagination is visible.
type Member = {
  id: number;
  name: string;
  team: string;
  role: string;
  location: string;
  commits: number;
};

const TEAMS = ["Platform", "Growth", "Design", "Data", "Mobile", "Security"];
const ROLES = ["Engineer", "Manager", "Designer", "Analyst", "Lead"];
const CITIES = ["Seattle", "Tokyo", "Berlin", "Austin", "Sydney", "London"];

const ALL: Member[] = Array.from({ length: 213 }, (_, i) => ({
  id: i + 1,
  name: `Member ${String(i + 1).padStart(3, "0")}`,
  team: TEAMS[i % TEAMS.length]!,
  role: ROLES[i % ROLES.length]!,
  location: CITIES[i % CITIES.length]!,
  commits: (i * 7) % 500,
}));

// Simulated server endpoint: filter + sort + paginate, returning just the page
// (plus the total). Swap this for a real `fetch` to your API.
function fetchPage(
  q: ServerQuery<Member>,
): Promise<{ rows: Member[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let out = ALL;
      const search = q.search.trim().toLowerCase();
      if (search) {
        out = out.filter((m) =>
          [m.name, m.team, m.role, m.location].some((v) =>
            v.toLowerCase().includes(search),
          ),
        );
      }
      const team = q.filters.team;
      if (typeof team === "string" && team) {
        out = out.filter((m) => m.team === team);
      }
      if (q.sort) {
        const { key, dir } = q.sort;
        out = [...out].sort((a, b) => {
          const av = a[key as keyof Member];
          const bv = b[key as keyof Member];
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av ?? "").localeCompare(String(bv ?? ""));
          return dir === "asc" ? cmp : -cmp;
        });
      }
      const total = out.length;
      const start = (q.page - 1) * q.pageSize;
      resolve({ rows: out.slice(start, start + q.pageSize), total });
    }, 500);
  });
}

const fields: RecordField<Member>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true, sortable: true },
  {
    key: "team",
    label: "Team",
    icon: TeamIcon,
    editable: true,
    group: "General",
    filterable: {
      control: "select",
      options: TEAMS.map((t) => ({ value: t, label: t })),
    },
  },
  { key: "role", label: "Role", icon: RoleIcon, editable: true, group: "General" },
  { key: "location", label: "Location", icon: LocationIcon, editable: true, group: "General" },
  {
    key: "commits",
    label: "Commits",
    group: "System",
    render: (row) => <span className="tabular-nums">{row.commits}</span>,
  },
];

function ServerDataTable() {
  // Server-side mode: RecordView reports the query; we fetch the page and feed
  // back `data` + `rowCount` + `loading`. It never filters/sorts/paginates here.
  const [data, setData] = useState<Member[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const reqId = useRef(0);

  const handleQuery = useCallback((q: ServerQuery<Member>) => {
    const id = ++reqId.current;
    setLoading(true);
    void fetchPage(q).then(({ rows, total }) => {
      if (id !== reqId.current) return; // ignore out-of-order responses
      setData(rows);
      setRowCount(total);
      setLoading(false);
    });
  }, []);

  return (
    <RecordView
      title="Data Table"
      singular="Member"
      icon={TableIcon}
      manual
      rowCount={rowCount}
      loading={loading}
      onQueryChange={handleQuery}
      fields={fields}
      initialData={data}
      data={data}
      onDataChange={setData}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: `${row.team} · ${row.role}`,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({
        id: Date.now(),
        name: "",
        team: "",
        role: "",
        location: "",
        commits: 0,
      })}
    />
  );
}

export default function DataTablePage() {
  return (
    <main className="h-full">
      <ServerDataTable />
    </main>
  );
}
