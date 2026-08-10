import { CardGrid, Cta, Hero, Newsletter } from "@viliha/vui-web";

import { allPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Blog",
  description:
    "Notes on design systems, admin interfaces and building software that agents can read. Written by the people maintaining the library.",
  path: "/blog/",
});

export default function BlogPage() {
  const posts = allPosts();

  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="Blog"
        title="Notes from building it"
        lead="Design systems, admin interfaces, and the decisions behind the library. No launch announcements dressed up as insight."
      />
      <CardGrid
        items={posts.map((post) => ({
          title: post.title,
          body: post.description,
          href: `/blog/${post.slug}/`,
          meta: `${post.category} · ${post.readingTime}`,
          tags: post.tags.slice(0, 2),
        }))}
        columns={3}
      />
      <Newsletter
        eyebrow="Subscribe"
        title="New posts, when there are new posts"
        lead="Roughly monthly. Nothing else."
        footnote="Unsubscribe in one click."
        tone="muted"
      />
      <Cta
        variant="card"
        title="Have something to add?"
        lead="Corrections and counter-arguments are welcome, and we publish them."
        actions={
          <a href="/contact/" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent">
            Get in touch
          </a>
        }
      />
    </>
  );
}
