import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import { DocPager, Note, PageTitle } from "@/components/doc";
import { ChangelogView, type Release, type Section } from "./changelog-view";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/changelog/" },
  title: "Change Log",
  description:
    "Release history for @viliha/vui-ui: every version's new features, changes, and fixes, pulled straight from the package CHANGELOG so it never drifts from what shipped.",
};

// Single source of truth: read the package CHANGELOG at build time. Docs pages
// are excluded from the scaffold, so this monorepo path is docs-site-only.
const CHANGELOG = fs.readFileSync(
  path.join(process.cwd(), "..", "..", "packages", "ui", "CHANGELOG.md"),
  "utf8",
);

/** Parse the Keep-a-Changelog markdown into typed releases (the intro boilerplate
 *  is ignored; the page provides its own). Rendering happens in the client view. */
function parseReleases(md: string): Release[] {
  const lines = md.split("\n");
  const releases: Release[] = [];
  let rel: Release | null = null;
  let sec: Section | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();
      // Only a version heading starts a release. Prose sections (the upgrade
      // guide) live in the same file and are rendered by the page, not here.
      if (!/^\d/.test(heading)) {
        rel = null;
        sec = null;
        continue;
      }
      const [version = "", date = ""] = heading.split(" — ");
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
      rel.notes.push(line.trim());
    }
  }
  return releases;
}

export default function ChangelogPage() {
  const releases = parseReleases(CHANGELOG);

  return (
    <article>
      <PageTitle
        eyebrow="Community"
        title="Change Log"
        lead="What's new in @viliha/vui-ui: features, changes, and fixes, newest first. Rendered straight from the package changelog, so it always matches what actually shipped. Filter by change type, or browse by release."
      />
      <Note title="Upgrading from 1.44 to 1.52">
        Upgrade, restart, change nothing: everything from 1.50 on is additive,
        and the behaviour changes before it all point the same way, which is to
        stop showing people something meaningless. One case needs code, and only
        if you render <code>BrandAsset</code> yourself: add <code>inline</code>{" "}
        (demo) or <code>onPick</code> (a real upload). The step-by-step guide,
        including what changed on its own and what you can opt into, is at the
        top of{" "}
        <a href="https://github.com/myviliha/vui-starter/blob/main/packages/ui/CHANGELOG.md">
          the package changelog
        </a>
        . For how to configure any of it, see{" "}
        <a href="/docs/configuration/">Configuration</a>.
      </Note>
      <ChangelogView releases={releases} />
      <DocPager
        prev={{ label: "Calendar", href: "/docs/calendar" }}
        next={{ label: "Contributing", href: "/docs/contributing" }}
      />
    </article>
  );
}
