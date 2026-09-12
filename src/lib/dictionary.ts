import { categories, categoryMap, type Category, type CategorySlug } from "@/content/categories";
import { terms } from "@/content/terms";
import type { Term } from "@/content/types";
import { normalize, seededIndex } from "@/lib/utils";

export type { Term, Category, CategorySlug };
export { categories };

/**
 * Search keys are held beside each term rather than merged into it, so the
 * objects handed to client components stay exactly the shape of Term and
 * nothing extra crosses the server/client boundary.
 */
type IndexEntry = { term: Term; normTerm: string; haystack: string };

const index: IndexEntry[] = terms.map((term) => ({
  term,
  normTerm: normalize(term.term),
  haystack: normalize(
    [term.term, term.slug, term.definition, term.eli10, term.origin, ...term.tags].join(" "),
  ),
}));

const bySlug = new Map(terms.map((term) => [term.slug, term]));

export function getAllTerms(): Term[] {
  return terms;
}

export function getTerm(slug: string): Term | undefined {
  return bySlug.get(slug);
}

export function getTermsByCategory(category: CategorySlug): Term[] {
  return terms.filter((term) => term.category === category);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryMap.get(slug as CategorySlug);
}

/**
 * Declared relations first, then same-category entries with the most tag
 * overlap. At this corpus size hand-maintaining four good links per entry is
 * not realistic, and every entry still deserves a useful "see also".
 */
export function getRelatedTerms(term: Term, limit = 4): Term[] {
  const picked: Term[] = [];
  const seen = new Set([term.slug]);

  for (const slug of term.related) {
    const found = bySlug.get(slug);
    if (found && !seen.has(found.slug)) {
      picked.push(found);
      seen.add(found.slug);
    }
  }

  if (picked.length < limit) {
    const tags = new Set(term.tags);
    const scored = terms
      .filter((candidate) => !seen.has(candidate.slug) && candidate.category === term.category)
      .map((candidate) => ({
        candidate,
        overlap: candidate.tags.filter((tag) => tags.has(tag)).length,
      }))
      .filter((entry) => entry.overlap > 0)
      .sort(
        (a, b) => b.overlap - a.overlap || b.candidate.popularity - a.candidate.popularity,
      );

    for (const { candidate } of scored) {
      if (picked.length >= limit) break;
      picked.push(candidate);
      seen.add(candidate.slug);
    }
  }

  return picked.slice(0, limit);
}

/**
 * True when needle starts a word inside haystack. Both strings are already
 * normalised to letters, digits, spaces and hyphens, so no regex is required.
 */
function startsWord(haystack: string, needle: string) {
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    const before = i === 0 ? " " : haystack[i - 1];
    if (before === " " || before === "-") return true;
    i = haystack.indexOf(needle, i + 1);
  }
  return false;
}

/**
 * Single-edit tolerance for short queries, so "brianrot" still finds brainrot.
 * Deliberately cheap: it bails as soon as a second difference appears.
 */
function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (a.length < b.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export type SearchResult = { term: Term; score: number };

/**
 * Ranked search. Exact and prefix matches on the headword always outrank text
 * buried in a definition, so typing "rag" surfaces RAG rather than every entry
 * that happens to contain the word elsewhere.
 */
export function searchTerms(query: string, limit = 20): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const entry of index) {
    let score = 0;

    if (entry.normTerm === q) score = 1000;
    else if (entry.normTerm.startsWith(q)) score = 700;
    else if (startsWord(entry.normTerm, q)) score = 500;
    else if (entry.term.tags.some((tag) => normalize(tag).startsWith(q))) score = 300;
    else if (entry.haystack.includes(q)) score = 150;
    else if (q.length >= 4 && withinOneEdit(q, entry.normTerm)) score = 120;

    if (score === 0) continue;

    // Popularity only breaks ties; it never outranks a better textual match.
    score += entry.term.popularity / 10;
    results.push({ term: entry.term, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export type SortKey = "az" | "trending" | "popular" | "newest" | "oldest";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "az", label: "A to Z" },
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Most used" },
  { value: "newest", label: "Newest coinage" },
  { value: "oldest", label: "Oldest coinage" },
];

export function sortTerms(list: Term[], key: SortKey): Term[] {
  const sorted = [...list];
  switch (key) {
    case "trending":
      return sorted.sort((a, b) => b.trend - a.trend);
    case "popular":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "newest":
      return sorted.sort((a, b) => b.firstSeen - a.firstSeen || b.popularity - a.popularity);
    case "oldest":
      return sorted.sort((a, b) => a.firstSeen - b.firstSeen || b.popularity - a.popularity);
    case "az":
    default:
      return sorted.sort((a, b) => a.term.localeCompare(b.term));
  }
}

export function getTrending(limit = 8): Term[] {
  return sortTerms(terms, "trending").slice(0, limit);
}

export function getNewest(limit = 8): Term[] {
  return sortTerms(terms, "newest").slice(0, limit);
}

/** Deterministic per-day pick, so server and client always agree. */
export function getWordOfTheDay(date = new Date()): Term {
  const key = date.toISOString().slice(0, 10);
  return terms[seededIndex(key, terms.length)];
}

export function letterOf(term: Term): string {
  const first = term.term[0].toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
}

/** Every tag in the corpus, most used first. */
export function getTagCounts(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const term of terms) {
    for (const tag of term.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getTermsByTag(tag: string): Term[] {
  return sortTerms(
    terms.filter((term) => term.tags.includes(tag)),
    "popular",
  );
}

export function getStats() {
  const years = terms.map((term) => term.firstSeen);
  return {
    terms: terms.length,
    categories: categories.length,
    rising: terms.filter((term) => term.status === "rising").length,
    tags: getTagCounts().length,
    oldest: Math.min(...years),
    newest: Math.max(...years),
  };
}

export function getCategoryStats() {
  return categories.map((category) => {
    const list = getTermsByCategory(category.slug);
    return {
      ...category,
      count: list.length,
      topTerm: sortTerms(list, "popular")[0],
    };
  });
}

/** Terms coined in a given inclusive year range, used by the history pages. */
export function getTermsByYearRange(from: number, to: number): Term[] {
  return sortTerms(
    terms.filter((term) => term.firstSeen >= from && term.firstSeen <= to),
    "popular",
  );
}

/** Coinages per year, for the history timeline chart. */
export function getYearHistogram(): { year: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const term of terms) counts.set(term.firstSeen, (counts.get(term.firstSeen) ?? 0) + 1);
  return [...counts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}
