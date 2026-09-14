"use client";

import { Search } from "lucide-react";
import Link from "next/link";

import { useSearch } from "@/components/search-provider";

export type SuggestionItem = string | { label: string; slug: string };

export function HeroSearch({ suggestions }: { suggestions: SuggestionItem[] }) {
  const { openSearch } = useSearch();

  const normalized = suggestions.map((item) => {
    if (typeof item === "string") {
      return {
        label: item,
        slug: item.toLowerCase().trim().replace(/\s+/g, "-"),
      };
    }
    return item;
  });

  return (
    <div className="w-full max-w-2xl">
      <button
        type="button"
        onClick={openSearch}
        className="focus-ring group flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-left shadow-sm transition hover:border-line-strong hover:shadow-md"
      >
        <Search className="size-5 shrink-0 text-ink-subtle" aria-hidden />
        <span className="flex-1 text-base text-ink-subtle">
          Search a word, a phrase, an acronym...
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-line px-2 py-1 font-mono text-[10px] text-ink-subtle sm:block">
          CTRL K
        </kbd>
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] tracking-widest text-ink-subtle uppercase">
          Try
        </span>
        {normalized.map((item) => (
          <Link
            key={item.slug}
            href={`/meaning/${item.slug}`}
            className="focus-ring rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted transition hover:border-line-strong hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
