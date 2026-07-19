import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, SITE } from "@/lib/seo";

export const dynamic = "force-static";

/** Emitted as a static /sitemap.xml by `output: "export"`. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.startsWith("/docs") ? 0.8 : 0.6,
  }));
}
