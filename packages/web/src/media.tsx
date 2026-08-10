"use client";

import * as React from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/* Media and utility blocks: pictures, video, embeds, cards, carousels. */

/**
 * A responsive image with an aspect ratio, so the space is reserved before it
 * loads. That is what stops the page jumping, which is the whole of CLS.
 */
export function ImageBlock({
  src,
  alt,
  caption,
  ratio = "16/9",
  rounded = true,
  priority,
  className,
}: {
  src: string;
  /** Required. Empty string is correct only for decoration. */
  alt: string;
  caption?: React.ReactNode;
  ratio?: "16/9" | "4/3" | "1/1" | "3/2" | "auto";
  rounded?: boolean;
  /** Above the fold: loads eagerly and is fetched at high priority. */
  priority?: boolean;
  className?: string;
}) {
  const ratios = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/2": "aspect-[3/2]",
    auto: "",
  };
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={cn("w-full object-cover", ratios[ratio], rounded && "rounded-xl border border-border")}
      />
      {caption && <figcaption className="text-caption text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

/** A gallery. Click opens a lightbox; Escape and the backdrop close it. */
export function ImageGallery({
  items,
  title,
  lead,
  columns = 3,
  tone,
  className,
}: {
  items: { src: string; alt: string; caption?: string }[];
  title?: React.ReactNode;
  lead?: React.ReactNode;
  columns?: 2 | 3 | 4;
  tone?: SectionTone;
  className?: string;
}) {
  const [open, setOpen] = React.useState<number | null>(null);
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];

  React.useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const current = open === null ? null : items[open];

  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader title={title} lead={lead} align="center" className="mb-10" />}
      <ul className={cn("grid gap-4", cols)}>
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        // z-[250]: a lightbox covers everything, including any menu that was open.
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || "Image"}
          onClick={() => setOpen(null)}
          className="vui-overlay-in fixed inset-0 z-[250] flex items-center justify-center bg-foreground/80 p-4"
        >
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[80svh] w-auto rounded-lg object-contain" />
            {current.caption && (
              <figcaption className="mt-3 text-center text-sm text-background">{current.caption}</figcaption>
            )}
          </figure>
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute end-4 top-4 grid size-9 cursor-pointer place-items-center rounded-md bg-background/10 text-background transition-colors hover:bg-background/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="vui-icon-plain size-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </Section>
  );
}

/**
 * Video. A `src` plays inline; an `embedUrl` renders an iframe behind a poster,
 * so a YouTube embed costs nothing until someone actually clicks play.
 */
