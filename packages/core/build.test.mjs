import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, expect, it } from "vitest";

// The package is generated from packages/ui/src, so the test builds it first and
// then works against the compiled output a consumer would actually import.
const root = fileURLToPath(new URL(".", import.meta.url));
let core;

beforeAll(async () => {
  execFileSync("node", [join(root, "scripts", "build.mjs")], { stdio: "pipe" });
  core = await import(join(root, "dist", "index.js"));
}, 120_000);

it("carries no framework import into the build", () => {
  for (const f of ["theme-config.js", "table-io.js", "utils.js"]) {
    const js = readFileSync(join(root, "dist", f), "utf8");
    expect(js).not.toMatch(/from\s+["'](react|react-dom|vue|svelte)["']/);
    expect(js).not.toContain("use client");
  }
});

it("themes: turns config into CSS variables anything can apply", () => {
  const vars = core.themeToCssVars({ brand: "#266df0" });
  expect(vars["--brand"]).toBe("#266df0");
  // The readable text colour is derived, not configured.
  expect(vars["--button-primary-foreground"]).toBe("#ffffff");
  expect(core.parseHex("#266df0")).not.toBeNull();
  // A value that could break out of a style attribute is refused.
  expect(core.parseTheme(JSON.stringify({ brand: '#fff;} body{display:none' })).brand).toBeUndefined();
});

it("tables: round-trips CSV with separators inside a value", () => {
  const cols = [{ key: "name", label: "Name" }];
  const csv = core.rowsToCSV(cols, [{ name: 'a,b"c' }]);
  expect(core.parseCSV(csv)[0].Name).toBe('a,b"c');
});

it("classes: the last conflicting Tailwind utility wins", () => {
  expect(core.cn("p-2", "p-4")).toBe("p-4");
});
