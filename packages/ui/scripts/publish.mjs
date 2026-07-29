// One publish path for everyone, whatever package manager you use.
//
// Run it with Node (always present alongside npm) so npm / pnpm / yarn / bun
// users all publish the same way:
//
//   node scripts/publish.mjs            # or: pnpm release
//   node scripts/publish.mjs --dry-run  # extra args pass through to npm
//
// Two problems it solves, which is why a bare `<pm> publish` doesn't just work:
//
//  1. Spec-valid manifest. This package uses `workspace:*` for its internal
//     @repo/* dev tooling. Those are devDependencies (consumers never install
//     them), but a literal `workspace:*` in the published manifest is invalid.
//     We strip them here, so the manifest is valid under ANY client.
//
//  2. README on npmjs. npmjs.com renders the README from the per-version
//     `readme` field in the publish request. `npm publish` sends it; pnpm and
//     yarn-classic do NOT — so those leave a blank README page even though
//     README.md is in the tarball. We always upload via `npm publish`.
//
// The manifest edit is done on a temp copy and restored in `finally`, so your
// working tree is left exactly as it was.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(pkgDir, "package.json");
const original = readFileSync(pkgPath, "utf8");
const pkg = JSON.parse(original);

// Runtime deps must never use workspace: — consumers can't resolve it. Only our
// internal tooling does, in devDependencies. Guard the runtime fields, then
// strip workspace: devDeps.
for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
  for (const [name, spec] of Object.entries(pkg[field] ?? {})) {
    if (String(spec).startsWith("workspace:")) {
      console.error(
        `\n✖ ${field}.${name} = "${spec}". Resolve workspace: protocols in ` +
          `runtime deps before publishing (consumers can't install them).\n`,
      );
      process.exit(1);
    }
  }
}
let stripped = 0;
for (const [name, spec] of Object.entries(pkg.devDependencies ?? {})) {
  if (String(spec).startsWith("workspace:")) {
    delete pkg.devDependencies[name];
    stripped++;
  }
}

const args = process.argv.slice(2);
console.log(
  `Publishing ${pkg.name}@${pkg.version} via npm ` +
    `(stripped ${stripped} workspace devDep(s))…`,
);
try {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  // VUI_PUBLISH lets prepublishOnly's guard know this went through the script.
  execFileSync("npm", ["publish", "--access", "public", ...args], {
    cwd: pkgDir,
    stdio: "inherit",
    env: { ...process.env, VUI_PUBLISH: "1" },
  });
} finally {
  writeFileSync(pkgPath, original); // restore the exact original manifest
}
