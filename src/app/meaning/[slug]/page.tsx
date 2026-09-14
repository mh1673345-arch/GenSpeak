import { Calendar, ChevronRight, Quote, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryIcon } from "@/components/category-icon";
import { CopyLink } from "@/components/copy-link";
import { DefinitionView } from "@/components/definition-view";
import { TermCard } from "@/components/term-card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { TrendPill } from "@/components/ui/trend";
import { getAllTerms, getCategoryBySlug, getRelatedTerms, getTerm } from "@/lib/dictionary";
import { buildTermJsonLd, buildTermMetadata, safeJsonLd } from "@/lib/seo";

interface MeaningPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTerms().map((term) => ({ slug: term.slug }));
}

export async function generateMetadata(props: MeaningPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const term = getTerm(slug);
  if (!term) notFound();

  return buildTermMetadata(term);
}

const statusCopy: Record<string, string> = {
  rising: "Gaining ground fast",
  mainstream: "In wide general use",
  classic: "Long established online",
  niche: "Common inside its community",
  fading: "Past its peak",
};

export default async function MeaningPage(props: MeaningPageProps) {
  const { slug } = await props.params;
  const term = getTerm(slug);
  if (!term) notFound();

  const category = getCategoryBySlug(term.category);
  const related = getRelatedTerms(term);
  const jsonLd = buildTermJsonLd(term, category?.name);

  return (
    <article style={{ "--cat": category?.hue } as React.CSSProperties}>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}

      <div className="cat-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle"
          >
            <Link href="/" className="transition hover:text-ink-muted">
              Home
            </Link>
            <ChevronRight className="size-3 shrink-0" aria-hidden />
            <Link href="/dictionary" className="transition hover:text-ink-muted">
              Dictionary
            </Link>
            <ChevronRight className="size-3 shrink-0" aria-hidden />
            <Link href={`/category/${term.category}`} className="transition hover:text-ink-muted">
              {category?.name ?? term.category}
            </Link>
            <ChevronRight className="size-3 shrink-0" aria-hidden />
            <span className="text-ink-muted">{term.term}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="category" size="md">
              <CategoryIcon name={category?.icon ?? "Sparkles"} className="size-3" />
              {category?.name}
            </Badge>
            <TrendPill value={term.trend} />
            <span className="font-mono text-[11px] tracking-widest text-ink-subtle uppercase">
              {statusCopy[term.status] ?? term.status}
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            {term.term} Meaning
          </h1>

          <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
            What does “{term.term.toLowerCase()}” mean, where did it come from, and how is it used?
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-ink-subtle">
            <span>/{term.pronunciation}/</span>
            <span aria-hidden>&middot;</span>
            <span className="italic">{term.partOfSpeech}</span>
            <span aria-hidden>&middot;</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3" aria-hidden />
              first seen {term.firstSeen}
            </span>
          </p>

          <div className="mt-8">
            <CopyLink slug={term.slug} />
          </div>
        </Container>
      </div>

      <Container className="grid gap-14 py-14 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          <DefinitionView definition={term.definition} eli10={term.eli10} />

          <section className="mt-14">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              Origin
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted text-pretty">
              {term.origin}
            </p>
          </section>

          <section className="mt-14">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              In use
            </h2>
            <ul className="mt-4 space-y-3">
              {term.examples.map((example) => (
                <li
                  key={example}
                  className="card flex gap-3 p-5 text-lg leading-relaxed text-ink-muted"
                >
                  <Quote className="mt-1.5 size-4 shrink-0 text-ink-subtle" aria-hidden />
                  <span className="italic">{example}</span>
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
                See also
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <TermCard key={item.slug} term={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              Usage index
            </h2>
            <p className="mt-3 font-display text-5xl leading-none tabular-nums">
              {term.popularity}
              <span className="ml-1 font-sans text-base text-ink-subtle">/100</span>
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-canvas-subtle">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-700"
                style={{ width: `${term.popularity}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
              Relative to every other entry in GenSpeak, based on how often the term appears across
              tracked sources.
            </p>

            <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-subtle">30-day change</dt>
                <dd>
                  <TrendPill value={term.trend} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-subtle">Status</dt>
                <dd className="text-ink capitalize">{term.status}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-subtle">First seen</dt>
                <dd className="font-mono tabular-nums">{term.firstSeen}</dd>
              </div>
            </dl>
          </div>

          <div className="card mt-4 p-6">
            <h2 className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              <Tag className="size-3" aria-hidden />
              Tags
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {term.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="focus-ring rounded-full"
                >
                  <Badge
                    variant="outline"
                    size="md"
                    className="transition hover:border-line-strong hover:text-ink"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </Container>
    </article>
  );
}
