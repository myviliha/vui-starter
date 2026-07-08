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
];
