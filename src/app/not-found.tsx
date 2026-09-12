import Link from "next/link";

import { TermCard } from "@/components/term-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getTrending } from "@/lib/dictionary";

export default function NotFound() {
  const suggestions = getTrending(3);

  return (
    <Container className="py-24">
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
        Error 404
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
        No entry for that one
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
        Either the word has not been documented yet, or the link is wrong. Both happen.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/dictionary">Browse the dictionary</ButtonLink>
        <ButtonLink href="/submit" variant="outline">
          Submit a term
        </ButtonLink>
      </div>

      <section className="mt-20">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          While you are here
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {suggestions.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      </section>

      <p className="mt-16 text-sm text-ink-subtle">
        Or go back to the{" "}
        <Link href="/" className="text-accent underline underline-offset-4">
          home page
        </Link>
        .
      </p>
    </Container>
  );
}