export function VideoBlock({
  src,
  embedUrl,
  poster,
  title = "Video",
  caption,
  tone,
  className,
}: {
  src?: string;
  embedUrl?: string;
  poster?: string;
  title?: string;
  caption?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <Section tone={tone} width="lg" className={className}>
      <figure className="flex flex-col gap-3">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
          {src ? (
            <video src={src} poster={poster} controls playsInline className="size-full object-cover">
              <track kind="captions" />
            </video>
          ) : playing && embedUrl ? (
            <iframe
              src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play: ${title}`}
              className="group relative size-full cursor-pointer"
            >
              {poster && <img src={poster} alt="" className="size-full object-cover" />}
              <span className="absolute inset-0 grid place-items-center bg-foreground/30 transition-colors group-hover:bg-foreground/40">
                <span className="grid size-16 place-items-center rounded-full bg-background/90 shadow-[var(--shadow-3)]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="vui-icon-plain ms-1 size-7 fill-foreground">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
        {caption && <figcaption className="text-caption text-muted-foreground">{caption}</figcaption>}
      </figure>
    </Section>
  );
}

/** Anything embeddable: a map, a form, a calendar. Lazy by default. */
export function EmbedBlock({
  src,
  title,
  ratio = "16/9",
  tone,
  className,
}: {
  src: string;
  /** Required: an unlabelled iframe is unusable with a screen reader. */
  title: string;
  ratio?: "16/9" | "4/3" | "1/1";
  tone?: SectionTone;
  className?: string;
}) {
  const ratios = { "16/9": "aspect-video", "4/3": "aspect-[4/3]", "1/1": "aspect-square" };
  return (
    <Section tone={tone} width="lg" className={className}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className={cn("w-full rounded-xl border border-border", ratios[ratio])}
      />
    </Section>
  );
}

/** A location map. Same as an embed, with an address and directions beside it. */
export function MapBlock({
  embedSrc,
  title = "Map",
  address,
  directionsHref,
  tone,
  className,
}: {
  embedSrc: string;
  title?: string;
  address?: React.ReactNode;
  directionsHref?: string;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} className={className}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <iframe src={embedSrc} title={title} loading="lazy" className="aspect-[16/10] w-full rounded-xl border border-border" />
        {(address || directionsHref) && (
          <div className="flex flex-col gap-3">
            {address && <address className="text-sm leading-relaxed text-muted-foreground not-italic">{address}</address>}
            {directionsHref && (
              <a href={directionsHref} target="_blank" rel="noreferrer noopener" className="text-sm font-medium text-[var(--button-primary)] underline-offset-4 hover:underline">
                Get directions
              </a>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

export interface CardItem {
  title: React.ReactNode;
  body?: React.ReactNode;
  href?: string;
  image?: string;
  /** "Guide", "Case study", "5 min read". */
  meta?: React.ReactNode;
  tags?: string[];
}

/** The generic content card grid: blog posts, resources, guides, anything. */
export function CardGrid({
  items,
  title,
  eyebrow,
  lead,
  columns = 3,
  tone,
  className,
}: {
  items: CardItem[];
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  columns?: 2 | 3 | 4;
  tone?: SectionTone;
  className?: string;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} className="mb-10" />}
      <ul className={cn("grid gap-6", cols)}>
        {items.map((item, i) => {
          const inner = (
            <>
              {item.image && (
                <img src={item.image} alt="" loading="lazy" className="aspect-[16/9] w-full rounded-t-xl object-cover" />
              )}
              <span className="flex flex-1 flex-col gap-2 p-5">
                {item.meta && <span className="text-caption text-muted-foreground">{item.meta}</span>}
                <span className="text-h4 font-semibold tracking-tight">{item.title}</span>
                {item.body && <span className="leading-relaxed text-muted-foreground">{item.body}</span>}
                {item.tags && (
                  <span className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {item.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border px-2 py-0.5 text-caption text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </>
          );
          const shell = "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-1)] transition-colors";
          return (
            <li key={i} className="contents">
              {item.href ? (
                <a href={item.href} className={cn(shell, "hover:border-[var(--button-primary)]/50")}>
                  {inner}
                </a>
              ) : (
                <div className={shell}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** Variable-height cards, for screenshots or quotes of different lengths. */
export function MasonryGrid({
  children,
  columns = 3,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const cols = { 2: "sm:columns-2", 3: "sm:columns-2 lg:columns-3", 4: "sm:columns-2 lg:columns-4" }[columns];
  return (
    <div className={cn("columns-1 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid", cols, className)}>
      {children}
    </div>
  );
}

/**
 * A scroll-snap carousel. No JavaScript for the scrolling itself: the browser
 * does it natively, keyboard and touch both work, and the arrows only nudge it.
 */
export function Carousel({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  /** Names the region for screen readers. */
  label: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const nudge = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="vui-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&>*]:snap-start [&>*]:shrink-0"
      >
        {children}
      </div>
      <div className="mt-2 flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => nudge(d)}
            aria-label={d === -1 ? "Previous" : "Next"}
            className="grid size-9 cursor-pointer place-items-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
              className={cn("vui-icon-plain size-4", d === -1 && "rotate-180")}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/** A file or asset to download, with its type and size stated up front. */
export function DownloadBlock({
  items,
  title,
  lead,
  tone,
  className,
}: {
  items: { label: string; href: string; meta?: string; icon?: React.ReactNode }[];
  title?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} width="md" className={className}>
      {title && <SectionHeader title={title} lead={lead} className="mb-8" />}
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} download className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-accent/40">
              <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-muted/50 text-[var(--button-primary)]">
                {item.icon ?? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="vui-icon-plain size-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.label}</span>
                {item.meta && <span className="block text-caption text-muted-foreground">{item.meta}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
