"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Badge } from "@viliha/vui-ui/badge";
import { Wordmark as BrandWordmark } from "@/app/_components/wordmark";

type NavItem = { label: string; href: string };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    title: "Customization",
    items: [
      { label: "Theming", href: "/docs/theming" },
      { label: "Layout & patterns", href: "/docs/layout" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Building with AI agents", href: "/docs/ai-agents" },
      { label: "Requirement templates", href: "/docs/templates" },
      { label: "Using shadcn/ui", href: "/docs/shadcn-ui" },
      { label: "Auth screens", href: "/docs/auth" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "Components", href: "/docs/components" },
      { label: "Data table", href: "/docs/data-table" },
      { label: "Steps", href: "/docs/steps" },
      { label: "Charts", href: "/docs/charts" },
    ],
  },
  {
    title: "Community",
    items: [{ label: "Contributing", href: "/docs/contributing" }],
  },
];

const REPO = "https://github.com/myviliha/vui-starter";

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <BrandWordmark href="/docs" />
      <Badge variant="muted">Docs</Badge>
    </div>
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
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to app
          </Link>
          <a
            href="https://www.npmjs.com/package/@viliha/vui-ui"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            @viliha/vui-ui
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

      {/* Footer */}
      <footer className="shrink-0 border-t border-border bg-background px-4 py-2.5 text-center text-xs text-muted-foreground md:px-6">
        Made with <span className="text-rose-500">♥</span> from Vietnam by the{" "}
        <a
          href="https://viliha.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground hover:underline"
        >
          Viliha Team
        </a>
      </footer>
    </div>
  );
}
