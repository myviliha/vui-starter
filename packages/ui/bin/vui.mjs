#!/usr/bin/env node
// @viliha/vui-ui CLI — scaffolds the app shell + demo pages into a consumer's
// Next.js project (shadcn-style: the files land in YOUR repo, you own them).
//
//   npx @viliha/vui-ui init [options]
//
// Interactive by default: asks whether this is a fresh or existing project and
// whether to include the demo pages. Non-interactive with flags (for CI/agents).
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const TEMPLATE = fileURLToPath(new URL("../template/", import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0];
const has = (f) => args.includes(f);

function usage() {
  console.log(`@viliha/vui-ui

Usage:
  npx @viliha/vui-ui init [options]

  init            Scaffold the VUI app shell (+ optional demo pages) into this
                  project. Interactive unless flags are given. Non-destructive:
                  existing files are skipped (use --force to overwrite).

Options:
  --fresh         Treat as a brand-new project (copies config too).
  --existing      Treat as an existing project (skips config; prints merge steps).
  --demo          Include the demo pages (dashboard, CRM, calendar, chat, …).
  --no-demo       Shell + dashboard only, no other demo pages.
  --yes, -y       Accept defaults without prompting (fresh, with demo).
  --force         Overwrite files that already exist.
  --dry-run       Show what would be written without touching the disk.
`);
}

if (cmd !== "init") {
  usage();
  process.exit(cmd ? 1 : 0);
}
if (!existsSync(TEMPLATE)) {
  console.error(
    "vui: bundled template not found. Reinstall @viliha/vui-ui (the template " +
      "ships with the published package).",
  );
  process.exit(1);
}

const dry = has("--dry-run");
const force = has("--force");

async function ask(question, def) {
  if (has("--yes") || has("-y") || !stdin.isTTY) return def;
  const rl = createInterface({ input: stdin, output: stdout });
  const a = (await rl.question(question)).trim().toLowerCase();
  rl.close();
  return a || def;
}

// Config/root files that an existing project almost certainly already has —
// copying them would collide, so in "existing" mode we skip + print merge steps.
const CONFIG_FILES = new Set([
  "next.config.mjs",
  "postcss.config.mjs",
  "app/globals.css",
  "app/layout.tsx",
  "app/page.tsx",
]);

// A file is a "demo page" (optional) vs the shell (always). The dashboard stays
// in the shell so `/` has a landing page.
function isDemo(rel) {
  const p = rel.split(sep).join("/");
  if (p.startsWith("app/auth/")) return true;
  if (p.startsWith("app/onboarding/")) return true;
  if (p.startsWith("app/register-business/")) return true;
  if (p.startsWith("app/(app)/")) {
    return !(p === "app/(app)/layout.tsx" || p.startsWith("app/(app)/dashboard/"));
  }
  return false;
}

async function main() {
  // 1. Fresh vs existing.
  let mode = has("--existing") ? "existing" : has("--fresh") ? "fresh" : null;
  if (!mode) {
    const a = await ask(
      "Is this a fresh project or an existing one? [F(resh)/e(xisting)] ",
      "f",
    );
    mode = a.startsWith("e") ? "existing" : "fresh";
  }

  // 2. Include the demo pages?
  let demo = has("--demo") ? true : has("--no-demo") ? false : null;
  if (demo === null) {
    const a = await ask(
      "Install the demo pages (dashboard, CRM, calendar, chat, support…)? [Y/n] ",
      "y",
    );
    demo = !a.startsWith("n");
  }

  const cwd = process.cwd();
  let created = 0;
  let skipped = 0;
  const configSkipped = [];

  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else files.push(abs);
    }
  })(TEMPLATE);

  console.log(
    `\nScaffolding VUI (${mode}${demo ? ", with demo" : ", no demo"}) into ${cwd}${
      dry ? "  [dry run]" : ""
    }\n`,
  );

  for (const abs of files) {
    const rel = relative(TEMPLATE, abs);
    const norm = rel.split(sep).join("/");

    if (isDemo(rel) && !demo) continue; // demo not selected
    if (mode === "existing" && CONFIG_FILES.has(norm)) {
      configSkipped.push(norm);
      continue;
    }

    const dest = join(cwd, rel);
    if (existsSync(dest) && !force) {
      skipped++;
      console.log(`  skip      ${rel}`);
      continue;
    }
    if (!dry) {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(abs, dest);
    }
    created++;
    console.log(`  ${dry ? "would add" : "added   "}  ${rel}`);
  }

  console.log(
    `\nDone — ${created} file(s) ${dry ? "would be added" : "added"}, ${skipped} skipped.`,
  );

  const DEPS = [
    "@radix-ui/react-icons",
    "@radix-ui/react-slot",
    "@tanstack/react-table",
    "class-variance-authority",
    "clsx",
    "cmdk",
    "date-fns",
    "input-otp",
    "lucide-react",
    "next-themes",
    "radix-ui",
    "react-day-picker",
    "react-hook-form",
    "@hookform/resolvers",
    "recharts",
    "sonner",
    "tailwind-merge",
    "zod",
  ].join(" ");

  if (mode === "existing") {
    console.log(`
⚠  Existing project — config files were NOT written to avoid clobbering yours.
   Merge these into your project manually:

   • next.config: add
       transpilePackages: ["@viliha/vui-ui"]
     (for the demo's tab keep-alive: output:"export", images:{unoptimized:true},
      trailingSlash:true — optional, only if you want static-export keep-alive)
   • app/globals.css: add
       @import "tailwindcss";
       @import "@viliha/vui-ui/theme.css";
   • tsconfig.json: map the alias the scaffold uses
       "compilerOptions": { "paths": { "@/*": ["./*"] } }
   • Root app/layout.tsx: import "./globals.css" and mount fonts if you want the
     demo's exact look (see the scaffolded app/(app)/layout.tsx for the shell).

   The shell + pages were added under app/(app)/ and app/_components/ — review
   them (re-run with --dry-run first if unsure) before committing.
`);
  }

  console.log(`Next steps:
  1. Install peer dependencies:
       npm i ${DEPS}
  2. Start the app:
       npm run dev   ->   http://localhost:3000  (redirects to /dashboard)

Everything landed in YOUR repo — edit app/_components/nav-config.ts, set your
logo (NEXT_PUBLIC_LOGO_URL in .env), and delete demo pages you don't need.
Docs: /docs/navigation (sidebar, tabs) and /docs/configuration (logo, env).
`);
}

main();
