import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on language, internet culture and why GenSpeak exists, written by the people building it.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <Container className="py-14">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Notes
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">
          Blog
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
          Longer thoughts on language, internet culture, and why a dictionary like this needed to
          exist in the first place.
        </p>
      </header>

      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="card focus-ring group mt-12 block overflow-hidden p-8 hover:-translate-y-0.5 sm:p-12"
        >
          <div className="flex flex-wrap items-center gap-3">
            {featured.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" size="md">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            {featured.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
            {featured.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-ink-subtle">
            <span>{featured.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3" aria-hidden />
              {formatPostDate(featured.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3" aria-hidden />
              {featured.readMinutes} min read
            </span>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-accent">
            Read the essay
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
          </p>
        </Link>
      ) : null}

      {rest.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card focus-ring group p-6 hover:-translate-y-0.5"
            >
              <h3 className="font-display text-2xl tracking-tight">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-ink-subtle">
                <span>{formatPostDate(post.date)}</span>
                <span>&middot;</span>
                <span>{post.readMinutes} min read</span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </Container>
  );
}
