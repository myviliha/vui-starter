import {
  BackpackIcon as Briefcase,
  BarChartIcon as BarChart3,
  BookmarkIcon as Flag,
  CubeIcon as Building,
  CubeIcon as Building2,
  DashboardIcon as LayoutGrid,
  GlobeIcon as Globe,
  HomeIcon as Home,
  HomeIcon as Landmark,
  IdCardIcon as Contact,
  LayersIcon as Layers,
  MixIcon as Blocks,
  Pencil2Icon as FormInput,
  PersonIcon as Users,
  SewingPinFilledIcon as MapPin,
  Share2Icon as Network,
  StackIcon as Server,
  TargetIcon as Target,
  TextIcon as Languages,
  TokensIcon as Coins,
} from "@radix-ui/react-icons";

/** Single source of truth for navigation. The sidebar renders it, and the
 *  breadcrumbs derive their behaviour from it (see SECTION_INDEX) — so adding a
 *  section or moving a page only ever needs editing here. */

/** Shared icon component type (all Radix icons share this shape). */
export type IconType = typeof Home;
export type NavLink = { label: string; href: string; icon: IconType; color?: string };
/** A collapsible parent with nested links (a "subsection"). */
export type NavGroup = {
  label: string;
  icon: IconType;
  color?: string;
  children: NavLink[];
};
export type NavEntry = NavLink | NavGroup;
export type NavSection = { title?: string; items: NavEntry[] };

export function isGroup(entry: NavEntry): entry is NavGroup {
  return (entry as NavGroup).children !== undefined;
}

export const NAV: NavSection[] = [
  {
    items: [
      { label: "Home", href: "/", icon: Home, color: "text-blue-500" },
      { label: "Charts", href: "/charts", icon: BarChart3, color: "text-fuchsia-500" },
    ],
  },
  {
    title: "shadcn/ui",
    items: [
      { label: "Components", href: "/components", icon: Blocks, color: "text-indigo-500" },
      { label: "Forms", href: "/forms", icon: FormInput, color: "text-teal-500" },
    ],
  },
  {
    title: "Records",
    items: [
      { label: "Organizations", href: "/organizations", icon: Building2, color: "text-blue-500" },
      { label: "Branches", href: "/branches", icon: Network, color: "text-violet-500" },
      { label: "Departments", href: "/departments", icon: LayoutGrid, color: "text-amber-500" },
      { label: "Employees", href: "/employees", icon: Users, color: "text-cyan-500" },
      { label: "Markets", href: "/markets", icon: MapPin, color: "text-rose-500" },
      { label: "Businesses", href: "/businesses", icon: Briefcase, color: "text-emerald-500" },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        label: "CRM",
        icon: Layers,
        color: "text-indigo-500",
        children: [
          { label: "Companies", href: "/crm/companies", icon: Building, color: "text-blue-500" },
          { label: "People", href: "/crm/people", icon: Contact, color: "text-sky-500" },
          { label: "Opportunities", href: "/crm/opportunities", icon: Target, color: "text-orange-500" },
        ],
      },
      {
        label: "System",
        icon: Server,
        color: "text-slate-500",
        children: [
          { label: "Regions", href: "/system/regions", icon: Globe, color: "text-teal-500" },
          { label: "Countries", href: "/system/countries", icon: Flag, color: "text-red-500" },
          { label: "Cities", href: "/system/cities", icon: Landmark, color: "text-amber-500" },
          { label: "Currencies", href: "/system/currencies", icon: Coins, color: "text-green-500" },
          { label: "Languages", href: "/system/languages", icon: Languages, color: "text-purple-500" },
        ],
      },
    ],
  },
];

/** Group parents have no index page of their own, so a breadcrumb (or any link)
 *  for one would 404. Derived automatically from NAV: each group maps its parent
 *  path → its first child, e.g. "/crm" → "/crm/companies". Add a group to NAV and
 *  its breadcrumb resolves correctly with zero extra wiring. */
export const SECTION_INDEX: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const section of NAV) {
    for (const entry of section.items) {
      const first = isGroup(entry) ? entry.children[0] : undefined;
      if (first) map[first.href.slice(0, first.href.lastIndexOf("/")) || "/"] = first.href;
    }
  }
  return map;
})();
