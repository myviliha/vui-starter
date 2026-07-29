// Block a bare `npm publish` / `pnpm publish` / `yarn publish` / `bun publish`.
// Publishing must go through scripts/publish.mjs (which sets VUI_PUBLISH=1), so
// the manifest is sanitized and the upload goes via npm — otherwise the README
// disappears on npmjs and/or the manifest ships invalid workspace: deps.
// Runs from prepublishOnly, so it fires no matter which client is used.
if (process.env.VUI_PUBLISH !== "1") {
  console.error(
    "\n✖ Don't publish this package directly.\n" +
      "  Run:  pnpm release            (from packages/ui)\n" +
      "  or:   node scripts/publish.mjs\n" +
      "  It publishes via npm with a sanitized manifest so the README shows on npmjs.\n",
  );
  process.exit(1);
}
