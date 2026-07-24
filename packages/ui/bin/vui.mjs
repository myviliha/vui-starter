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
import { execSync } from "node:child_process";

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
       npm i @viliha/vui-ui ${DEPS}
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
  --nextjs | --turbo          standalone Next.js app, or a Turborepo (Q0)
  --dir <path>                Turborepo target app dir (default apps/web)
  --fresh | --existing        project type (Q1)
  --prebuilt | --theme-only   pre-built shell + demo, or just the theme (Q2)
  --yes, -y                   accept defaults (nextjs, fresh, prebuilt)
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
  "next.config.ts",
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

// Detect the package manager from lockfiles (falls back to npm).
function detectPM(root) {
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  if (existsSync(join(root, "bun.lockb")) || existsSync(join(root, "bun.lock")))
    return "bun";
  return "npm";
}
const ADD_CMD = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

function allFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) allFiles(abs, out);
    else out.push(abs);
  }
  return out;
}

async function main() {
  const cwd = process.cwd();

  // Q0 — standalone Next.js vs Turborepo (decides WHERE files land).
  let turbo = has("--turbo") ? true : has("--nextjs") ? false : null;
  if (turbo === null) {
    const a = await ask(
      "Is this a standalone Next.js app or a Turborepo? [N/t] ",
      "n",
    );
    turbo = a.startsWith("t");
  }
  let appDir = ".";
  if (turbo) {
    const di = args.indexOf("--dir");
    const flagDir = di >= 0 ? args[di + 1] : null;
    appDir =
      flagDir ||
      (await ask("Target app directory inside the repo? [apps/web] ", "apps/web"));
  }
  const targetRoot = join(cwd, appDir);

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

  const files = allFiles(TEMPLATE);
  let created = 0;
  let skipped = 0;
  const configSkipped = [];

  const label = `${turbo ? "turbo" : "nextjs"}, ${fresh ? "fresh" : "existing"}, ${prebuilt ? "prebuilt" : "theme-only"}`;
  console.log(`\nScaffolding VUI (${label}) into ${targetRoot}${dry ? "  [dry run]" : ""}\n`);

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
    const dest = join(targetRoot, rel);
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

  // Install dependencies. Turborepo installs are workspace-specific, so we only
  // auto-install for a standalone Next.js app; turbo gets manual instructions.
  const pm = detectPM(targetRoot);
  const installList = `@viliha/vui-ui ${DEPS}`;
  let installed = false;
  if (!turbo) {
    let doInstall = has("--no-install")
      ? false
      : has("--yes") || has("-y")
        ? true
        : null;
    if (doInstall === null) {
      const a = await ask(`Install dependencies now with ${pm}? [Y/n] `, "y");
      doInstall = !a.startsWith("n");
    }
    if (doInstall && !dry) {
      console.log(`\nInstalling dependencies with ${pm}…\n`);
      try {
        execSync(`${ADD_CMD[pm]} ${installList}`, {
          cwd: targetRoot,
          stdio: "inherit",
        });
        installed = true;
      } catch {
        console.error(
          `\nInstall failed — run it manually:\n  ${ADD_CMD[pm]} ${installList}\n`,
        );
      }
    }
  }

  // Per-leaf next steps.
  const installStep = installed
    ? ""
    : `  1. ${ADD_CMD[pm]} ${installList}\n`;
  const devStepNum = installed ? "1" : "2";
  if (fresh && prebuilt) {
    console.log(`
Next steps:
${installStep}  ${devStepNum}. ${pm === "npm" ? "npm run dev" : `${pm} dev`}   ->   http://localhost:3000  (redirects to /dashboard)

Everything is in YOUR repo — edit app/_components/nav-config.ts, set your logo
(NEXT_PUBLIC_LOGO_URL in .env), and delete demo pages you don't need.
`);
  } else if (fresh && !prebuilt) {
    console.log(`
Theme wired (globals.css + next.config). No shell or demo pages — build your own.

Next steps:
${installStep}  ${devStepNum}. Import components from @viliha/vui-ui/* in your pages, then run dev.
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

  if (turbo) {
    console.log(`Turborepo — finish inside the target app (${appDir}):
  1. cd ${appDir}
  2. Install the deps in THIS app (not the repo root):
       ${ADD_CMD[pm]} ${installList}
     (or from the root with your workspace filter, e.g.
       ${pm} --filter <app-name> add ${installList})
  3. Make sure your workspace globs include this app
     (pnpm-workspace.yaml \`packages:\` or package.json \`workspaces\`).
  4. Run it: ${pm} --filter <app-name> dev   (or \`cd ${appDir} && ${pm} dev\`)

Deps were NOT auto-installed for a monorepo — installs are workspace-specific.
`);
  }
}

main();
