import { ChevronRight, Tag as TagIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TermCard } from "@/components/term-card";
import { Container } from "@/components/ui/container";
import { getTagCounts, getTermsByTag } from "@/lib/dictionary";

export function generateStaticParams() {
  return getTagCounts()
    .filter((entry) => entry.count >= 2)
    .map((entry) => ({ tag: entry.tag }));
}

export async function generateMetadata(props: PageProps<"/tag/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `Entries tagged ${decoded}`,
    description: `Every GenSpeak entry tagged ${decoded}, across all categories.`,
    alternates: { canonical: `/tag/${tag}` },
  };
}

export default async function TagPage(props: PageProps<"/tag/[tag]">) {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);
  const terms = getTermsByTag(decoded);
  if (terms.length === 0) notFound();

  const related = getTagCounts()
    .filter((entry) => entry.tag !== decoded && entry.count >= 3)
    .slice(0, 18);

  return (
    <Container className="py-14">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-ink-subtle">
        <Link href="/dictionary" className="transition hover:text-ink-muted">
          Dictionary
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <span className="text-ink-muted">Tagged</span>
      </nav>

      <h1 className="flex flex-wrap items-center gap-3 font-display text-5xl tracking-tight sm:text-6xl">
        <TagIcon className="size-8 text-ink-subtle" aria-hidden />
        {decoded}
      </h1>
      <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
        {terms.length} {terms.length === 1 ? "entry" : "entries"} across the dictionary
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {terms.map((term) => (
          <TermCard key={term.slug} term={term} />
        ))}
      </div>

      <section className="mt-16 border-t border-line pt-8">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Other tags
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((entry) => (
            <Link
              key={entry.tag}
              href={`/tag/${encodeURIComponent(entry.tag)}`}
              className="focus-ring rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition hover:border-line-strong hover:text-ink"
            >
              {entry.tag}
              <span className="ml-1.5 font-mono text-ink-subtle tabular-nums">{entry.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
