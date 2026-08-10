import { config } from "@repo/eslint-config/base";

/** Playwright specs are Node, and their assertions read as expressions. */
export default [
  ...config,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];
