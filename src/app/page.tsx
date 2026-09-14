import { ArrowRight, BookOpen, Flame, Shuffle, Sparkles } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/category-icon";
import { HeroSearch } from "@/components/hero-search";
import { TermCard, TermRow } from "@/components/term-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/container";
import { TrendPill } from "@/components/ui/trend";
import { eras } from "@/content/eras";
import { scenes } from "@/content/scenes";
import {
  getCategoryBySlug,
  getCategoryStats,
  getNewest,
  getStats,
  getTrending,
  getWordOfTheDay,
} from "@/lib/dictionary";

export default function HomePage() {
  const wotd = getWordOfTheDay();
  const wotdCategory = getCategoryBySlug(wotd.category);
  const trending = getTrending(6);
  const newest = getNewest(5);
  const categoryStats = getCategoryStats();
  const stats = getStats();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="rule-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative py-20 sm:py-28">
          <div className="animate-in-up flex flex-col items-start">
            <Badge variant="soft" size="md" className="mb-6">
              <Sparkles className="size-3" aria-hidden />
              <span>{stats.terms} entries &middot; updated continuously</span>
            </Badge>

            <h1 className="max-w-4xl font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl">
              The dictionary for
              <span className="text-accent italic"> how the internet talks</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
              Slang, meme formats, AI vocabulary and platform language, defined properly. Every
              entry carries its origin, a plain-language version, and how people actually use it.
            </p>

            <div className="mt-10 w-full">
              <HeroSearch suggestions={["rizz", "brainrot", "vibe coding", "enshittification", "sealioning"]} />
            </div>

            <dl className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
              {[
                { label: "Entries", value: stats.terms },
                { label: "Categories", value: stats.categories },
                { label: "Tags", value: stats.tags },
                { label: "Earliest", value: stats.oldest },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-display text-3xl tabular-nums">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading eyebrow="Word of the day" title="Today's entry" />
        <article
          style={{ "--cat": wotdCategory?.hue } as React.CSSProperties}
          className="card cat-glow relative mt-8 overflow-hidden p-8 sm:p-12"
        >
          <div className="grain absolute inset-0 text-ink" aria-hidden />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="category" size="md">
                <CategoryIcon name={wotdCategory?.icon ?? "Sparkles"} className="size-3" />
                {wotdCategory?.name}
              </Badge>
              <TrendPill value={wotd.trend} />
            </div>

            <h3 className="mt-6 font-display text-6xl leading-none tracking-tight sm:text-7xl">
              {wotd.term}
            </h3>
            <p className="mt-3 font-mono text-sm text-ink-subtle">
              /{wotd.pronunciation}/ &middot; {wotd.partOfSpeech} &middot; est. {wotd.firstSeen}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
              {wotd.definition}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/meaning/${wotd.slug}`} variant="primary">
                Read the full entry
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/random" variant="outline">
                <Shuffle className="size-4" aria-hidden />
                Random entry
              </ButtonLink>
            </div>
          </div>
        </article>
      </Container>

      <Container className="py-16">
        <SectionHeading
          eyebrow="Movers"
          title="Trending this month"
          action={
            <Link
              href="/trending"
              className="focus-ring group flex items-center gap-1.5 rounded-full text-sm text-ink-muted transition hover:text-ink"
            >
              <Flame className="size-4" aria-hidden />
              See the full board
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          }
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((term, i) => (
            <TermCard key={term.slug} term={term} rank={i + 1} />
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <SectionHeading eyebrow="Go deeper" title="Not just definitions" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/history"
            style={{ "--cat": 190 } as React.CSSProperties}
            className="card cat-glow focus-ring group relative overflow-hidden p-7 hover:-translate-y-0.5"
          >
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              {stats.oldest}&ndash;{stats.newest}
            </p>
            <h3 className="mt-4 font-display text-3xl tracking-tight">History</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {eras.length} eras of internet language, from dial-up boards to the model era, with
              what each period actually contributed.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-accent">
              {eras.length} eras
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
            </p>
          </Link>

          <Link
            href="/culture"
            style={{ "--cat": 330 } as React.CSSProperties}
            className="card cat-glow focus-ring group relative overflow-hidden p-7 hover:-translate-y-0.5"
          >
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              Origins
            </p>
            <h3 className="mt-4 font-display text-3xl tracking-tight">Cultures</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              The scenes that did the inventing: Usenet, imageboards, Black Twitter, ballroom,
              Tumblr, Twitch, fandom, crypto and the AI labs.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-accent">
              {scenes.length} scenes
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
            </p>
          </Link>

          <Link
            href="/quiz"
            style={{ "--cat": 45 } as React.CSSProperties}
            className="card cat-glow focus-ring group relative overflow-hidden p-7 hover:-translate-y-0.5"
          >
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
              Daily round
            </p>
            <h3 className="mt-4 font-display text-3xl tracking-tight">How online are you?</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Ten definitions, four choices each, wrong answers drawn from the same category so
              subject matter will not save you.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-accent">
              Play the daily round
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
            </p>
          </Link>
        </div>
      </Container>

      <Container className="py-16">
        <SectionHeading eyebrow="Browse" title="Sixteen fields" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryStats.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              style={{ "--cat": category.hue } as React.CSSProperties}
              className="card cat-glow focus-ring group relative overflow-hidden p-6 hover:-translate-y-0.5"
            >
              <div className="cat-tint mb-5 grid size-11 place-items-center rounded-xl border">
                <CategoryIcon name={category.icon} className="size-5" />
              </div>
              <h3 className="font-display text-2xl tracking-tight">{category.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                {category.tagline}
              </p>
              <p className="mt-5 font-mono text-[11px] text-ink-subtle tabular-nums">
                {category.count} entries
              </p>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading eyebrow="New coinages" title="Newest to the language" />
            <div className="mt-6">
              {newest.map((term) => (
                <TermRow key={term.slug} term={term} />
              ))}
            </div>
          </div>

          <aside className="card flex flex-col justify-between gap-6 p-8">
            <div>
              <BookOpen className="size-6 text-accent" aria-hidden />
              <h3 className="mt-5 font-display text-3xl leading-tight tracking-tight">
                Heard something we have missed?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                New words appear faster than any dictionary can move. Send one over with a source
                and it goes into the review queue.
              </p>
            </div>
            <ButtonLink href="/submit" variant="accent" className="w-full">
              Submit a term
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </aside>
        </div>
      </Container>
    </>
  );
}
