import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    // Docs pages are prose-heavy; don't force HTML entity escaping in copy.
    files: ["app/docs/**/*.{ts,tsx}"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];
