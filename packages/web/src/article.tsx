import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

/* Article blocks that render on the server.
 *
 * Only the pieces that actually need the browser live in article-client.tsx.
 * Keeping these as server components is what lets a page pass them a function
 * like `hrefFor`, which cannot cross the client boundary. */

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
  children: ReactNode;
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
  title: ReactNode;
  description?: ReactNode;
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
