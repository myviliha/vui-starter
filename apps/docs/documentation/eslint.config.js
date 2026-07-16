import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // Docs prose contains apostrophes/quotes and inline code samples in JSX
    // text; escaping every one adds noise without value on a docs site.
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];
