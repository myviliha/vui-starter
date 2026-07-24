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

// A clean, consumer-ready Next config (backoffice's is monorepo / GH-Pages
// specific). TypeScript (.ts) to match create-next-app so a fresh scaffold
// overwrites its config instead of leaving two config files. Static export is
// what makes the open-tabs keep-alive work.
writeFileSync(
  join(out, "next.config.ts"),
  `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
