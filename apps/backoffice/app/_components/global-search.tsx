"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  CommandPalette,
  type CommandAction,
} from "@viliha/vui-ui/command-palette";
import { organizations, employees } from "@/lib/demo-data";
import {
  branches,
  departments,
  markets,
  businesses,
  regions,
  countries,
  cities,
  currencies,
  languages,
} from "@/lib/mock-data";
import { companies, people, opportunities } from "@/lib/crm-data";

/**
 * Global search — a ⌘⌥K palette that searches across *records* (organizations,
 * people, opportunities, reference data…), as opposed to Quick actions (⌘K),
 * which navigates between *pages*. Both reuse the same headless `CommandPalette`
 * from @viliha/vui-ui; only the action list differs.
 *
 * The record index below is the demo's stand-in for a real search backend —
 * swap `INDEX` for results from your API and everything else stays the same.
 * Each result navigates to where the record lives (its list page, or the edit
 * route when there is one).
 */

type Indexed = {
  id: string;
  label: string;
  group: string;
  /** Extra text the search matches beyond the label. */
  keywords: string;
  /** Where selecting the result navigates. */
  href: string;
};

/** Flat, searchable index of every demo record. Built once at module load. */
const INDEX: Indexed[] = [
  ...organizations.map((o) => ({
    id: `org-${o.id}`,
    label: o.name,
    group: "Organizations",
    keywords: `${o.url} ${o.email} ${o.country}`,
    href: `/organizations/edit?id=${o.id}`,
  })),
  ...employees.map((e) => ({
    id: `emp-${e.id}`,
    label: `${e.firstName} ${e.lastName}`,
    group: "Employees",
    keywords: `${e.code} ${e.email} ${e.department} ${e.organization}`,
    href: "/employees",
  })),
  ...branches.map((b) => ({
    id: `br-${b.id}`,
    label: b.name,
    group: "Branches",
    keywords: `${b.code} ${b.city} ${b.organization} ${b.email}`,
    href: "/branches",
  })),
  ...departments.map((d) => ({
    id: `dep-${d.id}`,
    label: d.title,
    group: "Departments",
    keywords: `${d.code} ${d.organization}`,
    href: "/departments",
  })),
  ...markets.map((m) => ({
    id: `mkt-${m.id}`,
    label: m.name,
    group: "Markets",
    keywords: m.organization,
    href: "/markets",
  })),
  ...businesses.map((b) => ({
    id: `biz-${b.id}`,
    label: b.title,
    group: "Businesses",
    keywords: `${b.code} ${b.description}`,
    href: "/businesses",
  })),
  ...companies.map((c) => ({
    id: `co-${c.id}`,
    label: c.name,
    group: "Companies",
    keywords: `${c.domain} ${c.industry} ${c.city} ${c.country}`,
    href: "/crm/companies",
  })),
  ...people.map((p) => ({
    id: `pp-${p.id}`,
    label: `${p.firstName} ${p.lastName}`,
    group: "People",
    keywords: `${p.email} ${p.jobTitle} ${p.company} ${p.city}`,
    href: "/crm/people",
  })),
  ...opportunities.map((o) => ({
    id: `opp-${o.id}`,
    label: o.name,
    group: "Opportunities",
    keywords: `${o.company} ${o.owner} ${o.stage}`,
    href: "/crm/opportunities",
  })),
  ...regions.map((r) => ({
    id: `rg-${r.id}`,
    label: r.name,
    group: "Regions",
    keywords: r.code,
    href: "/system/regions",
  })),
  ...countries.map((c) => ({
    id: `ct-${c.id}`,
    label: c.name,
    group: "Countries",
    keywords: `${c.code} ${c.region}`,
    href: "/system/countries",
  })),
  ...cities.map((c) => ({
    id: `cy-${c.id}`,
    label: c.name,
    group: "Cities",
    keywords: `${c.state} ${c.country}`,
    href: "/system/cities",
  })),
  ...currencies.map((c) => ({
    id: `cur-${c.id}`,
    label: c.name,
    group: "Currencies",
    keywords: `${c.code} ${c.symbol}`,
    href: "/system/currencies",
  })),
  ...languages.map((l) => ({
    id: `lng-${l.id}`,
    label: l.name,
    group: "Languages",
    keywords: l.code,
    href: "/system/languages",
  })),
];

type Ctx = { open: () => void };
const GlobalSearchContext = React.createContext<Ctx | null>(null);

export function useGlobalSearch(): Ctx {
  const ctx = React.useContext(GlobalSearchContext);
  if (!ctx)
    throw new Error(
      "useGlobalSearch must be used within <GlobalSearchProvider>",
    );
  return ctx;
}

/** Holds the open state, mounts the palette once, and wires the global ⌘⌥K
 *  shortcut. Wrap the app shell with this. */
export function GlobalSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘⌥K / Ctrl+Alt+K — ⌘K (no Alt) is Quick actions. e.code, because macOS
      // Option remaps e.key to a composed character.
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.code === "KeyK") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const actions = React.useMemo<CommandAction[]>(
    () =>
      INDEX.map((r) => ({
        id: r.id,
        label: r.label,
        group: r.group,
        keywords: r.keywords,
        onSelect: () => router.push(r.href),
      })),
    [router],
  );

  const value = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        actions={actions}
        placeholder="Search organizations, people, records…"
        emptyMessage="No records match — try a name, code or email."
      />
    </GlobalSearchContext.Provider>
  );
}
