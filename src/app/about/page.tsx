import { BookOpen, GraduationCap, Layers, Users } from "lucide-react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getStats } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "About",
  description:
    "How GenSpeak defines internet language: descriptive, sourced, and written to be useful to people who were not there when the word appeared.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: BookOpen,
    title: "Descriptive, not prescriptive",
    body: "We record how words are actually used, including uses that annoy people. A dictionary that only lists approved meanings is a style guide wearing a disguise.",
  },
  {
    icon: GraduationCap,
    title: "Two registers, one entry",
    body: "Every term carries a precise definition and a plain-language version. The second one is not a simplification of the first; it is the same meaning written for someone encountering the word cold.",
  },
  {
    icon: Layers,
    title: "Origin matters",
    body: "Most internet words are older than the platform that made them famous. We trace each one back to the community that coined it, because that context usually explains the meaning.",
  },
  {
    icon: Users,
    title: "Communities own their language",
    body: "Terms that started inside specific communities are labelled as such. Where a word has been flattened or misused in wider circulation, the entry says so.",
  },
];

export default function AboutPage() {
  const stats = getStats();

  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          What this is
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
          A reference for language that moves faster than reference books
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted text-pretty">
          GenSpeak documents internet culture the way a dictionary documents anything else: with an
          origin, a definition, a register, and evidence of use. There are {stats.terms} entries
          spanning {stats.oldest} to {stats.newest}, and the oldest ones are usually the most
          misunderstood.
        </p>
      </header>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {principles.map((item) => (
          <section key={item.title} className="card p-7">
            <item.icon className="size-5 text-accent" aria-hidden />
            <h2 className="mt-5 font-display text-2xl tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight">How entries are scored</h2>
        <dl className="mt-6 space-y-5 text-sm leading-relaxed">
          <div>
            <dt className="font-medium">Usage index</dt>
            <dd className="mt-1 text-ink-muted">
              A relative 0 to 100 figure comparing how often a term appears across the sources we
              track. It is a ranking device, not a measurement of real-world frequency.
            </dd>
          </div>
          <div>
            <dt className="font-medium">30-day change</dt>
            <dd className="mt-1 text-ink-muted">
              Movement in that index over the trailing month. Anything within three points either
              way is treated as flat.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Status</dt>
            <dd className="mt-1 text-ink-muted">
              An editorial judgement: rising, mainstream, classic, niche or fading. Fading does not
              mean dead. Most internet words settle into a smaller community rather than vanishing.
            </dd>
          </div>
        </dl>
      </section>

      <section className="card mt-16 flex flex-col items-start gap-6 p-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Something missing?</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            The gaps are the point. If a word you use is not here, send it over with where you
            heard it.
          </p>
        </div>
        <ButtonLink href="/submit" variant="accent" size="lg" className="shrink-0">
          Submit a term
        </ButtonLink>
      </section>
    </Container>
  );
}
