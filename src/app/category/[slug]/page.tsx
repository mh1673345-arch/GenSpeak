import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryIcon } from "@/components/category-icon";
import { TermCard } from "@/components/term-card";
import { Container } from "@/components/ui/container";
import { categories } from "@/content/categories";
import { getCategoryBySlug, getTermsByCategory, sortTerms } from "@/lib/dictionary";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const terms = sortTerms(getTermsByCategory(category.slug), "popular");

  return (
    <div style={{ "--cat": category.hue } as React.CSSProperties}>
      <div className="cat-glow border-b border-line">
        <Container className="py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1.5 text-xs text-ink-subtle"
          >
            <Link href="/categories" className="transition hover:text-ink-muted">
              Categories
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-ink-muted">{category.name}</span>
          </nav>

          <div className="cat-tint grid size-14 place-items-center rounded-2xl border">
            <CategoryIcon name={category.icon} className="size-6" />
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            {category.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
            {category.description}
          </p>
          <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
            {terms.length} entries
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      </Container>
    </div>
  );
}
