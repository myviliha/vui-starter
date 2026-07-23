import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  // Generated scaffold snapshot + node CLI scripts aren't library sources and
  // shouldn't be linted against the React-internal ruleset.
  { ignores: ["template/**", "bin/**", "scripts/**"] },
  ...(Array.isArray(config) ? config : [config]),
];
