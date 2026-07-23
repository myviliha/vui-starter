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

import { usePageChrome } from "@viliha/vui-ui/record-view";

import { SidebarToggle } from "@/app/_components/app-sidebar";
import { UserMenu } from "@/app/_components/user-menu";
import { useGlobalSearch } from "@/app/_components/global-search";
import { colorFor } from "@/app/_components/route-meta";
import { Shortcut } from "@viliha/vui-ui/kbd";

/** One shared size for every top-bar icon control, so the cluster is uniform. */
const iconControl =
  "grid size-9 shrink-0 place-items-center rounded-md transition-colors hover:bg-accent";
const iconGlyph = "size-5 text-foreground [&_path]:[stroke-width:1px]";

/** Global top bar: sidebar toggle + page title (left), centered search,
    help + notifications (right). */
export function TopBar() {
  const { page } = usePageChrome();
  const pathname = usePathname();
  const PageIcon = page?.icon;
  // Global search (records) lives in GlobalSearchProvider; the box below is its
  // launcher. Quick actions (pages) is a separate ⌘K palette in the sidebar.
  const { open: openSearch } = useGlobalSearch();

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

      {/* Center — global search launcher (opens the records palette). */}
      <div className="absolute left-1/2 top-1/2 hidden w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4 md:block">
        <button
          type="button"
          onClick={openSearch}
          aria-label="Global search"
          className="flex h-8 w-full items-center gap-2 rounded-md border border-input bg-background px-2.5 text-muted-foreground transition-colors hover:bg-accent"
        >
          <MagnifyingGlassIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left text-sm">Search…</span>
          <Shortcut keys={["⌘", "⌥", "K"]} />
        </button>
      </div>

      {/* Right — help, notifications, settings, profile.
          Bold, dark, larger glyphs (heavier stroke via [&_path]). */}
      {/* All controls share one size (size-9 box, size-5 glyph) so the cluster
          is visually uniform — see iconControl. */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Help &amp; support"
          className={`hidden sm:grid ${iconControl}`}
        >
          <QuestionMarkCircledIcon className={iconGlyph} />
        </button>
        <Link
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Documentation (opens in a new tab)"
          className={iconControl}
        >
          <ReaderIcon className={iconGlyph} />
        </Link>
        <button
          type="button"
          aria-label="Notifications"
          className={`relative ${iconControl}`}
        >
          <BellIcon className={iconGlyph} />
          <span
            className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--button-primary)] ring-2 ring-background"
            aria-hidden="true"
          />
        </button>
        <Link
          href="/settings"
          aria-label="Settings"
          className={`hidden sm:grid ${iconControl}`}
        >
          <GearIcon className={iconGlyph} />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
