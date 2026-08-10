#!/usr/bin/env node
// @viliha/vui-ui MCP server — lets an AI agent query the library instead of
// reading node_modules.
//
//   npx @viliha/vui-ui mcp          (stdio transport)
//   claude mcp add vui -- npx -y @viliha/vui-ui mcp
//
// Everything it serves is read from the installed package: components from
// src/, the reference app's pages and layouts from template/, and the rules
// from AGENT.md + README.md. No index to keep in sync.
//
// ponytail: hand-rolled JSON-RPC over stdio (~60 lines) instead of the MCP SDK.
// Add the SDK if this ever needs resources, prompts, or the HTTP transport.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SRC = join(ROOT, "src");
const TEMPLATE = join(ROOT, "template");
const VERSION = JSON.parse(
  readFileSync(join(ROOT, "package.json"), "utf8"),
).version;

const read = (p) => readFileSync(p, "utf8");
const exists = (p) => existsSync(p);
const posix = (p) => p.split(sep).join("/");

// ── components ────────────────────────────────────────────────────────────

// The export map is "./*": "./src/*.tsx" plus two named .ts entries, so the
// file list IS the component list.
function componentFiles() {
  return readdirSync(SRC)
    .filter((f) => /\.tsx$/.test(f) && !/\.test\./.test(f))
    .map((f) => f.replace(/\.tsx$/, ""))
    .concat(["utils", "theme-config", "theme.css"])
    .sort();
}

function sourceOf(name) {
  // theme.css is an export too, and the single source for tokens, the z-scale
  // and vui-scroll — an agent asks for it by name.
  if (name === "theme.css" || name === "theme")
    return { path: join(SRC, "theme.css"), code: read(join(SRC, "theme.css")), css: true };
  for (const p of [join(SRC, `${name}.tsx`), join(SRC, `${name}.ts`)]) {
    if (exists(p)) return { path: p, code: read(p) };
  }
  return null;
}

const EXPORTED = /^export\s+(?:default\s+)?(?:async\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_$]+)/gm;

function exportedNames(code) {
  const names = [...code.matchAll(EXPORTED)].map((m) => m[1]);
  // `export { A, B }` re-export lists.
  for (const m of code.matchAll(/^export\s*\{([^}]*)\}/gm)) {
    for (const part of m[1].split(",")) {
      const id = part.trim().split(/\s+as\s+/).pop();
      if (id) names.push(id);
    }
  }
  return [...new Set(names)];
}

// Big components (record-view.tsx is 4k lines) are served as their public API:
// every exported type/interface in full, plus one-line signatures for the rest.
const API_LINE_LIMIT = 400;

function publicApi(code) {
  const lines = code.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^export\s/.test(lines[i])) continue;
    if (/^export\s+(type|interface)\s/.test(lines[i])) {
      let depth = 0;
      do {
        depth += (lines[i].match(/\{/g) || []).length;
        depth -= (lines[i].match(/\}/g) || []).length;
        out.push(lines[i]);
        i++;
      } while (i < lines.length && depth > 0);
      i--;
    } else {
      out.push(lines[i].replace(/\s*\{\s*$/, " { … }"));
    }
    out.push("");
  }
  return out.join("\n").trim();
}

// ── reference app (pages, layouts, shell) ─────────────────────────────────

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const KIND = {
  "page.tsx": "page",
  "layout.tsx": "layout",
  "loading.tsx": "loading",
  "error.tsx": "error",
  "not-found.tsx": "not-found",
};

// app/(app)/organizations/page.tsx -> /organizations   (route groups drop out)
function routeOf(rel) {
  if (!rel.startsWith("app/")) return null;
  const segs = rel.slice(4).split("/").slice(0, -1).filter((s) => !/^\(.*\)$/.test(s));
  return "/" + segs.join("/");
}

