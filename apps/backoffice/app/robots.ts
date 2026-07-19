import type { MetadataRoute } from "next";

import { SITE } from "@/lib/seo";

export const dynamic = "force-static";

/** Emitted as a static /robots.txt by `output: "export"`. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/onboarding/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
