"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

/* Article blocks: the pieces a blog post is made of. */

/**
 * Long-form typography.
 *
 * Styles are applied by element from here rather than by a class on every tag,
 * because the body of a post arrives as rendered MDX or HTML that cannot carry
 * our classes. Widths cap at ~68 characters, which is where prose stops being
 * comfortable to read.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-body leading-relaxed text-foreground",
        "[&>*+*]:mt-5",
        "[&_h2]:mt-10 [&_h2]:text-h2 [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:text-h3 [&_h3]:font-semibold [&_h3]:tracking-tight",
        "[&_h4]:mt-6 [&_h4]:text-h4 [&_h4]:font-semibold",
        "[&_p]:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-[var(--button-primary)] [&_a]:underline [&_a]:underline-offset-4",
        "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ps-6 [&_ol]:ps-6 [&_li]:text-muted-foreground [&_li+li]:mt-2",
        "[&_blockquote]:border-s-2 [&_blockquote]:border-[var(--button-primary)] [&_blockquote]:ps-5 [&_blockquote]:text-lead [&_blockquote]:text-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]",
        "[&_pre]:vui-scroll [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-card [&_pre]:p-4 [&_pre]:text-sm",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_img]:rounded-xl [&_img]:border [&_img]:border-border",
        "[&_hr]:border-border",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border-b [&_th]:border-border [&_th]:pb-2 [&_th]:text-start [&_th]:font-medium",
        "[&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ArticleAuthor {
  name: string;
  role?: string;
  avatar?: string;
  href?: string;
  bio?: string;
}

/** Title, meta and cover image. The top of a post. */
export function ArticleHeader({
  title,
  description,
  category,
  date,
  readingTime,
  author,
  cover,
  coverAlt = "",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  category?: string;
  /** ISO date. Rendered in a <time>, so it is machine-readable. */
  date?: string;
  readingTime?: string;
  author?: ArticleAuthor;
  cover?: string;
  coverAlt?: string;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-4">
        {category && (
          <p className="text-caption font-medium tracking-wide text-[var(--button-primary)] uppercase">
            {category}
          </p>
        )}
        <h1 className="text-h1 font-semibold tracking-tight text-balance">{title}</h1>
        {description && <p className="text-lead text-muted-foreground">{description}</p>}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-muted-foreground">
          {author && (
            <span className="flex items-center gap-2">
              {author.avatar ? (
                <img src={author.avatar} alt="" className="size-6 rounded-full object-cover" />
              ) : null}
              <span className="font-medium text-foreground">{author.name}</span>
            </span>
          )}
          {date && (
            <time dateTime={date}>
              {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}
          {readingTime && <span>{readingTime}</span>}
        </div>
      </div>
      {cover && (
        <img
          src={cover}
          alt={coverAlt}
          // The cover is the LCP element on a post, so it loads eagerly.
          loading="eager"
          fetchPriority="high"
          className="aspect-[16/9] w-full rounded-xl border border-border object-cover"
        />
      )}
    </header>
  );
}

/** The author, expanded. Sits under the article body. */
export function AuthorCard({ author, className }: { author: ArticleAuthor; className?: string }) {
  return (
    <div className={cn("flex gap-4 rounded-xl border border-border bg-card p-5", className)}>
      {author.avatar ? (
        <img src={author.avatar} alt="" className="size-12 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted font-medium text-muted-foreground">
          {author.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-semibold">
          {author.href ? (
            <a href={author.href} className="underline-offset-4 hover:underline">
              {author.name}
            </a>
          ) : (
            author.name
          )}
        </p>
        {author.role && <p className="text-caption text-muted-foreground">{author.role}</p>}
        {author.bio && <p className="text-sm leading-relaxed text-muted-foreground">{author.bio}</p>}
      </div>
    </div>
  );
}

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

/** Previous and next post, at the end of an article. */
export function ArticlePager({
  previous,
  next,
  className,
}: {
  previous?: { label: string; href: string };
  next?: { label: string; href: string };
  className?: string;
}) {
  return (
    <nav aria-label="Article" className={cn("flex items-stretch justify-between gap-3 border-t border-border pt-6", className)}>
      {previous ? (
        <a href={previous.href} className="group flex flex-1 flex-col gap-0.5 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-accent">
          <span className="text-caption text-muted-foreground">Previous</span>
          <span className="font-medium">{previous.label}</span>
        </a>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <a href={next.href} className="group flex flex-1 flex-col items-end gap-0.5 rounded-lg border border-border px-4 py-3 text-end transition-colors hover:bg-accent">
          <span className="text-caption text-muted-foreground">Next</span>
          <span className="font-medium">{next.label}</span>
        </a>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}

/** Tags on a post, linking to their archives. */
export function ArticleTags({
  tags,
  hrefFor,
  className,
}: {
  tags: string[];
  hrefFor?: (tag: string) => string;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag}>
          {hrefFor ? (
            <a href={hrefFor(tag)} className="inline-block rounded-full border border-border px-3 py-1 text-caption text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {tag}
            </a>
          ) : (
            <span className="inline-block rounded-full border border-border px-3 py-1 text-caption text-muted-foreground">
              {tag}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
