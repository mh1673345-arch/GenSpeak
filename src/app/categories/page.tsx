import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CategoryIcon } from "@/components/category-icon";
import { Container } from "@/components/ui/container";
import { getCategoryStats } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Internet culture split into eight fields: slang, memes, AI, gaming, social platforms, crypto, fandom and work.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const stats = getCategoryStats();

  return (
    <Container className="py-14">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Eight fields
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">
          Categories
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
          Internet language does not come from one place. These are the eight scenes that produce
          most of it, each with its own history and its own rules.
        </p>
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {stats.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            style={{ "--cat": category.hue } as React.CSSProperties}
            className="card cat-glow focus-ring group relative overflow-hidden p-7 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="cat-tint grid size-12 place-items-center rounded-xl border">
                <CategoryIcon name={category.icon} className="size-5" />
              </div>
              <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                {category.count} entries
              </span>
            </div>

            <h2 className="mt-6 font-display text-3xl tracking-tight">{category.name}</h2>
            <p className="mt-1 text-sm text-ink-subtle">{category.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{category.description}</p>

            <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
              Most used here:{" "}
              <span className="font-display text-lg tracking-tight text-ink">
                {category.topTerm?.term}
              </span>
              <ArrowRight
                className="size-3.5 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
