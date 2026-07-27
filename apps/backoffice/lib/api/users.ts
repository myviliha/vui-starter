// DATA LAYER (API) — a large users table with SERVER-SIDE pagination.
//
// The point of this page: a table with far more rows than you'd ever send to
// the browser. Only ONE page (≤ MAX_PAGE_SIZE rows) is ever returned; the
// client never holds the whole table. `listUsers` maps 1:1 onto a real
// endpoint — swap the body for `fetch("/api/users?" + params, { signal })` and
// the ServerQuery fields become query params. Nothing above this file changes.
//
// ponytail: 10k rows generated in memory stand in for a million-row backend so
// search/sort/filter stay instant in the demo; a real DB does the same query
// over millions. Generating a literal 1M array client-side would jank the
// browser — which is exactly why pagination lives on the server.

import type { ServerQuery } from "@viliha/vui-ui/record-view";

export type UserStatus = "active" | "invited" | "suspended";
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  team: string;
  status: UserStatus;
  createdAt: string; // YYYY-MM-DD
};

export const ROLES = ["Owner", "Admin", "Editor", "Viewer", "Billing"] as const;
export const TEAMS = ["Platform", "Growth", "Design", "Data", "Mobile", "Security"] as const;
export const STATUSES: UserStatus[] = ["active", "invited", "suspended"];

// The hard ceiling the server enforces. Read here (not just in the UI) because a
// client can request any pageSize — the API must clamp it. Matches
// NEXT_PUBLIC_MAX_PAGE_SIZE so the selector and the server agree.
const MAX_PAGE_SIZE = (() => {
  const n = Number(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 100;
})();

const FIRST = ["Ava", "Haruto", "Lena", "Chidi", "Mia", "Noah", "Sofia", "Omar", "Isla", "Diego", "Yuki", "Priya"];
const LAST = ["Nguyen", "Okafor", "Muller", "Santos", "Kim", "Rossi", "Haddad", "Novak", "Costa", "Reyes", "Aziz", "Blum"];

const TOTAL = 10_000;

// The "table" — generated once, deterministically (no Math.random, so every
// render is identical). Stands in for the database.
const ALL: User[] = Array.from({ length: TOTAL }, (_, i) => {
  const first = FIRST[i % FIRST.length]!;
  const last = LAST[(i * 7) % LAST.length]!;
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${first}.${last}${i + 1}@example.com`.toLowerCase(),
    role: ROLES[i % ROLES.length]!,
    team: TEAMS[i % TEAMS.length]!,
    status: STATUSES[i % STATUSES.length]!,
    createdAt: new Date(2020, 0, 1 + ((i * 13) % 1600)).toISOString().slice(0, 10),
  };
});

/**
 * Fetch one page. Filters + sorts + paginates server-side and returns just that
 * page plus the true total. `pageSize` is clamped to MAX_PAGE_SIZE — the client
 * can't pull a bigger page than allowed.
 */
export function listUsers(
  q: ServerQuery<User>,
  signal: AbortSignal,
): Promise<{ rows: User[]; total: number }> {
  const pageSize = Math.min(Math.max(1, q.pageSize), MAX_PAGE_SIZE);
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      let out = ALL;

      const search = q.search.trim().toLowerCase();
      if (search) {
        out = out.filter((u) =>
          [u.name, u.email, u.role, u.team].some((v) =>
            v.toLowerCase().includes(search),
          ),
        );
      }
      const status = q.filters.status;
      if (typeof status === "string" && status) {
        out = out.filter((u) => u.status === status);
      }
      const team = q.filters.team;
      if (typeof team === "string" && team) {
        out = out.filter((u) => u.team === team);
      }
      const role = q.filters.role;
      if (typeof role === "string" && role) {
        out = out.filter((u) => u.role === role);
      }

      if (q.sort) {
        const { key, dir } = q.sort;
        out = [...out].sort((a, b) => {
          const av = a[key as keyof User];
          const bv = b[key as keyof User];
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av ?? "").localeCompare(String(bv ?? ""));
          return dir === "asc" ? cmp : -cmp;
        });
      }

      const total = out.length;
      const start = (q.page - 1) * pageSize;
      resolve({ rows: out.slice(start, start + pageSize), total });
    }, 300); // simulated latency; a real fetch() has its own

    signal.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
