"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExitIcon,
  GearIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Avatar, AvatarFallback } from "@myviliha/vui-ui/avatar";
import { MenuItem } from "@myviliha/vui-ui/menu";
import { ThemeToggle } from "./theme-toggle";

// ponytail: no auth in the demo — mock the signed-in user. Swap for the real
// session/role check when wiring auth; the admin item keys off `isAdmin`.
const USER = {
  name: "Admin User",
  email: "admin@viliha.example",
  role: "Administrator",
  initials: "AU",
};
const isAdmin = USER.role === "Administrator";

/** GitLab-style profile menu in the top bar: avatar → popup with account
 *  info, an admin-only entry, appearance toggle, and sign out. */
export function UserMenu() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-accent"
      >
        <Avatar className="size-8">
          <AvatarFallback className="font-semibold text-foreground">
            {USER.initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div
          role="menu"
          className="vui-pop-in absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md"
          style={{ "--vui-pop-origin": "top right" } as React.CSSProperties}
        >
          {/* Account header */}
          <div className="flex items-center gap-3 border-b border-border px-3 py-3">
            <Avatar className="size-9">
              <AvatarFallback>{USER.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{USER.name}</p>
              <p className="truncate text-muted-foreground">{USER.email}</p>
            </div>
          </div>

          {/* Menu items — MenuItem bakes in the bordered-row standard */}
          <MenuItem as={Link} href="/settings" onClick={() => setOpen(false)}>
            <PersonIcon className="size-4 text-sky-500" />
            Profile
          </MenuItem>
          <MenuItem as={Link} href="/settings" onClick={() => setOpen(false)}>
            <GearIcon className="size-4 text-slate-500" />
            Settings
          </MenuItem>
          {isAdmin && (
            <MenuItem
              as={Link}
              href="/system/regions"
              onClick={() => setOpen(false)}
              className="font-medium"
            >
              <LockClosedIcon className="size-4 text-amber-500" />
              Admin area
            </MenuItem>
          )}
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <span className="text-muted-foreground">Appearance</span>
            <ThemeToggle />
          </div>
          <MenuItem as={Link} href="/auth/signin" onClick={() => setOpen(false)}>
            <ExitIcon className="size-4 text-rose-500" />
            Sign out
          </MenuItem>
        </div>
      )}
    </div>
  );
}
