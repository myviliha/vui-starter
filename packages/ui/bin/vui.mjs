#!/usr/bin/env node
// @viliha/vui-ui CLI — sets up the theme in a consumer's Next.js project.
//
//   npx @viliha/vui-ui init [options]
//
// Interactive decision tree (skip with flags):
//   1. Fresh project?              --fresh | --existing
//   2. Pre-built theme + demo?     --prebuilt | --theme-only
//
//   fresh    + prebuilt    -> full runnable app: config + shell + demo pages
//   fresh    + theme-only  -> just the theme wiring (globals/next.config), you build
//   existing + prebuilt    -> shell + demo added (config untouched; merge steps printed)
//   existing + theme-only  -> nothing copied; prints the wiring steps
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const TEMPLATE = fileURLToPath(new URL("../template/", import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0];
const has = (f) => args.includes(f);
const dry = has("--dry-run");
const forceFlag = has("--force");

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

const WIRING_STEPS = `  1. Install peer deps (those your components use):
       npm i ${DEPS}
  2. app/globals.css:
       @import "tailwindcss";
       @import "@viliha/vui-ui/theme.css";
  3. next.config:  transpilePackages: ["@viliha/vui-ui"]
  4. tsconfig.json (only if you copy the reference-app pieces):
       "compilerOptions": { "paths": { "@/*": ["./*"] } }
Then import components from @viliha/vui-ui/* and build your pages.`;

function usage() {
  console.log(`@viliha/vui-ui

Usage:
  npx @viliha/vui-ui init [options]

  init            Set up the VUI theme in this project (interactive).

Options:
  --fresh | --existing        project type (Q1)
  --prebuilt | --theme-only   pre-built shell + demo, or just the theme (Q2)
  --yes, -y                   accept defaults (fresh, prebuilt)
  --force                     overwrite existing files
  --dry-run                   preview without writing
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

async function ask(question, def) {
  if (has("--yes") || has("-y") || !stdin.isTTY) return def;
  const rl = createInterface({ input: stdin, output: stdout });
  const a = (await rl.question(question)).trim().toLowerCase();
  rl.close();
  return a || def;
}

// Theme wiring config an existing project already has — never clobbered there.
const WIRING = new Set([
  "next.config.mjs",
  "postcss.config.mjs",
  ".env.example",
  "app/globals.css",
]);

// Optional demo pages (vs the always-present shell). Dashboard stays in the
// shell so `/` has a landing page.
function isDemo(rel) {
  const p = rel.split(sep).join("/");
  if (p.startsWith("app/auth/")) return true;
  if (p.startsWith("app/onboarding/")) return true;
  if (p.startsWith("app/register-business/")) return true;
  if (p.startsWith("app/(app)/"))
    return !(p === "app/(app)/layout.tsx" || p.startsWith("app/(app)/dashboard/"));
  return false;
}

function category(rel) {
  const p = rel.split(sep).join("/");
  if (WIRING.has(p)) return "wiring";
  if (isDemo(rel)) return "demo";
  return "shell";
}

function allFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) allFiles(abs, out);
    else out.push(abs);
  }
  return out;
}

async function main() {
  // Q1 — fresh vs existing.
  let fresh = has("--fresh") ? true : has("--existing") ? false : null;
  if (fresh === null) {
    const a = await ask("Are you installing VUI in a fresh project? [Y/n] ", "y");
    fresh = !a.startsWith("n");
  }

  // Q2 — pre-built (shell + demo) vs theme-only.
  let prebuilt = has("--prebuilt") ? true : has("--theme-only") ? false : null;
  if (prebuilt === null) {
    const q = fresh
      ? "Install the pre-built theme with a Next.js project (shell + demo pages)? [Y/n] "
      : "Install the pre-built theme (shell + demo pages) into this project? [Y/n] ";
    const a = await ask(q, "y");
    prebuilt = !a.startsWith("n");
  }

  // Existing + theme-only: nothing to copy — just print the wiring steps.
  if (!fresh && !prebuilt) {
    console.log(
      `\nTheme-only setup for an existing project — no files copied.\n\n` +
        `Wire the theme into your app:\n${WIRING_STEPS}\n`,
    );
    return;
  }

  const cwd = process.cwd();
  const files = allFiles(TEMPLATE);
  let created = 0;
  let skipped = 0;
  const configSkipped = [];

  const label = `${fresh ? "fresh" : "existing"}, ${prebuilt ? "prebuilt" : "theme-only"}`;
  console.log(`\nScaffolding VUI (${label}) into ${cwd}${dry ? "  [dry run]" : ""}\n`);

  for (const abs of files) {
    const rel = relative(TEMPLATE, abs);
    const cat = category(rel);

    // Which files this leaf installs.
    const include =
      fresh && prebuilt
        ? true // everything: config + shell + demo
        : fresh && !prebuilt
          ? cat === "wiring" // just the theme wiring
          : /* existing && prebuilt */ cat !== "wiring"; // shell + demo, not config
    if (!include) {
      if (!fresh && cat === "wiring") configSkipped.push(rel.split(sep).join("/"));
      continue;
    }

    // Fresh overwrites boilerplate (create-next-app defaults); existing is
    // non-destructive so we never clobber the user's own files.
    const force = forceFlag || fresh;
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

  // Per-leaf next steps.
  if (fresh && prebuilt) {
    console.log(`
Next steps:
  1. npm i ${DEPS}
  2. npm run dev   ->   http://localhost:3000  (redirects to /dashboard)

Everything is in YOUR repo — edit app/_components/nav-config.ts, set your logo
(NEXT_PUBLIC_LOGO_URL in .env), and delete demo pages you don't need.
`);
  } else if (fresh && !prebuilt) {
    console.log(`
Theme wired (globals.css + next.config). No shell or demo pages — build your own.

Next steps:
  1. npm i ${DEPS}
  2. Import components from @viliha/vui-ui/* in your pages, then: npm run dev
`);
  } else {
    // existing + prebuilt
    console.log(`
⚠  Existing project — config files were NOT written. Merge these yourself:
${WIRING_STEPS}

The shell + demo were added under app/(app)/ and app/_components/ — review them
(re-run with --dry-run first if unsure) before committing.${
      configSkipped.length
        ? `\nSkipped config: ${configSkipped.join(", ")}`
        : ""
    }
`);
  }
}

main();
