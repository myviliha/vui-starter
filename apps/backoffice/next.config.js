/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages (Pages has no Node server).
  output: "export",
  // next/image can't optimize without a server.
  images: { unoptimized: true },
  // Emit /route/index.html so Pages serves clean URLs.
  trailingSlash: true,
};

export default nextConfig;
