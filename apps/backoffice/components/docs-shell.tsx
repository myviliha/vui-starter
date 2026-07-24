"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Badge } from "@viliha/vui-ui/badge";
import { Logo } from "@/app/_components/logo";
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
      { label: "Navigation & tabs", href: "/docs/navigation" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Building with AI agents", href: "/docs/ai-agents" },
      { label: "Requirement templates", href: "/docs/templates" },
      { label: "Using shadcn/ui", href: "/docs/shadcn-ui" },
      { label: "Chat", href: "/docs/chat" },
      { label: "Support & ticketing", href: "/docs/support" },
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
      { label: "Calendar", href: "/docs/calendar" },
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
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Logo className="size-4" />
            Back to app
          </Link>
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
            {/* npm-red for visual consistency with the npm mark beside it */}
            <GitHubLogoIcon className="size-5 text-[#CB3837]" />
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
