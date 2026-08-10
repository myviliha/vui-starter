import { notFound } from "next/navigation";

import {
  ArticleHeader,
  ArticlePager,
  ArticleTags,
  AuthorCard,
  CardGrid,
  Prose,
  ShareBlock,
  TableOfContents,
} from "@viliha/vui-web";

import { allPosts, headingId, postBySlug, relatedPosts } from "@/lib/posts";
import { SITE, pageMeta } from "@/lib/site";

/** Every post is known at build time, which is what a static export requires. */
export function generateStaticParams() {
  return allPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const posts = allPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const previous = posts[index + 1];
  const next = posts[index - 1];
  const related = relatedPosts(slug);
  const url = `${SITE.url}/blog/${post.slug}/`;

  const toc = post.sections
    .filter((s) => s.heading)
    .map((s) => ({ id: headingId(s.heading!), label: s.heading!, level: 2 as const }));

  return (
    <>
      {/* Structured data, so the post can appear as an article in search. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Person", name: post.author.name },
            publisher: { "@type": "Organization", name: SITE.name },
            mainEntityOfPage: url,
          }),
        }}
      />

      <section className="vui-section">
        <div className="vui-container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <article className="flex min-w-0 flex-col gap-8">
              <ArticleHeader
                title={post.title}
                description={post.description}
                category={post.category}
                date={post.date}
                readingTime={post.readingTime}
                author={post.author}
              />

              <Prose>
                {post.sections.map((section, i) => (
                  <section key={i}>
                    {section.heading && <h2 id={headingId(section.heading)}>{section.heading}</h2>}
                    {section.body.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                    {section.list && (
                      <ul>
                        {section.list.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.quote && <blockquote>{section.quote}</blockquote>}
                  </section>
                ))}
              </Prose>

              <ArticleTags tags={post.tags} hrefFor={() => "/blog/"} />
              <ShareBlock url={url} title={post.title} />
              <AuthorCard author={post.author} />
              <ArticlePager
                previous={previous ? { label: previous.title, href: `/blog/${previous.slug}/` } : undefined}
                next={next ? { label: next.title, href: `/blog/${next.slug}/` } : undefined}
              />
            </article>

            {/* Sticky on wide screens only: on a phone it would eat the viewport. */}
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <TableOfContents items={toc} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <CardGrid
          title="Related reading"
          tone="muted"
          columns={2}
          items={related.map((p) => ({
            title: p.title,
            body: p.description,
            href: `/blog/${p.slug}/`,
            meta: `${p.category} · ${p.readingTime}`,
          }))}
        />
      )}
    </>
  );
}
