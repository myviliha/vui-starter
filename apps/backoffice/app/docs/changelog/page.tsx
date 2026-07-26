import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import { DocPager, PageTitle } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/changelog/" },
  title: "Change Log",
  description:
    "Release history for @viliha/vui-ui — every version's new features, changes, and fixes, pulled straight from the package CHANGELOG so it never drifts from what shipped.",
};

// Single source of truth: read the package CHANGELOG at build time. Docs pages
// are excluded from the scaffold, so this monorepo path is docs-site-only.
const CHANGELOG = fs.readFileSync(
  path.join(process.cwd(), "..", "..", "packages", "ui", "CHANGELOG.md"),
  "utf8",
);

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

type Entry = { text: string; agent: boolean };
type Section = { type: string; entries: Entry[] };
type Release = {
  version: string;
  date: string;
  sections: Section[];
  notes: string[];
};

/** Parse the Keep-a-Changelog markdown into typed releases (ignores the intro
 *  boilerplate — the page provides its own). */
function parseReleases(md: string): Release[] {
  const lines = md.split("\n");
  const releases: Release[] = [];
  let rel: Release | null = null;
  let sec: Section | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("## ")) {
      const [version = "", date = ""] = line.slice(3).split(" — ");
      rel = { version: version.trim(), date: date.trim(), sections: [], notes: [] };
      releases.push(rel);
      sec = null;
    } else if (line.startsWith("### ")) {
      sec = { type: line.slice(4).trim(), entries: [] };
      rel?.sections.push(sec);
    } else if (/^\s*- /.test(line)) {
      let item = line.replace(/^\s*- /, "");
      while (i + 1 < lines.length) {
        const nxt = lines[i + 1] ?? "";
        if (
          nxt.trim() === "" ||
          nxt.startsWith("#") ||
          /^\s*- /.test(nxt) ||
          nxt.startsWith("> ")
        )
          break;
        item += " " + nxt.trim();
        i++;
      }
      const agent = /^\*\*For agents:\*\*/.test(item);
      if (sec) sec.entries.push({ text: item, agent });
      else if (rel) rel.notes.push(item);
    } else if (line.startsWith("> ")) {
      rel?.notes.push(line.slice(2));
    } else if (line.trim() !== "" && !line.startsWith("# ") && rel && !sec) {
      // A plain line under a version with no section (e.g. "Baseline release.").
      rel.notes.push(line.trim());
    }
  }
  return releases;
}

// Section-type accent (works in light + dark).
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

function TypePill({ type }: { type: string }) {
  const s = TYPE_STYLE[type] ?? DEFAULT_STYLE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${s.pill}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {type}
    </span>
  );
}

/** Strip the leading "**For agents:**" marker for cleaner rendering. */
function stripAgent(text: string): string {
  return text.replace(/^\*\*For agents:\*\*\s*/, "");
}

export default function ChangelogPage() {
  const releases = parseReleases(CHANGELOG);

  return (
    <article>
      <PageTitle
        eyebrow="Community"
        title="Change Log"
        lead="What's new in @viliha/vui-ui — features, changes, and fixes, newest first. Rendered straight from the package changelog, so it always matches what actually shipped."
      />

      <div className="not-prose space-y-5">
        {releases.map((rel, i) => (
          <section
            key={rel.version}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Header: version + Latest badge + date. */}
            <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-muted/30 px-5 py-3.5">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {rel.version}
              </h2>
              {i === 0 && (
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

            {/* Body: one block per section type. */}
            <div className="space-y-5 px-5 py-4">
              {rel.sections.map((sec) => (
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

              {rel.notes.map((n, j) => (
                <p key={j} className="text-sm text-muted-foreground">
                  {inline(n)}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <DocPager
        prev={{ label: "Calendar", href: "/docs/calendar" }}
        next={{ label: "Contributing", href: "/docs/contributing" }}
      />
    </article>
  );
}
