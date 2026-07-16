"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { cn } from "@myviliha/vui-ui/utils";
import { Badge } from "@myviliha/vui-ui/badge";

type NavItem = { label: string; href: string };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { label: "Introduction", href: "/" },
      { label: "Installation", href: "/installation" },
    ],
  },
  {
    title: "Customization",
    items: [{ label: "Theming", href: "/theming" }],
  },
  {
    title: "Guides",
    items: [{ label: "Using shadcn/ui", href: "/shadcn-ui" }],
  },
  {
    title: "Reference",
    items: [{ label: "Components", href: "/components" }],
  },
  {
    title: "Community",
    items: [{ label: "Contributing", href: "/contributing" }],
  },
];

const REPO = "https://github.com/myviliha/vui-starter";

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" role="img" aria-label="Vui" className="h-6 w-6">
        <rect width="24" height="24" rx="6" fill="var(--brand-indigo)" />
        <path
          d="M6.5 7.25 L12 16.75 L17.5 7.25"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-foreground">
        Vui Starter
      </span>
      <Badge variant="muted" className="ml-1">
        Docs
      </Badge>
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-6 p-4">
      {NAV.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-2 pb-1 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
            {group.title}
          </p>
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
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

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      {/* Top header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
        <Wordmark />
        <div className="flex items-center gap-3">
          <a
            href="https://www.npmjs.com/package/@myviliha/vui-ui"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            @myviliha/vui-ui
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <GitHubLogoIcon className="size-4" />
          </a>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-sidebar md:block">
          <SidebarNav />
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
