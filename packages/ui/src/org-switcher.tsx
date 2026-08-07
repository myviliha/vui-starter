"use client";

import * as React from "react";
import {
  CheckCircledIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  useResolved,
  type OrgSwitcherConfig,
  type ThemeAwareOrgConfig,
} from "./config";
import { cn } from "./utils";

/**
 * One organization a person belongs to. `id` and `name` are all that's needed;
 * everything else fills in the row when you have it.
 */
export type Organization = {
  id: string;
  name: string;
  /** Subscription plan name, shown on the row's second line. */
  plan?: string;
  /** Drives the icon beside the plan: a check, or a warning for anything that
   *  needs attention. */
  planStatus?: "active" | "trialing" | "past_due" | "canceled";
  /** Square mark for the row. A letter tile is used when there isn't one. */
  logoUrl?: string;
  /** This tenant's brand, handed to `ThemeConfigProvider` so switching
   *  organization repaints the app in their colours. */
  theme?: ThemeAwareOrgConfig;
};

/** What happens on a switch. Return a promise and the row shows a pending state
 *  until it settles, so a server round trip doesn't look like a dead click. */
export type SwitchHandler = (org: Organization) => void | Promise<void>;

type OrgCtx = {
  organizations: Organization[];
  current: Organization | undefined;
  currentId: string | undefined;
  switchTo: (id: string) => void;
  /** The id being switched to while a handler is in flight. */
  switching: string | undefined;
  error: unknown;
};

const OrgContext = React.createContext<OrgCtx | null>(null);

/**
 * Which organization should be current, given the list and the stored choice.
 * Falls back to the first available one, so access being revoked (or a tenant
 * being deleted) can't leave someone pinned to an organization they aren't in.
 * Returns `undefined` while the list is still empty, which reads as loading.
 *
 * Exported for testing.
 */
export function resolveCurrentId(
  organizations: Organization[],
  wanted: string | undefined,
): string | undefined {
  if (wanted && organizations.some((o) => o.id === wanted)) return wanted;
  return organizations[0]?.id;
}

/**
 * The default switching logic, and the place to replace it.
 *
 * Out of the box: selecting an organization sets it as current and remembers it
 * per browser, so the choice survives a reload. That is enough for an app whose
 * data layer reads the current organization.
 *
 * When your switch means more than that (a server call to move the session, a
 * cookie your API reads, a hard navigation), pass `onSwitch`. It runs before the
 * current organization changes, and throwing from it cancels the switch, so a
 * failed server call leaves the user where they were instead of showing them a
 * tenant they aren't in.
 *
 * ```tsx
 * <OrgProvider
 *   organizations={orgs}
 *   defaultOrgId={session.orgId}
 *   onSwitch={async (org) => { await api.post("/session/org", { id: org.id }); }}
 * >
 * ```
 */
export function OrgProvider({
  organizations,
  defaultOrgId,
  onSwitch,
  storageKey = "vui.org",
  persist = true,
  children,
}: {
  organizations: Organization[];
  /** Which one is current on first load. Defaults to the first in the list. */
  defaultOrgId?: string;
  /** Your switching logic, run before the change. Throw to cancel it. */
  onSwitch?: SwitchHandler;
  /** localStorage key for the remembered choice. */
  storageKey?: string;
  /** Set `false` when the current organization comes from your session and the
   *  browser has no business remembering it. */
  persist?: boolean;
  children: React.ReactNode;
}) {
  const [currentId, setCurrentId] = React.useState<string | undefined>(
    defaultOrgId ?? organizations[0]?.id,
  );
  const [switching, setSwitching] = React.useState<string | undefined>();
  const [error, setError] = React.useState<unknown>(null);
  const onSwitchRef = React.useRef(onSwitch);
  onSwitchRef.current = onSwitch;

  // Read the remembered choice after mount, so the server-rendered HTML and the
  // first client render agree.
  React.useEffect(() => {
    if (!persist) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && organizations.some((o) => o.id === stored))
        setCurrentId(stored);
    } catch {
      // blocked storage — the default stands
    }
  }, [persist, storageKey, organizations]);

  // A tenant that disappears (access revoked, org deleted) must not stay
  // current, and the first one to arrive becomes it.
  React.useEffect(() => {
    setCurrentId((prev) => resolveCurrentId(organizations, prev));
  }, [organizations]);

  const switchTo = React.useCallback(
    (id: string) => {
      const org = organizations.find((o) => o.id === id);
      if (!org || id === currentId) return;
      const commit = () => {
        setCurrentId(id);
        if (persist) {
          try {
            localStorage.setItem(storageKey, id);
          } catch {
            // blocked storage — the switch still applies for this session
          }
        }
      };
      setError(null);
      const handler = onSwitchRef.current;
      if (!handler) return commit();
      let result: void | Promise<void>;
      try {
        result = handler(org);
      } catch (err) {
        setError(err); // the host refused the switch
        return;
      }
      if (!result || typeof result.then !== "function") return commit();
      setSwitching(id);
      void result.then(
        () => {
          setSwitching(undefined);
          commit();
        },
        (err: unknown) => {
          setSwitching(undefined);
          setError(err);
        },
      );
    },
    [organizations, currentId, persist, storageKey],
  );

  const value = React.useMemo<OrgCtx>(
    () => ({
      organizations,
      current: organizations.find((o) => o.id === currentId),
      currentId,
      switchTo,
      switching,
      error,
    }),
    [organizations, currentId, switchTo, switching, error],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

/** The current organization and the switcher, for anything that needs to scope
 *  itself. Returns `null` with no {@link OrgProvider} above. */
export function useOrg(): OrgCtx | null {
  return React.useContext(OrgContext);
}

const PLAN_ICON = {
  active: { Icon: CheckCircledIcon, className: "text-emerald-600" },
  trialing: { Icon: CheckCircledIcon, className: "text-amber-500" },
  past_due: { Icon: ExclamationTriangleIcon, className: "text-destructive" },
  canceled: { Icon: ExclamationTriangleIcon, className: "text-muted-foreground" },
} as const;

/** Square mark for a row: the organization's logo, or its initial. */
function OrgMark({
  org,
  className,
}: {
  org: Organization;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted/40 text-sm font-semibold text-[var(--button-primary)]",
        className,
      )}
    >
      {org.logoUrl ? (
        <img src={org.logoUrl} alt="" className="size-full object-contain" />
      ) : (
        <HomeIcon className="size-4" />
      )}
    </span>
  );
}

