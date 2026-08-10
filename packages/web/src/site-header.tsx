"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

/* The site header: logo, navigation, actions, and a mobile drawer. */

export interface NavChild {
  label: string;
  href: string;
  /** One line under the label. Mega menus read poorly without it. */
  description?: string;
  icon?: React.ReactNode;
}

export interface NavItem {
  label: string;
  href?: string;
  /** Present means this opens a panel rather than navigating. */
  children?: NavChild[];
  /** Promoted content in the panel's last column. */
  featured?: { title: string; body?: string; href: string; label?: string };
}

export interface SiteHeaderProps {
  /** Wordmark or logo. Wrap it in your own link. */
  brand: React.ReactNode;
  items?: NavItem[];
  /** Sign-in link, a CTA button, a theme toggle. */
  actions?: React.ReactNode;
  /** Follows the page as it scrolls. */
  sticky?: boolean;
  /** Sits over the hero until the page scrolls, then gains a solid background. */
  transparent?: boolean;
  /** Marks the current page in the nav. */
  currentPath?: string;
  className?: string;
}

export function SiteHeader({
  brand,
  items = [],
  actions,
  sticky = true,
  transparent,
  currentPath,
  className,
}: SiteHeaderProps) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  // A transparent header only earns its background once there is something
  // behind it. Passive listener: this fires on every scroll frame.
  React.useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  // Escape closes a panel; a click outside does too. Both are what a user
  // expects from a menu and neither is free with a hand-rolled one.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  // The drawer owns the screen while it is open, so the page behind must not
  // scroll under it.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const solid = !transparent || scrolled || mobileOpen;

  return (
    <header
      ref={navRef}
      className={cn(
        "z-30 w-full transition-colors",
        sticky && "sticky top-0",
        transparent && !solid
          ? "bg-transparent text-white"
          : "border-b border-border bg-background/85 backdrop-blur",
        className,
      )}
    >
      <div className="vui-container flex h-14 items-center gap-6">
        <div className="flex shrink-0 items-center">{brand}</div>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={open === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpen(open === item.label ? null : item.label)}
                  className={cn(
                    "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors",
                    open === item.label ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                  )}
                >
                  {item.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
                    className={cn("vui-icon-plain size-3.5 transition-transform", open === item.label && "rotate-180")}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {open === item.label && (
                  // z-[200] is the documented layer for menus, so this clears a
                  // sticky header and anything else on the page.
                  <div className="vui-pop-in absolute start-0 top-full z-[200] mt-2 w-[min(46rem,90vw)] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-[var(--shadow-4)]">
                    <div className={cn("grid gap-1", item.featured ? "md:grid-cols-[1fr_1fr_14rem]" : "md:grid-cols-2")}>
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(null)}
                          className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                          {child.icon && (
                            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border border-border bg-muted/50 text-[var(--button-primary)]">
                              {child.icon}
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block text-sm font-medium">{child.label}</span>
                            {child.description && (
                              <span className="block text-caption leading-relaxed text-muted-foreground">
                                {child.description}
                              </span>
                            )}
                          </span>
                        </a>
                      ))}
                      {item.featured && (
                        <a
                          href={item.featured.href}
                          onClick={() => setOpen(null)}
                          className="flex flex-col gap-2 rounded-lg bg-[var(--button-primary)]/[0.07] p-4 transition-colors hover:bg-[var(--button-primary)]/[0.12]"
                        >
                          <span className="text-sm font-medium">{item.featured.title}</span>
                          {item.featured.body && (
                            <span className="text-caption leading-relaxed text-muted-foreground">
                              {item.featured.body}
                            </span>
                          )}
                          <span className="mt-auto text-caption font-medium text-[var(--button-primary)]">
                            {item.featured.label ?? "Learn more"}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                aria-current={currentPath === item.href ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent/60",
                  currentPath === item.href && "bg-accent text-accent-foreground",
                )}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">{actions}</div>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-9 cursor-pointer place-items-center rounded-md transition-colors hover:bg-accent md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="vui-icon-plain size-5">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="site-mobile-nav" className="vui-fade-in border-t border-border bg-background md:hidden">
          <nav aria-label="Mobile" className="vui-container vui-scroll max-h-[calc(100svh-3.5rem)] overflow-y-auto py-4">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.label} className="border-b border-border last:border-b-0">
                  {item.children ? (
                    <details className="group">
                      <summary className="flex cursor-pointer items-center justify-between px-1 py-3 font-medium [&::-webkit-details-marker]:hidden [&::marker]:content-['']">
                        {item.label}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="vui-icon-plain size-4 transition-transform group-open:rotate-180">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </summary>
                      <ul className="flex flex-col pb-2 ps-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a href={child.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground">
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <a href={item.href} onClick={() => setMobileOpen(false)} className="block px-1 py-3 font-medium">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {actions && <div className="flex flex-col gap-2 pt-4">{actions}</div>}
          </nav>
        </div>
      )}
    </header>
  );
}
