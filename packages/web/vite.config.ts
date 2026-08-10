import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: `${src}/index.ts`, formats: ["es"] },
    rollupOptions: {
      // Never bundle React, the component library or the shared logic: the
      // consumer installs those once and every block shares one copy.
      external: [/^react/, /^react-dom/, /^@viliha\//],
      output: {
        // One file per block, so importing a hero does not pull in the pricing
        // table. Same reasoning as the Vue package.
        preserveModules: true,
        preserveModulesRoot: src,
        entryFileNames: "[name].js",
      },
    },
    minify: false,
    sourcemap: true,
  },
});
