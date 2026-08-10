#!/usr/bin/env node
// Generate @viliha/vui-theme from the one source of truth,
// packages/ui/src/theme.css. Two outputs, both git-ignored:
//
//   theme.css      the source minus the React package's @source line, for anyone
//                  running Tailwind v4 (Vue, Svelte, Angular, Solid, Astro, …)
//   dist/vui.css   compiled plain CSS for people with no build step at all
//                  (Alpine, HTMX, 11ty, a <link> tag)
//
// Nothing is hand-copied, so there is no second file to drift.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const SOURCE = join(root, "..", "ui", "src", "theme.css");
const out = process.argv[2] ? resolve(process.argv[2]) : root;

// `@source "../"` tells Tailwind to scan the React package's components. It is
// meaningless (and wrong) once the stylesheet ships on its own.
const css = readFileSync(SOURCE, "utf8").replace(
  /^\/\* Scan this package.*\r?\n@source\s+"\.\.\/";\r?\n/m,
  "",
);
// Only the at-rule matters; the file's header comment mentions @source in prose.
if (/^@source/m.test(css)) {
  console.error("build: an @source rule survived the strip — check theme.css");
  process.exit(1);
}
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "theme.css"), css);

// The compiled build needs somewhere to find the utility classes VUI's own
// components use, so it scans the React source. That is what makes markup
// copied out of the docs render without a build step.
const entry = join(out, ".build-entry.css");
writeFileSync(
  entry,
  `@import "tailwindcss";\n@import "./theme.css";\n@source "${join(root, "..", "ui", "src")}";\n`,
);
mkdirSync(join(out, "dist"), { recursive: true });
try {
  execFileSync(
    "npx",
    ["--no-install", "@tailwindcss/cli", "-i", entry, "-o", join(out, "dist", "vui.css"), "--minify"],
    { cwd: root, stdio: "inherit" },
  );
} finally {
  rmSync(entry, { force: true });
}

const bytes = readFileSync(join(out, "dist", "vui.css")).length;
console.log(`vui-theme: wrote theme.css and dist/vui.css (${Math.round(bytes / 1024)} kB)`);