function appFiles() {
  return walk(TEMPLATE)
    .map((p) => posix(relative(TEMPLATE, p)))
    // Config counts: .env.example is where the feature flags are declared.
    .filter((rel) => /\.(tsx|ts|css|mjs|json)$|(^|\/)\.env/.test(rel))
    .sort()
    .map((rel) => {
      const file = rel.split("/").pop();
      const kind = KIND[file] ?? (rel.includes("/_components/") ? "component" : "module");
      const route = kind === "page" || kind === "layout" ? routeOf(rel) : null;
      return route ? { path: rel, kind, route } : { path: rel, kind };
    });
}

// ── docs ──────────────────────────────────────────────────────────────────

// docs/ is a snapshot of the docs site (vui.viliha.com/docs), written by
// scripts/snapshot-docs.mjs and shipped with the package.
const GUIDES = join(ROOT, "docs");

function guideFiles() {
  return walk(GUIDES)
    .filter((p) => p.endsWith(".md"))
    .map((p) => posix(relative(GUIDES, p)).replace(/\.md$/, ""))
    .sort();
}

function docFiles() {
  return [
    ["AGENT.md", join(ROOT, "AGENT.md")],
    ["README.md", join(ROOT, "README.md")],
    ...guideFiles().map((slug) => [`/docs/${slug === "index" ? "" : slug + "/"}`, join(GUIDES, `${slug}.md`)]),
  ];
}

