// Enforce `pnpm publish` for this package. It lives in a pnpm workspace and uses
// `workspace:*` for its internal @repo/* dev tooling. `pnpm publish` rewrites
// those to spec-valid versions in the tarball; `npm publish` ships the literal
// `workspace:*`, which is an invalid manifest. Runs from `prepublishOnly`, so it
// fires on publish (both clients) but not on pack/CI.
//
// Note: this has nothing to do with the npmjs "no README" display issue — that's
// a registry-side render bug; the README is present in every tarball regardless
// of client. See CHANGELOG 1.23.2.
const ua = process.env.npm_config_user_agent || "";
if (!ua.includes("pnpm")) {
  console.error(
    "\n✖ Publish this package with `pnpm publish` (run from packages/ui), not npm.\n" +
      "  npm ships the internal deps as literal `workspace:*` (invalid manifest);\n" +
      "  pnpm rewrites them to real versions. Detected client: " +
      (ua || "unknown") +
      "\n",
  );
  process.exit(1);
}
