import { ArrowRight, Calendar, ChevronRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { formatPostDate, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-line">
        <Container className="py-12 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1.5 text-xs text-ink-subtle"
          >
            <Link href="/blog" className="transition hover:text-ink-muted">
              Blog
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-ink-muted">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" size="md">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm text-ink-subtle">
            <span className="text-ink-muted">{post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3" aria-hidden />
              {formatPostDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3" aria-hidden />
              {post.readMinutes} min read
            </span>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="mx-auto max-w-2xl">
          <p className="font-display text-2xl leading-snug tracking-tight text-pretty">
            {post.excerpt}
          </p>

          <div className="prose-content mt-10 space-y-6">
            {post.body.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={index}
                    className="!mt-14 font-display text-3xl leading-tight tracking-tight"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={index}
                    className="border-l-2 border-accent py-1 pl-5 font-display text-xl leading-snug tracking-tight text-ink-muted italic"
                  >
                    {block.text}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-lg leading-relaxed text-ink-muted text-pretty">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mx-auto mt-16 max-w-2xl border-t border-line pt-10">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              Read next
            </h2>
            <div className="mt-4 space-y-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="focus-ring group flex items-center justify-between gap-4 rounded-xl border border-line p-4 transition hover:border-line-strong"
                >
                  <span className="font-display text-lg tracking-tight">{item.title}</span>
                  <ArrowRight
                    className="size-4 shrink-0 text-ink-subtle transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