/**
 * The organization switcher: the brand block at the top of the sidebar, and the
 * list it opens.
 *
 * The design is fixed so every install reads the same way. What you supply is
 * the logic: `OrgProvider` owns switching (see there for replacing it), `onAdd`
 * decides where "Add organization" goes, and `VuiProvider`'s `orgSwitcher`
 * section sets the labels and whether the plan line and Add row appear.
 *
 * ```tsx
 * <OrgSwitcher logo={<Logo />} productName="PULSE" onAdd={() => router.push("/register-business")} />
 * ```
 */
export function OrgSwitcher({
  logo,
  productName,
  collapsed = false,
  onAdd,
  config,
  className,
}: {
  /** The product mark, rendered at the left of the trigger. */
  logo?: React.ReactNode;
  /** The product name, above the current organization. */
  productName: string;
  /** Rail mode: the mark only. */
  collapsed?: boolean;
  /** Where "Add organization" goes. Omit and the row is hidden. */
  onAdd?: () => void;
  /** Per-instance overrides; falls back to `VuiProvider`'s `orgSwitcher`. */
  config?: OrgSwitcherConfig;
  className?: string;
}) {
  const org = useOrg();
  const resolved = useResolved("orgSwitcher", config) ?? {};
  const [open, setOpen] = React.useState(false);

  const showPlan = resolved.showPlan ?? true;
  const heading = resolved.heading ?? "Organizations";
  const addLabel = resolved.addLabel ?? "Add organization";
  const currentLabel = resolved.currentLabel ?? "Current";
  const showAdd = (resolved.showAdd ?? true) && Boolean(onAdd);

  if (!org) return null; // no OrgProvider above: nothing to switch
  const { organizations, current, currentId, switchTo, switching } = org;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Switch organization. Current: ${current?.name ?? "none"}`}
          title={collapsed ? current?.name : undefined}
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
            // Open reads as a held state, so it's obvious the panel belongs to
            // this control.
            open ? "bg-accent" : "hover:bg-sidebar-accent",
            collapsed ? "w-9 shrink-0 justify-center px-0" : "flex-1",
            className,
          )}
        >
          {logo}
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-bold leading-tight tracking-tight text-foreground">
                  {productName}
                </span>
                {/* The line keeps its height while the list loads, so the brand
                    block doesn't jump when the name arrives. */}
                <span className="block h-4 truncate text-xs leading-tight text-muted-foreground">
                  {current?.name ?? (
                    <span className="inline-block h-3 w-20 animate-pulse rounded bg-muted align-middle" />
                  )}
                </span>
              </span>
              <ChevronDownIcon
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
              />
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={6} className="w-72 p-0">
        <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </p>
        <ul role="list" className="max-h-72 overflow-y-auto p-1.5">
          {organizations.map((item) => {
            const isCurrent = item.id === currentId;
            const status = item.planStatus ?? "active";
            const { Icon, className: statusClass } = PLAN_ICON[status];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={switching !== undefined}
                  aria-current={isCurrent || undefined}
                  onClick={() => {
                    switchTo(item.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent disabled:opacity-60"
                >
                  <OrgMark org={item} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold">{item.name}</span>
                      {isCurrent && (
                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {currentLabel}
                        </span>
                      )}
                    </span>
                    {showPlan && item.plan && (
                      <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        {item.plan}
                        <Icon className={cn("size-3.5", statusClass)} />
                      </span>
                    )}
                  </span>
                  {switching === item.id && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      Switching…
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {showAdd && (
          <>
            <div className="h-px bg-border" />
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onAdd?.();
                }}
                className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-dashed border-border">
                  <PlusIcon className="size-4" />
                </span>
                <span className="truncate">{addLabel}</span>
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
