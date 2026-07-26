import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import { DocPager, H2, H3, P, PageTitle, Ul } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/changelog/" },
  title: "Change Log",
  description:
    "Release history for @viliha/vui-ui — every version's Added / Changed / Fixed, pulled straight from the package CHANGELOG so it never drifts.",
};

// Single source of truth: read the package CHANGELOG at build time. The docs
// pages are excluded from the scaffold, so this monorepo path is docs-site-only.
const CHANGELOG = fs.readFileSync(
  path.join(process.cwd(), "..", "..", "packages", "ui", "CHANGELOG.md"),
  "utf8",
);

const CODE_CLS = "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]";

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
      nodes.push(<strong key={key++}>{m[2]}</strong>);
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
          className="font-medium text-foreground underline"
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

/** Render the Keep-a-Changelog markdown with the doc components. */
function renderChangelog(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let items: string[] = [];
  let key = 0;
  const flush = () => {
    if (items.length) {
      const li = items;
      out.push(
        <Ul key={key++}>
          {li.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </Ul>,
      );
      items = [];
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("# ")) continue; // page has its own title
    if (line.startsWith("## ")) {
      flush();
      out.push(<H2 key={key++}>{inline(line.slice(3))}</H2>);
    } else if (line.startsWith("### ")) {
      flush();
      out.push(<H3 key={key++}>{inline(line.slice(4))}</H3>);
    } else if (/^\s*- /.test(line)) {
      let item = line.replace(/^\s*- /, "");
      // Fold wrapped continuation lines into this bullet.
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
      items.push(item);
    } else if (line.startsWith("> ")) {
      flush();
      out.push(
        <p key={key++} className="my-3 text-sm text-muted-foreground">
          {inline(line.slice(2))}
        </p>,
      );
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      out.push(<P key={key++}>{inline(line)}</P>);
    }
  }
  flush();
  return out;
}

export default function ChangelogPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Community"
        title="Change Log"
        lead="Every release of @viliha/vui-ui, newest first — rendered straight from the package CHANGELOG.md, so it never drifts from what shipped."
      />
      {renderChangelog(CHANGELOG)}
      <DocPager
        prev={{ label: "Calendar", href: "/docs/calendar" }}
        next={{ label: "Contributing", href: "/docs/contributing" }}
      />
    </article>
  );
}
