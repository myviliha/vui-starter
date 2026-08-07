"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitHubLogoIcon, HeartFilledIcon } from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Wordmark as BrandWordmark } from "@/app/_components/wordmark";
import { ThemeToggle } from "@/app/_components/theme-toggle";
import { TableOfContents } from "@/components/table-of-contents";
import { DocsSearch } from "@/components/docs-search";
import { SponsorCard } from "@/components/sponsor-card";
import { SponsorBanner } from "@/components/sponsor-banner";
import { COMPONENTS } from "@/app/docs/components/registry";

type NavItem = { label: string; href: string };
type NavGroup = { title: string; items: NavItem[] };

/** Primary top-nav links (shadcn-style). */
const TOP_NAV: NavItem[] = [
  { label: "Home", href: "/docs" },
  { label: "Docs", href: "/docs/installation" },
  { label: "Components", href: "/docs/components" },
  { label: "Charts", href: "/docs/charts" },
  { label: "Blocks", href: "/docs/blocks" },
  { label: "Typeset", href: "/docs/typeset" },
];

/** Left-sidebar "Sections". A registry-driven "Components" group is appended. */
const SECTIONS: NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { label: "❤ Sponsor Me", href: "/docs/sponsor" },
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    title: "Customization",
    items: [
      { label: "Theming", href: "/docs/theming" },
      { label: "Layouts", href: "/docs/layout" },
      { label: "Form layout", href: "/docs/form-layout" },
      { label: "Navigation", href: "/docs/navigation" },
      { label: "Typeset", href: "/docs/typeset" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "AI Agents", href: "/docs/ai-agents" },
      { label: "Templates", href: "/docs/templates" },
      { label: "Shadcn", href: "/docs/shadcn-ui" },
      { label: "Chat", href: "/docs/chat" },
      { label: "Support", href: "/docs/support" },
      { label: "Auth screens", href: "/docs/auth" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "Overview", href: "/docs/components" },
      { label: "Blocks", href: "/docs/blocks" },
      { label: "Data table", href: "/docs/data-table" },
      { label: "Steps", href: "/docs/steps" },
      { label: "Charts", href: "/docs/charts" },
      { label: "Calendar", href: "/docs/calendar" },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Change Log", href: "/docs/changelog" },
      { label: "Contributing", href: "/docs/contributing" },
    ],
  },
];

const COMPONENTS_GROUP: NavGroup = {
  title: "Components",
  items: COMPONENTS.map((c) => ({
    label: c.title,
    href: `/docs/components/${c.slug}`,
  })),
};

const ALL_GROUPS: NavGroup[] = [...SECTIONS, COMPONENTS_GROUP];

const REPO = "https://github.com/myviliha/vui-starter";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-6 p-4">
      {ALL_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-2 pb-1 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
            {group.title}
          </p>
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={`${group.title}-${item.href}`}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-0.5 md:flex">
      {TOP_NAV.map((item) => {
        const active =
          item.href === "/docs"
            ? pathname === "/docs"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The docs home is a full-width marketing page (no sidebar/TOC); every other
  // /docs/* page uses the three-column reference layout.
  const isHome = pathname === "/docs";

  return (
    <div className="flex h-screen flex-col">
      {/* Top nav */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
        <div className="flex items-center gap-6">
          <BrandWordmark href="/docs" />
          <TopNav />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DocsSearch />
          <ThemeToggle />
          <a
            href="https://www.npmjs.com/package/@viliha/vui-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="@viliha/vui-ui on npm"
            title="View on npm"
            className="grid size-8 place-items-center rounded-md transition-colors hover:bg-accent"
          >
            <Image
              src="/npm-logo.png"
              alt="npm"
              width={20}
              height={20}
              className="size-5 object-contain"
            />
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            title="View on GitHub"
            className="grid size-8 place-items-center rounded-md transition-colors hover:bg-accent"
          >
            <GitHubLogoIcon className="size-5" />
          </a>
          <Link
            href="/docs/sponsor"
            title="Sponsor VUI"
            className="flex h-8 items-center gap-1.5 rounded-md bg-[#db61a2] px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#c8508f]"
          >
            <HeartFilledIcon className="size-3.5" />
            <span className="hidden sm:inline">Sponsor</span>
          </Link>
          <Link
            href="/demo"
            title="Open the full working demo app"
            className="hidden h-8 items-center rounded-md bg-[var(--button-primary)] px-3 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors hover:bg-[var(--button-primary-hover)] sm:flex"
          >
            Live Demo
          </Link>
        </div>
      </header>

      <SponsorBanner />

      {isHome ? (
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-sidebar md:block">
            <SidebarNav />
          </aside>
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10 md:px-10">
              <div className="min-w-0 max-w-3xl flex-1">{children}</div>
              <aside className="hidden w-56 shrink-0 xl:block">
                <div className="sticky top-10 space-y-6">
                  <TableOfContents />
                  <SponsorCard />
                </div>
              </aside>
            </div>
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="flex shrink-0 flex-col items-center justify-center gap-2 border-t border-border bg-background px-4 py-2.5 text-xs text-muted-foreground sm:flex-row sm:justify-between md:px-6">
        <span>
          Made with <span className="text-rose-500">♥</span> from Vietnam by the{" "}
          <a
            href="https://viliha.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Viliha Team
          </a>
        </span>
        <iframe
          src="https://github.com/sponsors/myviliha/button"
          title="Sponsor myviliha"
          height={32}
          width={114}
          style={{ border: 0, borderRadius: 6 }}
        />
      </footer>
    </div>
  );
}
