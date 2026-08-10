import type { MetadataRoute } from "next";

import { allPosts } from "@/lib/posts";
import { ROUTES, SITE } from "@/lib/site";

// Static export: the sitemap is generated at build time from the route list plus
// every post, so a new post appears in it without anyone remembering.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const pages = ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    priority: route === "/" ? 1 : 0.7,
  }));
  const posts = allPosts().map((post) => ({
    url: `${base}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
