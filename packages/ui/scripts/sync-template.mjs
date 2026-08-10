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
  readFileSync,
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
// VUI's own commerce, not a starter pattern. Terms and Privacy are useful
// boilerplate for any app; a page arguing that VUI's core is MIT is not.
const APP_SKIP_PATHS = ["(legal)/pricing"];
const appSrc = join(app, "app");
cpSync(appSrc, join(out, "app"), {
  recursive: true,
  filter: (src) => {
    const rel = src.slice(appSrc.length + 1);
    if (!rel) return true;
    const posix = rel.split(sep).join("/");
    if (APP_SKIP_PATHS.some((p) => posix === p || posix.startsWith(p + "/")))
      return false;
    return !APP_SKIP.has(rel.split(sep)[0]);
  },
});

// components/** — shadcn + shared, minus docs-site-only chrome.
const COMP_SKIP = new Set([
  "docs-shell.tsx",
  "doc.tsx",
  "template-block.tsx",
  "copy-button.tsx",
  "pm-tabs.tsx",
]);
cpSync(join(app, "components"), join(out, "components"), {
  recursive: true,
  filter: (src) => !COMP_SKIP.has(src.split(sep).pop()),
});

// Drop the optional `tw-animate-css` import so the scaffold needs no extra CSS
// dependency (VUI's own animations live in theme.css; only shadcn component
// entrance animations are affected). This is the recurring "Can't resolve
// tw-animate-css" install error — remove the requirement at the source.
const gcss = join(out, "app", "globals.css");
if (existsSync(gcss)) {
  writeFileSync(
    gcss,
    readFileSync(gcss, "utf8").replace(
      /^@import\s+["']tw-animate-css["'];?[ \t]*\r?\n/m,
      "",
    ),
  );
}

// lib/** — mock data, utils, seo config.
cpSync(join(app, "lib"), join(out, "lib"), { recursive: true });

// Root files copied verbatim.
for (const f of [".env.example", "postcss.config.mjs"]) {
  if (existsSync(join(app, f))) cpSync(join(app, f), join(out, f));
}

// The Pro checkout variable belongs to VUI's own pricing page, which the
// scaffold does not get. Drop it rather than hand every new project a setting
// that points at nothing.
const envExample = join(out, ".env.example");
if (existsSync(envExample)) {
  writeFileSync(
    envExample,
    readFileSync(envExample, "utf8").replace(
      /\n# Where the "Pro" card[\s\S]*?NEXT_PUBLIC_PRO_CHECKOUT_URL=""\n/,
      "",
    ),
  );
}

// A clean, consumer-ready Next config (backoffice's is monorepo / GH-Pages
// specific). TypeScript (.ts) to match create-next-app so a fresh scaffold
// overwrites its config instead of leaving two config files. Static export is
// what makes the open-tabs keep-alive work.
writeFileSync(
  join(out, "next.config.ts"),
  `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this app so Next doesn't infer it from a stray
  // lockfile higher up the tree (e.g. a home-dir bun.lock or an outer monorepo).
  turbopack: { root: __dirname },
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

// A standalone tsconfig with the "@/*" -> project-root alias the scaffold's
// files import through (backoffice's extends a monorepo base, so it can't be
// copied verbatim). Written to the app root so `@/lib/...` etc. resolve.
writeFileSync(
  join(out, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  ) + "\n",
);

console.log(`sync-template: wrote ${out}`);