function sections() {
  const out = [];
  for (const [doc, path] of docFiles()) {
    if (!exists(path)) continue;
    let current = { doc, heading: doc, body: "" };
    let parent = doc;
    for (const line of read(path).split("\n")) {
      // A bold lead-in ("**Multi-tenant apps: the organization switcher.**")
      // starts a topic as surely as a heading does, and this repo writes a lot
      // of them. Without the split, one heading owns a page of unrelated rules.
      const lead = line.match(/^\*\*([^*]{4,90}?)\.?\*\*/)?.[1];
      if (/^#{1,3} /.test(line)) {
        if (current.body.trim()) out.push(current);
        parent = line.replace(/^#+ /, "");
        current = { doc, heading: parent, body: "" };
      } else if (lead && current.body.trim()) {
        out.push(current);
        current = { doc, heading: `${parent} > ${lead}`, body: line + "\n" };
      } else current.body += line + "\n";
    }
    if (current.body.trim()) out.push(current);
  }
  return out;
}

function searchDocs(query, limit) {
  const all = sections();
  if (!query) return all.map((s) => `${s.doc} > ${s.heading}`).join("\n");
  // Stopwords, or "how do I install the package" scores every section that
  // says "the" above the one that answers it.
  const STOP = new Set("a an and are as at be by do does for from how i in is it my of on or the to use using what when where with your".split(" "));
  const terms = query.toLowerCase().split(/\W+/).filter((t) => t && !STOP.has(t));
  if (!terms.length) return all.map((s) => `${s.doc} > ${s.heading}`).join("\n");
  const hay = all.map((s) => (s.heading + "\n" + s.body).toLowerCase());
  // tf-idf: "switcher" identifies the section you want, "form" appears in half
  // the docs. Without idf, common words in the query drown out the rare one.
  const idf = Object.fromEntries(
    terms.map((t) => [
      t,
      Math.log((all.length + 1) / (hay.filter((h) => h.includes(t)).length + 1)) + 1,
    ]),
  );
  // The changelog names every feature once, in a short section per release, so
  // it outranks the guide that explains it. Down-weight unless the question is
  // about a release.
  const releaseQuery = /changelog|release|version|upgrad/.test(query.toLowerCase());
  const hits = all.map((s, i) => {
    const head = s.heading.toLowerCase();
    const matched = terms.filter((t) => hay[i].includes(t));
    const tf = matched.reduce((n, t) => n + (hay[i].split(t).length - 1) * idf[t], 0);
    const heading = matched.reduce((n, t) => n + (head.includes(t) ? 15 * idf[t] : 0), 0);
    // Normalize by length, or the longest section wins every query by being long.
    const score = tf / Math.sqrt(Math.max(500, hay[i].length) / 500) + heading;
    const stale = /changelog/.test(s.doc) && !releaseQuery;
    return { s, score: stale ? score * 0.25 : score, all: matched.length === terms.length };
  });
  // Sections matching every term win outright; fall back to any-term matches.
  const pool = hits.filter((x) => x.all).length ? hits.filter((x) => x.all) : hits;
  const scored = pool
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  if (!scored.length) return `No section matches "${query}". Call search_docs with no query for the full outline.`;
  return scored
    .map(({ s }) => `## ${s.doc} > ${s.heading}\n\n${s.body.trim()}`)
    .join("\n\n---\n\n");
}


// ── website blocks (@viliha/vui-web) ──────────────────────────────────────

// The block library is a separate package, so it may sit beside this one in a
// monorepo or under node_modules in a consumer's project. Both are checked, and
// if neither is there the tools say so rather than returning an empty list that
// reads like "there are no blocks".
const WEB_CANDIDATES = [
  join(ROOT, "../web/src"),
  join(ROOT, "node_modules/@viliha/vui-web/src"),
  join(ROOT, "../../node_modules/@viliha/vui-web/src"),
  join(process.cwd(), "node_modules/@viliha/vui-web/src"),
];

function webSrc() {
  return WEB_CANDIDATES.find((p) => exists(p)) ?? null;
}

const NOT_INSTALLED =
  "@viliha/vui-web is not installed. Add it with `pnpm add @viliha/vui-web` for the " +
  "marketing blocks (hero, pricing, testimonials, FAQ, site header and footer).";

/** Every exported block, grouped by the file it lives in. No manifest: the file
 *  list is the index, so a new block appears here because it exists. */
function blockFiles() {
  const src = webSrc();
  if (!src) return null;
  return readdirSync(src)
    .filter((f) => /\.tsx$/.test(f) && !/\.test\./.test(f))
    .sort()
    .map((f) => {
      const code = read(join(src, f));
      // Components only: a block is a capitalised export, not a type or a const.
      const names = [...code.matchAll(/^export function ([A-Z][A-Za-z0-9]*)/gm)].map((m) => m[1]);
      return { file: f.replace(/\.tsx$/, ""), path: join(src, f), code, names };
    })
    .filter((f) => f.names.length);
}

/** The sentence above a block's export, which is where its purpose is written. */
function blockSummary(code, name) {
  const at = code.indexOf(`export function ${name}`);
  if (at < 0) return "";
  // The nearest comment above the export, allowing the props type to sit in
  // between: this codebase writes the doc comment, then `export interface
  // HeroProps`, then `export function Hero`. What is not allowed is another
  // component in the gap. Without that check a block with no comment of its own
  // inherits its neighbour's, and the list describes three blocks the same way.
  //
  // Only unindented comments count, or the last comment found is whichever prop
  // inside the props interface happens to be documented last.
  const before = code.slice(0, at);
  const docs = [...before.matchAll(/^\/\*\*([\s\S]*?)\*\//gm)];
  const doc = docs[docs.length - 1];
  if (!doc) return "";
  const between = before.slice(doc.index + doc[0].length);
  if (/\bexport function [A-Z]/.test(between)) return "";
  const text = doc[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  // The first sentence is the summary; the rest is the reasoning.
  return text.split(/(?<=\.)\s/)[0] ?? text;
}

/** Prop names and their types, read from the component's own signature. */
function blockProps(code, name) {
  const at = code.indexOf(`export function ${name}`);
  if (at < 0) return "";
  const tail = code.slice(at);
  // Either `}: { … }) {` for an inline type, or `}: SomeProps) {` for a named one.
  const named = tail.match(/^export function [A-Za-z0-9]+\([\s\S]*?\}:\s*([A-Za-z0-9]+)\)/);
  if (named) {
    const iface = code.match(new RegExp(`export interface ${named[1]} \\{([\\s\\S]*?)\\n\\}`));
    return iface ? `interface ${named[1]} {${iface[1]}\n}` : named[1];
  }
  const inline = tail.match(/\}:\s*(\{[\s\S]*?\n\}\))/);
  return inline ? inline[1].replace(/\)$/, "") : "";
}

