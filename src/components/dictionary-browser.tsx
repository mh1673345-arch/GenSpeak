"use client";

import { ArrowUpDown, Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { TermRow } from "@/components/term-card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/content/categories";
import type { Term } from "@/content/terms";
import { sortOptions, type SortKey } from "@/lib/dictionary";
import { cn, normalize } from "@/lib/utils";

const PAGE_SIZE = 60;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = {
  terms: Term[];
  categories: Category[];
};

export function DictionaryBrowser({ terms, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [letter, setLetter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("az");
  const [pager, setPager] = useState({ signature: "", limit: PAGE_SIZE });

  // Keeps typing responsive while the (cheap) filter runs on a deferred value.
  const deferredQuery = useDeferredValue(query);

  const searchable = useMemo(
    () =>
      terms.map((term) => ({
        term,
        haystack: normalize([term.term, term.definition, ...term.tags].join(" ")),
      })),
    [terms],
  );

  const results = useMemo(() => {
    const q = normalize(deferredQuery);

    const filtered = searchable
      .filter(({ term, haystack }) => {
        if (category !== "all" && term.category !== category) return false;
        if (letter && term.term[0].toUpperCase() !== letter) return false;
        if (q && !haystack.includes(q)) return false;
        return true;
      })
      .map(({ term }) => term);

    const sorted = [...filtered];
    if (sort === "trending") sorted.sort((a, b) => b.trend - a.trend);
    else if (sort === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    else if (sort === "newest") sorted.sort((a, b) => b.firstSeen - a.firstSeen);
    else sorted.sort((a, b) => a.term.localeCompare(b.term));

    return sorted;
  }, [searchable, deferredQuery, category, letter, sort]);

  // Reset paging whenever the filters change, without an effect: the signature
  // is compared during render, which is the pattern React recommends.
  const signature = [deferredQuery, category, letter, sort].join("|");
  const limit = pager.signature === signature ? pager.limit : PAGE_SIZE;
  const visible = results.slice(0, limit);

  const activeLetters = useMemo(
    () => new Set(terms.map((term) => term.term[0].toUpperCase())),
    [terms],
  );

  const hasFilters = query !== "" || category !== "all" || letter !== null;

  function reset() {
    setQuery("");
    setCategory("all");
    setLetter(null);
  }

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-canvas/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter entries by word, meaning or tag"
              aria-label="Filter entries"
              className="focus-ring h-11 w-full rounded-full border border-line bg-surface pr-10 pl-11 text-sm outline-none transition placeholder:text-ink-subtle focus:border-line-strong"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear filter"
                className="focus-ring absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-subtle hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <label className="relative flex h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-surface pr-3 pl-4 text-sm">
            <ArrowUpDown className="size-3.5 text-ink-subtle" aria-hidden />
            <span className="sr-only">Sort entries</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="cursor-pointer appearance-none bg-transparent pr-1 text-ink outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </FilterChip>
          {categories.map((item) => (
            <FilterChip
              key={item.slug}
              active={category === item.slug}
              hue={item.hue}
              onClick={() => setCategory(category === item.slug ? "all" : item.slug)}
            >
              {item.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-1">
        {LETTERS.map((char) => {
          const available = activeLetters.has(char);
          return (
            <button
              key={char}
              type="button"
              disabled={!available}
              onClick={() => setLetter(letter === char ? null : char)}
              className={cn(
                "focus-ring size-8 rounded-lg font-mono text-xs transition",
                letter === char && "bg-ink text-canvas",
                letter !== char && available && "text-ink-muted hover:bg-canvas-subtle",
                !available && "text-ink-subtle/40",
              )}
            >
              {char}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-b border-line pb-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          {results.length} {results.length === 1 ? "entry" : "entries"}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={reset}
            className="focus-ring rounded-full text-xs text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl tracking-tight">Nothing matches yet</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
            Try a shorter word, drop the category filter, or submit the term so it joins the
            dictionary.
          </p>
          <button
            type="button"
            onClick={reset}
            className="focus-ring mt-6 rounded-full border border-line px-4 py-2 text-sm transition hover:border-line-strong"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div>
          {visible.map((term) => (
            <TermRow key={term.slug} term={term} />
          ))}

          {results.length > visible.length ? (
            <div className="flex flex-col items-center gap-3 pt-10">
              <p className="font-mono text-[11px] text-ink-subtle tabular-nums">
                showing {visible.length} of {results.length}
              </p>
              <button
                type="button"
                onClick={() => setPager({ signature, limit: limit + PAGE_SIZE })}
                className="focus-ring rounded-full border border-line px-5 py-2.5 text-sm transition hover:border-line-strong hover:bg-canvas-subtle"
              >
                Show {Math.min(PAGE_SIZE, results.length - visible.length)} more
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  hue,
  onClick,
  children,
}: {
  active: boolean;
  hue?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} style={{ "--cat": hue } as React.CSSProperties}>
      <Badge
        variant={active ? "accent" : hue === undefined ? "neutral" : "category"}
        size="md"
        className={cn(
          "cursor-pointer transition",
          !active && "opacity-70 hover:opacity-100",
        )}
      >
        {children}
      </Badge>
    </button>
  );
}
