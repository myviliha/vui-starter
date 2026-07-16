import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure-logic tests run in Node; component tests would add jsdom + RTL.
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
