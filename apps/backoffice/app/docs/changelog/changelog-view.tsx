"use client";

import * as React from "react";

import { cn } from "@viliha/vui-ui/utils";

export type Entry = { text: string; agent: boolean };
export type Section = { type: string; entries: Entry[] };
export type Release = {
  version: string;
  date: string;
  sections: Section[];
  notes: string[];
};

const CODE_CLS =
  "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground";

/** Minimal inline markdown → React: **bold**, `code`, [text](url). */
function inline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {m[2]}
        </strong>,
      );
    } else if (m[4] !== undefined) {
      nodes.push(
        <code key={key++} className={CODE_CLS}>
          {m[4]}
        </code>,
      );
    } else if (m[6] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={m[7]}
          className="font-medium text-foreground underline underline-offset-2"
        >
          {m[6]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const TYPE_STYLE: Record<string, { pill: string; dot: string }> = {
  Added: {
    pill: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  Changed: {
    pill: "bg-blue-500/10 text-blue-700 ring-blue-500/25 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  Fixed: {
    pill: "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  Removed: {
    pill: "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};
const DEFAULT_STYLE = {
  pill: "bg-muted text-muted-foreground ring-border",
  dot: "bg-muted-foreground",
};
const TYPE_ORDER = ["Added", "Changed", "Fixed", "Removed"];

function TypePill({ type }: { type: string }) {
  const s = TYPE_STYLE[type] ?? DEFAULT_STYLE;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        s.pill,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {type}
    </span>
  );
}

const stripAgent = (text: string) => text.replace(/^\*\*For agents:\*\*\s*/, "");
const minorOf = (v: string) => {
  const p = v.split(".");
  return p.length >= 2 ? `${p[0]}.${p[1]}` : v;
};

export function ChangelogView({ releases }: { releases: Release[] }) {
  const [filter, setFilter] = React.useState("All");

  const latest = releases[0]?.version;
  const present = TYPE_ORDER.filter((t) =>
    releases.some((r) => r.sections.some((s) => s.type === t)),
  );
  const tabs = ["All", ...present];

  // Group by minor (releases are newest-first, so groups form in order).
  const groups: { minor: string; releases: Release[] }[] = [];
  for (const r of releases) {
    const minor = minorOf(r.version);
    const last = groups[groups.length - 1];
    if (last && last.minor === minor) last.releases.push(r);
    else groups.push({ minor, releases: [r] });
  }

  const shown = (r: Release) =>
    filter === "All" ? r.sections : r.sections.filter((s) => s.type === filter);

  return (
    <>
      {/* Filter by change type. */}
      <div className="not-prose mb-6 flex flex-wrap items-center gap-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors",
              filter === t
                ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)]"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="not-prose space-y-8">
        {groups.map((g) => {
          const rels = g.releases.filter(
            (r) => filter === "All" || shown(r).length > 0,
          );
          if (rels.length === 0) return null;
          return (
            <div key={g.minor}>
              {/* Minor-version divider so patches read as one release train. */}
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  v{g.minor}
                </h2>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-4">
                {rels.map((rel) => {
                  const secs = shown(rel);
                  return (
                    <section
                      key={rel.version}
                      className="overflow-hidden rounded-xl border border-border bg-card"
                    >
                      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-muted/30 px-5 py-3.5">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {rel.version}
                        </h3>
                        {rel.version === latest && (
                          <span className="rounded-full bg-[var(--button-primary)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--button-primary-foreground)]">
                            Latest
                          </span>
                        )}
                        {rel.date && (
                          <time className="ml-auto text-sm text-muted-foreground">
                            {rel.date}
                          </time>
                        )}
                      </header>

                      <div className="space-y-5 px-5 py-4">
                        {secs.map((sec) => (
                          <div key={sec.type}>
                            <TypePill type={sec.type} />
                            <ul className="mt-2.5 space-y-2">
                              {sec.entries.map((e, j) =>
                                e.agent ? (
                                  <li
                                    key={j}
                                    className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-[13px] leading-relaxed text-muted-foreground"
                                  >
                                    <span className="mb-0.5 mr-2 inline-block rounded bg-background px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ring-1 ring-inset ring-border">
                                      For agents
                                    </span>
                                    {inline(stripAgent(e.text))}
                                  </li>
                                ) : (
                                  <li
                                    key={j}
                                    className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/90"
                                  >
                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-border" />
                                    <span>{inline(e.text)}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        ))}

                        {filter === "All" &&
                          rel.notes.map((n, j) => (
                            <p key={j} className="text-sm text-muted-foreground">
                              {inline(n)}
                            </p>
                          ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
