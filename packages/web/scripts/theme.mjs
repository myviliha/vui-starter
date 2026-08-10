#!/usr/bin/env node
// One stylesheet import for a site built from these blocks. It pulls in the
// design system and points Tailwind at the compiled blocks, so the utilities
// they use are emitted in the consumer's build.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
mkdirSync(dist, { recursive: true });
writeFileSync(
  join(dist, "theme.css"),
  `/* VUI website blocks. Import after Tailwind:
 *   @import "tailwindcss";
 *   @import "@viliha/vui-web/theme.css";
 */
@import "@viliha/vui-theme/theme.css";

/* Scan the compiled blocks so their utilities are emitted. */
@source "./";
`,
);
console.log("vui-web: wrote dist/theme.css");