/**
 * Page recipes, in the order section 26 of the requirements recommends.
 *
 * This is a hand-written list, unlike everything else the server returns, and
 * it should stay short for that reason: it encodes taste about ordering, which
 * no file can be read to discover. Every entry is filtered against the blocks
 * that actually exist before it is served, so a recipe can never name a block
 * that was renamed or removed.
 */
const RECIPES = {
  landing: {
    what: "A SaaS or product landing page. The default when someone says home page.",
    blocks: [
      ["AnnouncementBar", "Optional. A launch, a release, or a deadline."],
      ["SiteHeader", "Navigation and the primary call to action."],
      ["Hero", 'variant="product" with a screenshot, or "gradient" when there is nothing to show yet.'],
      ["LogoCloud", "Proof, immediately under the fold."],
      ["FeatureGrid", "Three to six things it does."],
      ["Stats", "Numbers, if you have real ones."],
      ["ProcessSteps", "How it works, in three or four steps."],
      ["FeatureSplit", "The one feature worth a section of its own."],
      ["Testimonials", "Quotes from people who shipped with it."],
      ["CaseStudyGrid", "Longer proof, linking to the detail pages."],
      ["Pricing", "Plans, with the toggle if billing is annual."],
      ["Faq", "The objections that come up on sales calls."],
      ["Cta", "One clear action."],
      ["SiteFooter", "Navigation, legal, newsletter."],
    ],
  },
  pricing: {
    what: "A pricing page that has to survive being read sceptically.",
    blocks: [
      ["Hero", 'variant="minimal". State the pricing model in the lead.'],
      ["Pricing", "Cards, with the popular plan marked."],
      ["ComparisonTable", "Row by row, because the cards cannot hold it all."],
      ["PricingCalculator", "Only for usage-based pricing."],
      ["TrustBadges", "Licence, security, no-lock-in claims."],
      ["Testimonials", "Ideally quotes about value, not features."],
      ["Faq", "Billing, refunds, seat counting, what happens on cancellation."],
      ["Cta", "The action, repeated at the bottom."],
    ],
  },
  about: {
    what: "A company or about page.",
    blocks: [
      ["Hero", 'variant="minimal", with the story in one sentence.'],
      ["QuoteBlock", "The founding line, if there is a real one."],
      ["Benefits", "What the company stands for."],
      ["Stats", "Size, age, reach."],
      ["Timeline", "How it got here."],
      ["TeamGrid", "Who builds it."],
      ["Cta", "Careers or contact."],
    ],
  },
  contact: {
    what: "A contact page.",
    blocks: [
      ["Hero", 'variant="minimal".'],
      ["ContactForm", "Name, email, message. Wire `action` to your endpoint."],
      ["CardGrid", "The other ways to reach you: sales, support, press."],
      ["MapBlock", "Only if there is an office worth visiting."],
      ["Faq", "The questions the form would otherwise receive."],
    ],
  },
  blog: {
    what: "A blog or news listing.",
    blocks: [
      ["Hero", 'variant="minimal".'],
      ["SearchBlock", "Only once there are more than about twenty posts."],
      ["FilterBar", "Categories."],
      ["CardGrid", "The posts."],
      ["Pagination", "Or LoadMore."],
      ["Newsletter", "The point of the listing page."],
    ],
  },
  article: {
    what: "A blog post or article.",
    blocks: [
      ["ReadingProgress", "Fixed to the top of the viewport."],
      ["ArticleHeader", "Title, category, author, date, cover."],
      ["TableOfContents", "Sticky beside the body on wide screens."],
      ["Prose", "The body. Rendered MDX or HTML goes straight in."],
      ["ArticleTags", "Categorisation."],
      ["ShareBlock", "Sharing, with copy-link."],
      ["AuthorCard", "Who wrote it."],
      ["ArticlePager", "Previous and next."],
      ["CardGrid", "Related posts."],
    ],
  },
  feature: {
    what: "A single feature, solution or service detail page.",
    blocks: [
      ["Hero", 'variant="minimal" with breadcrumbs.'],
      ["FeatureSplit", "What it does, beside a visual."],
      ["FeatureList", "The details, as rows."],
      ["CodeBlock", "For a developer product."],
      ["Testimonials", 'variant="single".'],
      ["Faq", "Scoped to this feature."],
      ["Cta", "Back to the demo or to contact."],
    ],
  },
  careers: {
    what: "A careers page with open roles.",
    blocks: [
      ["Hero", 'variant="minimal".'],
      ["Benefits", "What you get beyond the salary."],
      ["TeamGrid", "Who they would work with."],
      ["ProcessSteps", "The hiring process, honestly."],
      ["CardGrid", "Open roles, linking to detail pages."],
      ["EmptyState", "When there are none. Say so rather than hiding the page."],
      ["Cta", "Speculative applications."],
    ],
  },
  docs: {
    what: "A documentation landing page.",
    blocks: [
      ["Hero", 'variant="minimal" with a `search` slot.'],
      ["CardGrid", "The sections."],
      ["CodeBlock", "The shortest path to a running install."],
      ["Faq", "The first questions after installing."],
    ],
  },
};

