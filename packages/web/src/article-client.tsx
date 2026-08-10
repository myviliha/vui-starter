"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

/* The article pieces that need the browser: sharing uses the clipboard, the
   table of contents observes scroll position, and the progress bar measures it.
   Everything else in article.tsx stays a server component. */

/**
 * Share links.
 *
 * Real URLs rather than SDK buttons: no third-party script, no tracking pixel,
 * and they work with JavaScript disabled. Copy-link is the one that needs JS,
 * and it degrades to nothing if the clipboard is unavailable.
 */
export function ShareBlock({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const encoded = { url: encodeURIComponent(url), title: encodeURIComponent(title) };

  const targets = [
    { label: "X", href: `https://x.com/intent/post?text=${encoded.title}&url=${encoded.url}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}` },
    { label: "Email", href: `mailto:?subject=${encoded.title}&body=${encoded.url}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked or unavailable — the share links still work
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-caption text-muted-foreground">Share</span>
      {targets.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md border border-border px-3 py-1.5 text-caption transition-colors hover:bg-accent"
        >
          {t.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-caption transition-colors hover:bg-accent"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

/**
 * Table of contents with scroll-spy.
 *
 * Uses IntersectionObserver rather than a scroll handler, so it costs nothing
 * per frame, and it falls back to a plain list of links if the API is missing.
 */
export function TableOfContents({
  items,
  title = "On this page",
  className,
}: {
  items: TocItem[];
  title?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState<string | null>(items[0]?.id ?? null);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trigger when a heading reaches the upper third, which is where a reader
      // considers themselves to be.
      { rootMargin: "0px 0px -66% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className={cn("flex flex-col gap-3", className)}>
      <p className="text-caption font-semibold tracking-wide uppercase">{title}</p>
      <ul className="flex flex-col gap-1.5 border-s border-border">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "ps-3")}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ms-px block border-s-2 ps-3 text-sm transition-colors",
                active === item.id
                  ? "border-[var(--button-primary)] font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A bar that fills as the reader moves down the article. */
export function ReadingProgress({ className }: { className?: string }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Decorative: the same information is available from the scrollbar, so it is
    // hidden from assistive tech rather than announced on every scroll.
    <div aria-hidden className={cn("fixed inset-x-0 top-0 z-30 h-0.5 bg-transparent", className)}>
      <div
        className="h-full bg-[var(--button-primary)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

