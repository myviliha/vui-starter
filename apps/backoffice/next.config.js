import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Monorepo root (two levels up). Pin it so a stray ~/pnpm-lock.yaml doesn't
// make Next infer $HOME as the workspace root.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: repoRoot },
  // Static export for GitHub Pages (Pages has no Node server).
  output: "export",
  // next/image can't optimize without a server.
  images: { unoptimized: true },
  // Emit /route/index.html so Pages serves clean URLs.
  trailingSlash: true,
};

export default nextConfig;
