import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { handle } from "./mcp.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

const call = (name, args = {}) =>
  handle({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } });

const text = (res) => res.result.content[0].text;

describe("vui mcp server", () => {
  it("handshakes and lists its tools", () => {
    const init = handle({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } });
    expect(init.result.serverInfo.name).toBe("vui-ui");
    expect(init.result.capabilities.tools).toBeDefined();

    const tools = handle({ jsonrpc: "2.0", id: 2, method: "tools/list" }).result.tools;
    expect(tools.map((t) => t.name).sort()).toEqual([
      "compose_page",
      "get_block",
      "get_component",
      "get_guide",
      "get_page",
      "list_blocks",
      "list_components",
      "list_guides",
      "list_pages",
      "search_docs",
    ]);
  });

  it("lists components with their import specifiers", () => {
    const out = text(call("list_components"));
    expect(out).toContain("@viliha/vui-ui/record-view");
    expect(out).toContain("@viliha/vui-ui/utils — cn");
  });

  it("returns the public API of a big component, not 4k lines", () => {
    const out = text(call("get_component", { name: "record-view" }));
    expect(out).toContain("Public API only");
    expect(out).toContain("RecordField");
    expect(out.split("\n").length).toBeLessThan(1000);
  });

  it("returns whole source for a small component", () => {
    expect(text(call("get_component", { name: "page" }))).toContain("export function Page");
  });

  it("serves theme.css whole — tokens and the z-scale are not a React API", () => {
    const out = text(call("get_component", { name: "theme.css" }));
    expect(out).not.toContain("Public API only");
    expect(out).toContain("--background");
    expect(out).toContain("vui-scroll");
    expect(text(call("list_components"))).toContain("@viliha/vui-ui/theme.css");
  });

  it("ranks the section that answers the query, not the longest one", () => {
    const headings = (query) =>
      text(call("search_docs", { query, limit: 3 }))
        .split("\n")
        .filter((l) => l.startsWith("## "))
        .join(" ");
    if (text(call("list_guides")).startsWith("No guides bundled")) return;
    expect(headings("section card")).toMatch(/Sections|card/i);
    expect(headings("quick actions")).toMatch(/Quick actions/i);
  });

  it("searches the docs and falls back to the outline", () => {
    expect(text(call("search_docs", { query: "page types" }))).toMatch(/^## .+ > /m);
    expect(text(call("search_docs"))).toContain("AGENT.md > ");
  });

  it("serves the docs-site guides", () => {
    // Snapshot is git-ignored; skip when the docs site hasn't been built here.
    const list = text(call("list_guides"));
    if (list.startsWith("No guides bundled")) return;
    expect(list).toContain("installation\t");
    const guide = text(call("get_guide", { slug: "installation" }));
    expect(guide).toContain("Source: /docs/installation/");
    expect(guide).toContain("npm install @viliha/vui-ui");
    expect(text(call("search_docs", { query: "install the package" }))).toMatch(/install/i);
  });

  it("refuses to read outside the bundled app or guides", () => {
    expect(text(call("get_page", { path: "../package.json" }))).toContain("Unknown file");
    expect(text(call("get_guide", { slug: "../README" }))).toContain("Unknown guide");
  });

  // The rule: a feature isn't shipped until the MCP server serves it. These two
  // fail when something new is added to the package or the docs site and the
  // server can't answer for it.
  it("serves every component the package exports", () => {
    const served = text(call("list_components"));
    const files = readdirSync(join(ROOT, "src"))
      .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
      .map((f) => f.replace(/\.tsx$/, ""));
    for (const name of files) expect(served).toContain(`@viliha/vui-ui/${name}`);

    // Named export-map entries (./utils, ./theme.css, …) aren't covered by the
    // "./*" glob, so each one has to be listed explicitly.
    const { exports: map } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    for (const key of Object.keys(map).filter((k) => k !== "./*"))
      expect(served).toContain(`@viliha/vui-ui/${key.slice(2)}`);
  });

  it("serves every page of the docs site", () => {
    const docsApp = join(ROOT, "..", "..", "apps", "backoffice", "app", "docs");
    const list = text(call("list_guides"));
    // Both sides are generated: skip when either hasn't been built here.
    if (list.startsWith("No guides bundled") || !existsSync(docsApp)) return;
    const routes = readdirSync(docsApp, { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(docsApp, e.name, "page.tsx")))
      .map((e) => e.name);
    for (const route of routes) expect(list).toContain(`${route}\t`);
  });

  it("errors on an unknown tool and an unknown method", () => {
    expect(call("nope").error.code).toBe(-32602);
    expect(handle({ jsonrpc: "2.0", id: 3, method: "nope" }).error.code).toBe(-32601);
  });

  /* The block tools. Every one of these guards the same failure: the server
     describing a library that has moved on without it. */

  const WEB_SRC = join(ROOT, "../web/src");
  const hasWeb = existsSync(WEB_SRC);
  const web = hasWeb ? describe : describe.skip;

  web("website blocks", () => {
    it("lists every exported block, with a summary for each", () => {
      const lines = text(call("list_blocks")).split("\n");
      const exported = readdirSync(WEB_SRC)
        .filter((f) => /\.tsx$/.test(f) && !/\.test\./.test(f))
        .flatMap((f) =>
          [...readFileSync(join(WEB_SRC, f), "utf8").matchAll(/^export function ([A-Z][A-Za-z0-9]*)/gm)].map(
            (m) => m[1],
          ),
        );

      // Every block the package exports, not a hand-kept subset.
      const listed = lines.map((l) => l.split("\t")[0]);
      expect(listed.sort()).toEqual(exported.sort());

      // A block with no summary is a block an agent cannot choose between.
      const undocumented = lines.filter((l) => l.split("\t").length < 3).map((l) => l.split("\t")[0]);
      expect(undocumented).toEqual([]);
    });

    it("returns props and source for one block", () => {
      const out = text(call("get_block", { name: "Hero" }));
      expect(out).toContain('import { Hero } from "@viliha/vui-web"');
      expect(out).toContain("interface HeroProps");
      expect(out).toContain("variant?: HeroVariant");
    });

    it("finds a block whatever case it is asked for", () => {
      expect(text(call("get_block", { name: "hero" }))).toContain("interface HeroProps");
      expect(text(call("get_block", { name: "Nonexistent" }))).toContain("Unknown block");
    });

    it("composes a page for a description, in reading order", () => {
      const out = text(call("compose_page", { description: "SaaS landing page for a dev tool" }));
      expect(out).toContain("# landing page");
      expect(out).toContain("1. AnnouncementBar");
      expect(out.indexOf("Hero")).toBeLessThan(out.indexOf("Pricing"));
      expect(out.indexOf("Pricing")).toBeLessThan(out.indexOf("SiteFooter"));
    });

    it("picks the recipe the description asks for, not the first keyword in it", () => {
      // "pricing page for a blog platform" is a pricing page.
      expect(text(call("compose_page", { description: "pricing page for a blog platform" }))).toContain(
        "# pricing page",
      );
      expect(text(call("compose_page", { description: "our careers page" }))).toContain("# careers page");
      expect(text(call("compose_page", { description: "single blog post layout" }))).toContain(
        "# article page",
      );
      // Nothing recognisable still returns something usable.
      expect(text(call("compose_page", { description: "" }))).toContain("# landing page");
    });

    it("only recommends blocks that exist", () => {
      const listed = new Set(text(call("list_blocks")).split("\n").map((l) => l.split("\t")[0]));
      for (const kind of ["landing", "pricing", "about", "contact", "blog", "article", "feature", "careers", "docs"]) {
        const out = text(call("compose_page", { kind }));
        const named = [...out.matchAll(/^\d+\. ([A-Za-z]+) /gm)].map((m) => m[1]);
        expect(named.length).toBeGreaterThan(2);
        for (const block of named) expect(listed.has(block)).toBe(true);
      }
    });
  });
});
