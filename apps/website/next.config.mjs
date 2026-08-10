/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export, like the backoffice: the marketing site is files on a CDN.
  // It also means no server, so forms post to a third party and every route is
  // known at build time.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@viliha/vui-ui", "@viliha/vui-web"],
};

export default nextConfig;
