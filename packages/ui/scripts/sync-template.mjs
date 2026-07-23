#!/usr/bin/env node
// Regenerate packages/ui/template/ from apps/backoffice so the `init` CLI
// scaffolds the real demo shell + pages. The backoffice app stays the single
// source of truth; this snapshot is git-ignored and rebuilt on prepublish.
//
//   pnpm --filter @viliha/vui-ui sync-template
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, ".."); // packages/ui
const app = join(pkgRoot, "..", "..", "apps", "backoffice");
const out = join(pkgRoot, "template");

if (!existsSync(app)) {
  console.error(`sync-template: backoffice app not found at ${app}`);
  process.exit(1);
}

// Start clean.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// app/** — the shell + demo pages, minus the docs SITE and deploy-only SEO.
const APP_SKIP = new Set(["docs", "robots.ts", "sitemap.ts"]);
const appSrc = join(app, "app");
cpSync(appSrc, join(out, "app"), {
  recursive: true,
  filter: (src) => {
    const rel = src.slice(appSrc.length + 1);
    if (!rel) return true;
    return !APP_SKIP.has(rel.split(sep)[0]);
  },
});

// components/** — shadcn + shared, minus docs-site-only chrome.
const COMP_SKIP = new Set([
  "docs-shell.tsx",
  "doc.tsx",
  "template-block.tsx",
  "copy-button.tsx",
]);
cpSync(join(app, "components"), join(out, "components"), {
  recursive: true,
  filter: (src) => !COMP_SKIP.has(src.split(sep).pop()),
});

// lib/** — mock data, utils, seo config.
cpSync(join(app, "lib"), join(out, "lib"), { recursive: true });

// Root files copied verbatim.
for (const f of [".env.example", "postcss.config.mjs"]) {
  if (existsSync(join(app, f))) cpSync(join(app, f), join(out, f));
}

// A clean, consumer-ready Next config (backoffice's is monorepo / GH-Pages
// specific). Static export is what makes the open-tabs keep-alive work.
writeFileSync(
  join(out, "next.config.mjs"),
  `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // VUI ships as TypeScript source — Next must transpile it.
  transpilePackages: ["@viliha/vui-ui"],
  // Static export makes the open-tabs keep-alive work (all client at runtime).
  // Remove these three if you need server components rendered per route.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
`,
);

console.log(`sync-template: wrote ${out}`);
