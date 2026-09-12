import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryIcon } from "@/components/category-icon";
import { TermCard } from "@/components/term-card";
import { Container } from "@/components/ui/container";
import { getScene, scenes } from "@/content/scenes";
import { getTerm } from "@/lib/dictionary";

export function generateStaticParams() {
  return scenes.map((scene) => ({ slug: scene.slug }));
}

export async function generateMetadata(props: PageProps<"/culture/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const scene = getScene(slug);
  if (!scene) return { title: "Culture not found" };

  return {
    title: scene.name,
    description: scene.summary.slice(0, 180),
    alternates: { canonical: `/culture/${scene.slug}` },
  };
}

export default async function ScenePage(props: PageProps<"/culture/[slug]">) {
  const { slug } = await props.params;
  const scene = getScene(slug);
  if (!scene) notFound();

  const terms = scene.terms.map((termSlug) => getTerm(termSlug)).filter((t) => t !== undefined);

  return (
    <div style={{ "--cat": scene.hue } as React.CSSProperties}>
      <div className="cat-glow border-b border-line">
        <Container className="py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1.5 text-xs text-ink-subtle"
          >
            <Link href="/culture" className="transition hover:text-ink-muted">
              Cultures
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-ink-muted">{scene.name}</span>
          </nav>

          <div className="cat-tint grid size-14 place-items-center rounded-2xl border">
            <CategoryIcon name={scene.icon} className="size-6" />
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            {scene.name}
          </h1>
          <p className="mt-4 text-lg text-ink-subtle">{scene.tagline}</p>
          <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
            {scene.years}
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              Background
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
              {scene.summary}
            </p>
          </div>
          <div className="card p-7">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              What it gave the language
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted text-pretty">
              {scene.contribution}
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl tracking-tight">
            {terms.length} entries from this scene
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <TermCard key={term.slug} term={term} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
