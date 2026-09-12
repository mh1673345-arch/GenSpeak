import type { Metadata } from "next";
import Link from "next/link";

import { TermRow } from "@/components/term-card";
import { Container } from "@/components/ui/container";
import { eras } from "@/content/eras";
import { getStats, getTermsByYearRange, getYearHistogram } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "History of internet language",
  description:
    "Fifty years of internet culture in eight eras, from Usenet and dial-up boards to the model era, with the vocabulary each period produced.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  const stats = getStats();
  const histogram = getYearHistogram();
  const peak = Math.max(...histogram.map((point) => point.count));

  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          {stats.oldest} to {stats.newest}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
          A history of how the internet learned to talk
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted text-pretty">
          Internet language did not begin with TikTok. Most of its conventions were settled on
          mailing lists and bulletin boards decades earlier, and every platform since has
          rediscovered them. These are the eight periods that produced the {stats.terms} entries in
          this dictionary.
        </p>
      </header>

      <section className="mt-16" aria-labelledby="coinage-heading">
        <h2
          id="coinage-heading"
          className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase"
        >
          Coinages per year
        </h2>
        <div className="card mt-4 overflow-x-auto p-6">
          <div className="flex min-w-[38rem] items-end gap-[3px]" style={{ height: 140 }}>
            {histogram.map((point) => (
              <div
                key={point.year}
                className="group relative flex-1 rounded-t-sm bg-accent/25 transition hover:bg-accent"
                style={{ height: `${Math.max((point.count / peak) * 100, 3)}%` }}
                title={`${point.year}: ${point.count} ${point.count === 1 ? "entry" : "entries"}`}
              >
                <span className="sr-only">
                  {point.year}: {point.count} entries
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex min-w-[38rem] justify-between font-mono text-[10px] text-ink-subtle tabular-nums">
            <span>{histogram[0]?.year}</span>
            <span>{histogram[Math.floor(histogram.length / 2)]?.year}</span>
            <span>{histogram[histogram.length - 1]?.year}</span>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-ink-subtle">
          Weighted toward recent years, as any living dictionary is. The long tail on the left is
          not evidence that less was coined then, only that less of it survived into current use.
        </p>
      </section>

      <div className="mt-20 space-y-20">
        {eras.map((era, index) => {
          const coined = getTermsByYearRange(era.from, era.to).slice(0, 6);

          return (
            <section
              key={era.slug}
              id={era.slug}
              style={{ "--cat": era.hue } as React.CSSProperties}
              className="scroll-mt-24"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="font-mono text-xs text-ink-subtle tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-4xl tracking-tight sm:text-5xl">{era.name}</h2>
                <span className="cat-tint rounded-full border px-3 py-1 font-mono text-[11px] tabular-nums">
                  {era.from}&ndash;{era.to}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-subtle">{era.tagline}</p>

              <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <p className="leading-relaxed text-ink-muted text-pretty">{era.summary}</p>
                  <h3 className="mt-8 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
                    What it left behind
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-muted text-pretty">{era.legacy}</p>
                </div>

                <div className="cat-glow card p-6">
                  <h3 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
                    Timeline
                  </h3>
                  <ol className="mt-4 space-y-4">
                    {era.moments.map((moment) => (
                      <li key={moment.year + moment.text} className="flex gap-4">
                        <span className="shrink-0 font-mono text-xs text-accent tabular-nums">
                          {moment.year}
                        </span>
                        <span className="text-sm leading-relaxed text-ink-muted">
                          {moment.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {coined.length > 0 ? (
                <div className="mt-10">
                  <h3 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
                    Coined in this period
                  </h3>
                  <div className="mt-3">
                    {coined.map((term) => (
                      <TermRow key={term.slug} term={term} />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <p className="mt-20 text-sm text-ink-subtle">
        The communities behind these periods are covered in more depth under{" "}
        <Link href="/culture" className="text-accent underline underline-offset-4">
          culture
        </Link>
        .
      </p>
    </Container>
  );
}
