import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, expect, it } from "vitest";

// Build into a temp dir so the test never depends on (or clobbers) a previous
// local build.
const root = fileURLToPath(new URL(".", import.meta.url));
let out;

beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), "vui-theme-"));
  execFileSync("node", [join(root, "scripts", "build.mjs"), out], { stdio: "pipe" });
}, 60_000);

afterAll(() => rmSync(out, { recursive: true, force: true }));

it("ships the tokens without the React package's @source rule", () => {
  const css = readFileSync(join(out, "theme.css"), "utf8");
  expect(css).toContain("--brand:");
  expect(css).toContain(".vui-scroll");
  // The at-rule would point Tailwind at a directory that isn't there.
  expect(css).not.toMatch(/^@source/m);
});

it("compiles a stylesheet that works with no build step", () => {
  const css = readFileSync(join(out, "dist", "vui.css"), "utf8");
  // oklch() proves the tokens made it through.
  expect(css).toContain("oklch(");
  expect(css).toContain(".vui-scroll");
  // A utility class only Tailwind can emit proves the compiler actually ran and
  // scanned the components, rather than copying the source through.
  expect(css).toMatch(/\.bg-popover/);
});
