import type { Metadata } from "next";

import { DictionaryBrowser } from "@/components/dictionary-browser";
import { Container } from "@/components/ui/container";
import { categories } from "@/content/categories";
import { getAllTerms, getStats } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Dictionary",
  description:
    "Browse every GenSpeak entry. Filter by category, sort by usage or recency, and jump straight to a letter.",
  alternates: { canonical: "/dictionary" },
};

export default function DictionaryPage() {
  const terms = getAllTerms();
  const stats = getStats();

  return (
    <Container className="py-14">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          The full index
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">
          Dictionary
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
          Every entry in GenSpeak, {stats.terms} in total, spanning {stats.oldest} to{" "}
          {stats.newest}. Filter it down, or press <kbd className="font-mono text-sm">/</kbd> to
          search from anywhere.
        </p>
      </header>

      <div className="mt-10">
        <DictionaryBrowser terms={terms} categories={categories} />
      </div>
    </Container>
  );
}
