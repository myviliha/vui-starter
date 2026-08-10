import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  // Components render to a string through Vue's SSR renderer, so there is no
  // DOM to emulate and no jsdom dependency.
  test: { environment: "node", include: ["*.test.ts", "src/**/*.test.ts"] },
});