// ── tools ─────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "list_components",
    description:
      "List every component @viliha/vui-ui exports, with its import specifier and exported symbols.",
    inputSchema: { type: "object", properties: {} },
    run: () =>
      componentFiles()
        .map((name) => {
          if (name === "theme.css")
            return "@viliha/vui-ui/theme.css — design tokens, the z-scale, vui-scroll (import once in globals.css)";
          const src = sourceOf(name);
          const symbols = src ? exportedNames(src.code).join(", ") : "";
          return `@viliha/vui-ui/${name}${symbols ? ` — ${symbols}` : ""}`;
        })
        .join("\n"),
  },
  {
    name: "get_component",
    description:
      "Source and props for one component (e.g. record-view, page, breadcrumbs), plus the doc sections that describe it. Large files are returned as their public API.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Component file name, e.g. \"record-view\"" } },
      required: ["name"],
    },
    run: ({ name }) => {
      const src = sourceOf(String(name).replace(/^.*\//, "").replace(/\.tsx?$/, ""));
      if (!src) return `Unknown component "${name}". Call list_components for the list.`;
      const lines = src.code.split("\n").length;
      const body =
        lines > API_LINE_LIMIT && !src.css
          ? `// Public API only (${lines} lines of source).\n\n${publicApi(src.code)}`
          : src.code;
      const how = src.css
        ? 'import "@viliha/vui-ui/theme.css"'
        : `import … from "@viliha/vui-ui/${name}"`;
      return `${how}\n\n${body}\n\n---\n\n${searchDocs(name.replace(/[-.]/g, " "), 2)}`;
    },
  },
  {
    name: "list_pages",
    description:
      "List the reference app's pages, layouts and shell components (the same files `vui init` scaffolds), with their routes.",
    inputSchema: { type: "object", properties: {} },
    run: () => {
      const files = appFiles();
      if (!files.length)
        return "No reference app bundled. It ships with the published package; in this repo run `pnpm --filter @viliha/vui-ui sync-template`.";
      return files
        .map((f) => `${f.path}\t${f.kind}${f.route ? `\t${f.route}` : ""}`)
        .join("\n");
    },
  },
  {
    name: "get_page",
    description:
      "Full source of one reference-app file — a page, layout, nav config, or shell component. Copy these patterns instead of inventing new ones.",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string", description: "Path from list_pages, e.g. \"app/(app)/organizations/page.tsx\"" } },
      required: ["path"],
    },
    run: ({ path }) => {
      const rel = posix(String(path)).replace(/^\/+/, "");
      const full = join(TEMPLATE, rel);
      // Keep reads inside the bundled app.
      if (!posix(full).startsWith(posix(TEMPLATE)) || !exists(full) || statSync(full).isDirectory())
        return `Unknown file "${path}". Call list_pages for the list.`;
      return `// ${rel}\n${read(full)}`;
    },
  },
  {
    name: "list_guides",
    description:
      "List the end-to-end guides from the VUI docs site (installation, configuration, theming, layouts, forms, data table, navigation, per-component reference, …). Start here to learn how to use the package.",
    inputSchema: { type: "object", properties: {} },
    run: () => {
      const slugs = guideFiles();
      if (!slugs.length)
        return "No guides bundled. They ship with the published package; in this repo run `pnpm --filter backoffice build && pnpm --filter @viliha/vui-ui snapshot-docs`.";
      return slugs
        .map((slug) => {
          const title = read(join(GUIDES, `${slug}.md`)).split("\n")[0].replace(/^#\s*/, "");
          return `${slug}\t${title}`;
        })
        .join("\n");
    },
  },
  {
    name: "get_guide",
    description:
      "Read one guide from the docs site in full, as markdown with its code samples. Slugs come from list_guides, e.g. \"installation\", \"data-table\", \"components/button\".",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Guide slug, e.g. \"installation\"" } },
      required: ["slug"],
    },
    run: ({ slug }) => {
      const rel = posix(String(slug)).replace(/^\/+|\/+$/g, "").replace(/^docs\//, "").replace(/\.md$/, "") || "index";
      const full = join(GUIDES, `${rel}.md`);
      // Keep reads inside the bundled guides.
      if (!posix(full).startsWith(posix(GUIDES)) || !exists(full))
        return `Unknown guide "${slug}". Call list_guides for the list.`;
      return read(full);
    },
  },
  {
    name: "list_blocks",
    description:
      "List every marketing block @viliha/vui-web exports — heroes, features, pricing, testimonials, FAQ, site header and footer, article pieces — with its import specifier and what it is for. Use these to build a website; use list_components for the admin app.",
    inputSchema: { type: "object", properties: {} },
    run: () => {
      const files = blockFiles();
      if (!files) return NOT_INSTALLED;
      return files
        .map((f) =>
          f.names
            .map((n) => {
              const summary = blockSummary(f.code, n);
              return `${n}\t@viliha/vui-web${summary ? `\t${summary}` : ""}`;
            })
            .join("\n"),
        )
        .join("\n");
    },
  },
  {
    name: "get_block",
    description:
      "Props, source and a worked example for one marketing block (e.g. Hero, Pricing, SiteHeader). Copy the example rather than inventing markup.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: 'Block name from list_blocks, e.g. "Hero"' } },
      required: ["name"],
    },
    run: ({ name }) => {
      const files = blockFiles();
      if (!files) return NOT_INSTALLED;
      const wanted = String(name).replace(/^.*\//, "");
      const file = files.find((f) => f.names.some((n) => n.toLowerCase() === wanted.toLowerCase()));
      if (!file) return `Unknown block "${name}". Call list_blocks for the list.`;
      const exact = file.names.find((n) => n.toLowerCase() === wanted.toLowerCase());
      const lines = file.code.split("\n").length;
      const body =
        lines > API_LINE_LIMIT
          ? `// Public API only (${lines} lines in ${file.file}.tsx).\n\n${publicApi(file.code)}`
          : file.code;
      const props = blockProps(file.code, exact);
      return [
        `import { ${exact} } from "@viliha/vui-web";`,
        "",
        blockSummary(file.code, exact),
        "",
        props ? `// Props\n${props}` : "",
        "",
        `// Source: ${file.file}.tsx`,
        body,
      ]
        .filter(Boolean)
        .join("\n");
    },
  },
  {
    name: "compose_page",
    description:
      "Turn a page description into an ordered list of blocks with notes on what each one is for. Kinds: landing, pricing, about, contact, blog, article, feature, careers, docs. Call this before writing a marketing page.",
    inputSchema: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: 'What the page is, e.g. "SaaS landing page for a developer tool"',
        },
        kind: {
          type: "string",
          description: "Force a recipe instead of inferring one from the description.",
        },
      },
    },
    run: ({ description, kind }) => {
      const files = blockFiles();
      const available = files ? new Set(files.flatMap((f) => f.names)) : null;
      const text = String(kind ?? description ?? "").toLowerCase();

      // Order matters: "pricing page for a blog platform" is a pricing page.
      const MATCH = [
        ["pricing", /pric|plan|tier|billing|cost/],
        ["article", /article|post detail|blog post|single post/],
        ["blog", /blog|news|articles|listing|magazine/],
        ["careers", /career|job|hiring|recruit|role/],
        ["contact", /contact|support|get in touch|enquir/],
        ["about", /about|company|team|story|mission/],
        ["docs", /doc|guide|reference|api reference|help cent/],
        ["feature", /feature|solution|service|product page|use case|integration/],
        ["landing", /.*/],
      ];
      const picked = RECIPES[text] ? text : MATCH.find(([, re]) => re.test(text))[0];
      const recipe = RECIPES[picked];

      const rows = recipe.blocks
        // A recipe can never name a block that no longer exists.
        .filter(([block]) => !available || available.has(block))
        .map(([block, note], i) => `${i + 1}. ${block} — ${note}`);
      const missing = available
        ? recipe.blocks.filter(([b]) => !available.has(b)).map(([b]) => b)
        : [];

      return [
        `# ${picked} page`,
        "",
        recipe.what,
        "",
        ...rows,
        "",
        'Every block takes its content as props and its colours from tokens. Do not pass a className that sets a colour, a font size or a margin: use `tone`, `width` and the block\'s own props instead.',
        missing.length ? `\nNot available in the installed version: ${missing.join(", ")}.` : "",
        files ? "" : `\n${NOT_INSTALLED}`,
        "",
        "Then: get_block for each one, and search_docs for anything the props do not explain.",
      ]
        .filter((l) => l !== "")
        .join("\n");
    },
  },
  {
    name: "search_docs",
    description:
      "Search everything written about VUI — the agent rules (AGENT.md), the README, and every docs-site guide — and get back the matching sections. Call with no query for the full outline.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What you need, e.g. \"page types\" or \"filterable fields\"" },
        limit: { type: "number", description: "Max sections to return (default 3)" },
      },
    },
    run: ({ query, limit }) => searchDocs(query ? String(query) : "", Number(limit) || 3),
  },
];

