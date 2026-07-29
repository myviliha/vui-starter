import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, SITE, canonicalFor } from "@/lib/seo";

export const dynamic = "force-static";

/** Emitted as a static /sitemap.xml by `output: "export"`. URLs use the
 * trailing-slash canonical (the app runs with `trailingSlash: true`), so each
 * entry points at the page the host actually serves, not a redirect. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE.url}${canonicalFor(path)}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.startsWith("/docs") ? 0.8 : 0.6,
  }));
}
