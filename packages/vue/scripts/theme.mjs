#!/usr/bin/env node
// Write dist/theme.css after the bundle, so a Vue consumer has one import.
//
// The `@source` line matters: Tailwind only emits the utilities it finds, and a
// consumer scanning their own app would never see the classes inside this
// package's compiled components. Pointing at the built output fixes that.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
mkdirSync(dist, { recursive: true });
writeFileSync(
  join(dist, "theme.css"),
  `/* VUI for Vue. Import after Tailwind:
 *   @import "tailwindcss";
 *   @import "@viliha/vui-vue/theme.css";
 */
@import "@viliha/vui-theme/theme.css";

/* Scan this package's components so their utilities are emitted. */
@source "./";
`,
);
console.log("vui-vue: wrote dist/theme.css");