// ── JSON-RPC over stdio ───────────────────────────────────────────────────

const INSTRUCTIONS =
  "VUI component library, for admin apps and marketing sites. Learning the package: " +
  "list_guides / get_guide serve the full docs site (installation through per-component " +
  "reference). Building an admin screen: search_docs for the rule, list_components / " +
  "get_component for the API, list_pages / get_page for a working example to copy. " +
  "Building a website page: compose_page for the block order, then list_blocks / " +
  "get_block for each one. Never hand-roll a table, a form, a floating panel or a hero " +
  "VUI already ships.";

export function handle(req) {
  const { id, method, params = {} } = req;
  const ok = (result) => ({ jsonrpc: "2.0", id, result });
  try {
    switch (method) {
      case "initialize":
        return ok({
          protocolVersion: params.protocolVersion || "2025-06-18",
          capabilities: { tools: {} },
          serverInfo: { name: "vui-ui", version: VERSION },
          instructions: INSTRUCTIONS,
        });
      case "ping":
        return ok({});
      case "tools/list":
        return ok({
          tools: TOOLS.map(({ name, description, inputSchema }) => ({
            name,
            description,
            inputSchema,
          })),
        });
      case "tools/call": {
        const tool = TOOLS.find((t) => t.name === params.name);
        if (!tool)
          return { jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown tool: ${params.name}` } };
        return ok({ content: [{ type: "text", text: tool.run(params.arguments || {}) }] });
      }
      default:
        return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown method: ${method}` } };
    }
  } catch (err) {
    return { jsonrpc: "2.0", id, error: { code: -32603, message: String(err?.message || err) } };
  }
}

export function serve() {
  let buffer = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    buffer += chunk;
    let nl;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      let req;
      try {
        req = JSON.parse(line);
      } catch {
        process.stdout.write(
          JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }) + "\n",
        );
        continue;
      }
      // Notifications (no id) get no response.
      if (req.id === undefined || req.id === null) continue;
      process.stdout.write(JSON.stringify(handle(req)) + "\n");
    }
  });
  process.stdin.on("end", () => process.exit(0));
}
