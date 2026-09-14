import { Flame, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { TermRow } from "@/components/term-card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { TrendPill } from "@/components/ui/trend";
import { getAllTerms, sortTerms } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Trending",
  description:
    "The internet words gaining and losing ground right now, ranked by 30-day change in usage.",
  alternates: { canonical: "/trending" },
};

export default function TrendingPage() {
  const all = sortTerms(getAllTerms(), "trending");
  const climbing = all.filter((term) => term.trend > 2).slice(0, 12);
  const cooling = [...all].reverse().filter((term) => term.trend < -2).slice(0, 6);
  const leader = climbing[0];

  return (
    <Container className="py-14">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Movement
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">
          Trending
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
          Language moves in both directions. These are the entries gaining ground fastest, and the
          ones quietly on their way out.
        </p>
      </header>

      {leader ? (
        <section className="card mt-12 flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <Badge variant="hot" size="md">
              <Flame className="size-3" aria-hidden />
              Fastest riser
            </Badge>
            <h2 className="mt-5 font-display text-5xl leading-none tracking-tight">
              {leader.term}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
              {leader.definition}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="font-display text-6xl leading-none text-cool tabular-nums">
              +{leader.trend}%
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-widest text-ink-subtle uppercase">
              30-day change
            </p>
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          <TrendingUp className="size-3" aria-hidden />
          Climbing
        </h2>
        <div className="mt-4">
          {climbing.map((term, i) => (
            <TermRow key={term.slug} term={term} rank={i + 1} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Cooling off
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Still widely understood, but used less than they were. Most words settle here rather than
          disappearing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cooling.map((term) => (
            <Link
              key={term.slug}
              href={`/meaning/${term.slug}`}
              className="focus-ring card flex items-center gap-3 px-4 py-2.5"
            >
              <span className="font-display text-lg tracking-tight">{term.term}</span>
              <TrendPill value={term.trend} />
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
