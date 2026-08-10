import type { ReactNode } from "react";

import { cn } from "@viliha/vui-core";

import { Section, type SectionTone } from "./section";
import { SectionHeader } from "./section-header";

/* Social proof: the numbers, the logos, and the things customers said. */

export interface StatItem {
  value: ReactNode;
  label: ReactNode;
  /** "+12% this quarter". Rendered smaller, under the label. */
  detail?: ReactNode;
}

export interface StatsProps {
  items: StatItem[];
  title?: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  tone?: SectionTone;
  /** Bordered card per stat, rather than a bare row. */
  boxed?: boolean;
  className?: string;
}

export function Stats({ items, title, eyebrow, lead, tone, boxed, className }: StatsProps) {
  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />}
      <dl
        className={cn(
          "grid gap-6 sm:grid-cols-2",
          items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {items.map((s, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-1 text-center",
              boxed && "rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-1)]",
            )}
          >
            <dt className="order-2 text-sm font-medium text-muted-foreground">{s.label}</dt>
            <dd className="order-1 text-h2 font-semibold tracking-tight text-foreground">{s.value}</dd>
            {s.detail && <dd className="order-3 text-caption text-muted-foreground">{s.detail}</dd>}
          </div>
        ))}
      </dl>
    </Section>
  );
}

export interface LogoItem {
  name: string;
  /** An <img>, an inline SVG, or nothing: the name renders as text if absent. */
  logo?: ReactNode;
  href?: string;
}

export interface LogoCloudProps {
  items: LogoItem[];
  title?: ReactNode;
  lead?: ReactNode;
  /** `marquee` scrolls continuously; it pauses for reduced-motion users. */
  variant?: "grid" | "marquee";
  tone?: SectionTone;
  className?: string;
}

/** Customer or partner logos. Muted until hovered, so they support rather than shout. */
export function LogoCloud({ items, title, lead, variant = "grid", tone, className }: LogoCloudProps) {
  const logo = (item: LogoItem, key: number) => {
    const content = (
      <span className="grid h-10 place-items-center text-sm font-semibold text-muted-foreground opacity-70 transition-opacity hover:opacity-100">
        {item.logo ?? item.name}
      </span>
    );
    return item.href ? (
      <a key={key} href={item.href} aria-label={item.name} className="min-w-28 shrink-0">
        {content}
      </a>
    ) : (
      // `title` only when a logo image stands in for the name; otherwise the
      // name is already the visible text and a tooltip repeating it is noise.
      <div key={key} className="min-w-28 shrink-0" title={item.logo ? item.name : undefined}>
        {content}
      </div>
    );
  };

  return (
    <Section tone={tone} tight className={className}>
      {title && (
        <p className="mb-8 text-center text-caption font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
      )}
      {lead && <p className="mb-8 text-center text-muted-foreground">{lead}</p>}
      {variant === "marquee" ? (
        // The list is rendered twice so the loop has no seam. The copy is hidden
        // from assistive tech, and the animation stops entirely when the reader
        // has asked for less motion.
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-[vui-marquee_36s_linear_infinite] items-center gap-12 motion-reduce:animate-none">
            {items.map(logo)}
            <span aria-hidden className="contents">
              {items.map((item, i) => logo(item, i + items.length))}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {items.map(logo)}
        </div>
      )}
    </Section>
  );
}

export interface Testimonial {
  quote: ReactNode;
  author: string;
  role?: string;
  company?: string;
  /** Avatar image URL. Initials are shown when absent. */
  avatar?: string;
  /** 1 to 5. Renders stars above the quote. */
  rating?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cn("size-3.5", n <= rating ? "fill-[var(--chart-4)]" : "fill-border")}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
      {letters}
    </span>
  );
}

function Attribution({ t }: { t: Testimonial }) {
  return (
    <div className="flex items-center gap-3">
      {t.avatar ? (
        <img src={t.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
      ) : (
        <Initials name={t.author} />
      )}
      <span className="min-w-0">
        <span className="block truncate font-medium">{t.author}</span>
        {(t.role || t.company) && (
          <span className="block truncate text-caption text-muted-foreground">
            {[t.role, t.company].filter(Boolean).join(", ")}
          </span>
        )}
      </span>
    </div>
  );
}

export interface TestimonialsProps {
  items: Testimonial[];
  title?: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** `single` for one big quote, `grid` for a wall, `columns` for a masonry feel. */
  variant?: "single" | "grid" | "columns";
  tone?: SectionTone;
  className?: string;
}

export function Testimonials({
  items,
  title,
  eyebrow,
  lead,
  variant = "grid",
  tone,
  className,
}: TestimonialsProps) {
  if (variant === "single") {
    const t = items[0];
    if (!t) return null;
    return (
      <Section tone={tone} width="md" className={className}>
        <figure className="flex flex-col items-center gap-6 text-center">
          {t.rating && <Stars rating={t.rating} />}
          <blockquote className="text-h3 leading-snug font-medium text-balance">
            {t.quote}
          </blockquote>
          <figcaption>
            <Attribution t={t} />
          </figcaption>
        </figure>
      </Section>
    );
  }

  return (
    <Section tone={tone} className={className}>
      {title && <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-10" />}
      <div
        className={cn(
          variant === "columns"
            ? "columns-1 gap-6 sm:columns-2 lg:columns-3 [&>figure]:mb-6 [&>figure]:break-inside-avoid"
            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items.map((t, i) => (
          <figure
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-1)]"
          >
            {t.rating && <Stars rating={t.rating} />}
            <blockquote className="leading-relaxed text-muted-foreground">{t.quote}</blockquote>
            <figcaption className="mt-auto">
              <Attribution t={t} />
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/** A large editorial pull-quote, for an about page or between long sections. */
export function QuoteBlock({
  quote,
  author,
  role,
  tone,
  className,
}: {
  quote: ReactNode;
  author?: string;
  role?: string;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} width="md" className={className}>
      <figure className="flex flex-col gap-5 border-s-2 border-[var(--button-primary)] ps-6">
        <blockquote className="text-h3 leading-snug font-medium text-balance">{quote}</blockquote>
        {author && (
          <figcaption className="text-muted-foreground">
            <span className="font-medium text-foreground">{author}</span>
            {role && <span>, {role}</span>}
          </figcaption>
        )}
      </figure>
    </Section>
  );
}

/** Security, compliance or payment badges. Reassurance near a conversion point. */
export function TrustBadges({
  items,
  title,
  tone,
  className,
}: {
  items: { label: string; icon?: ReactNode }[];
  title?: ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <Section tone={tone} tight className={className}>
      {title && (
        <p className="mb-6 text-center text-caption font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
      )}
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {items.map((b, i) => (
          <li
            key={i}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
          >
            {b.icon}
            {b.label}
          </li>
        ))}
      </ul>
    </Section>
  );
}
