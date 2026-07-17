"use client";

import {
  BellIcon,
  GearIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircledIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { usePageChrome } from "@viliha/vui-ui/record-view";

import { SidebarToggle } from "@/app/_components/app-sidebar";
import { UserMenu } from "@/app/_components/user-menu";
import { colorFor } from "@/app/_components/route-meta";

/** Global top bar: sidebar toggle + page title (left), centered search,
    help + notifications (right). */
export function TopBar() {
  const { page } = usePageChrome();
  const pathname = usePathname();
  const PageIcon = page?.icon;

  return (
    <header className="relative flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      {/* Left — sidebar toggle + current page title/icon */}
      <SidebarToggle />
      <div className="flex min-w-0 items-center gap-2">
        {PageIcon && (
          <PageIcon className={`size-4 shrink-0 ${colorFor(pathname)}`} />
        )}
        {page && (
          <h1 className="truncate font-semibold tracking-tight">
            {page.title}
          </h1>
        )}
      </div>

      {/* Center — global search */}
      <div className="absolute left-1/2 top-1/2 hidden w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4 md:block">
        <div className="relative">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search…"
            aria-label="Global search"
            className="h-8 pl-9"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right — help, notifications, settings, profile.
          Bold, dark, larger glyphs (heavier stroke via [&_path]). */}
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Help &amp; support">
          <QuestionMarkCircledIcon className="size-5 text-foreground [&_path]:[stroke-width:1px]" />
        </Button>
        <Link
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Documentation (opens in a new tab)"
          className="grid size-9 shrink-0 place-items-center rounded-md transition-colors hover:bg-accent"
        >
          <ReaderIcon className="size-5 text-foreground [&_path]:[stroke-width:1px]" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <BellIcon className="size-5 text-foreground [&_path]:[stroke-width:1px]" />
          <span
            className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--button-primary)] ring-2 ring-background"
            aria-hidden="true"
          />
        </Button>
        <Link
          href="/settings"
          aria-label="Settings"
          className="grid size-9 shrink-0 place-items-center rounded-md transition-colors hover:bg-accent"
        >
          <GearIcon className="size-5 text-foreground [&_path]:[stroke-width:1px]" />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
