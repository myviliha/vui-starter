import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Blocks render to a string through React's server renderer: no DOM to
  // emulate, no jsdom, and the assertion is the markup a visitor receives.
  test: { environment: "node", include: ["*.test.tsx", "*.test.ts"] },
});
