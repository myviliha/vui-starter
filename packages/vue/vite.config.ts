import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: `${src}/index.ts`, formats: ["es"] },
    rollupOptions: {
      // Never bundle the framework, the headless primitives or our own core: the
      // consumer installs those once and shares one copy.
      external: [/^vue$/, /^reka-ui/, /^@viliha\/vui-core/, /^@tanstack\/charts/],
      output: {
        // One output file per source file, so `@viliha/vui-vue/Button` resolves
        // to just that component and a bundler drops the rest. Bundling them
        // into shared chunks would make every import pull in all of them.
        preserveModules: true,
        preserveModulesRoot: src,
        entryFileNames: "[name].js",
      },
    },
    minify: false,
    sourcemap: true,
  },
});
