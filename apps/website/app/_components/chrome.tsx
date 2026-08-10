"use client";

import { usePathname } from "next/navigation";

import {
  AnnouncementBar,
  CookieBanner,
  Newsletter,
  SiteFooter,
  SiteHeader,
} from "@viliha/vui-web";

import { FOOTER_COLUMNS, LEGAL, NAV, SITE } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

/**
 * Everything that wraps a page: the announcement, the header, the footer and
 * the cookie notice. One component so every page gets identical chrome, and so
 * the header knows the current path without each page passing it.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh flex-col">
      <AnnouncementBar href="/changelog/" linkLabel="See what shipped" storageKey="site.announcement.v1">
        Version 2 is out, with a faster datatable.
      </AnnouncementBar>

      <SiteHeader
        brand={
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden className="grid size-7 place-items-center rounded-md bg-[var(--button-primary)] text-sm text-[var(--button-primary-foreground)]">
              N
            </span>
            {SITE.name}
          </a>
        }
        items={NAV}
        currentPath={pathname}
        actions={
          <>
            <ThemeToggle />
            <a href="/contact/" className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent">
              Talk to sales
            </a>
            <a
              href="/pricing/"
              className="inline-flex h-8 items-center rounded-md bg-[var(--button-primary)] px-3 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] transition-colors hover:bg-[var(--button-primary-hover)]"
            >
              Start free
            </a>
          </>
        }
      />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter
        brand={<span className="font-semibold tracking-tight">{SITE.name}</span>}
        blurb={SITE.description}
        columns={FOOTER_COLUMNS}
        legal={LEGAL}
        copyright={`© ${new Date().getFullYear()} ${SITE.company}`}
        newsletter={
          <Newsletter
            variant="compact"
            title="Product updates, once a month"
            lead="No marketing, just what shipped."
            footnote="Unsubscribe in one click."
          />
        }
        social={[
          { label: "GitHub", href: "https://github.com/myviliha/vui-starter", icon: <GitHubIcon /> },
          { label: "X", href: "https://x.com", icon: <XIcon /> },
        ]}
      />

      <CookieBanner policyHref="/privacy/" />
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="vui-icon-plain size-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.9 5.1 19 5.4 19 5.4c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="vui-icon-plain size-4 fill-current">
      <path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.8-8.9L1 2h7l4.8 6.3L18.9 2Zm-1.1 18h1.7L7.3 3.7H5.5L17.8 20Z" />
    </svg>
  );
}
