import type { CategorySlug } from "./categories";

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "interjection"
  | "abbreviation"
  | "suffix"
  | "prefix";

export type TermStatus = "rising" | "mainstream" | "classic" | "niche" | "fading";

/**
 * The shape every page and component reads.
 */
export type Term = {
  slug: string;
  term: string;
  /** Simple respelling, e.g. "riz" */
  pronunciation: string;
  partOfSpeech: PartOfSpeech;
  category: CategorySlug;
  /** Dictionary-grade definition. */
  definition: string;
  /** Plain-language rewrite for the "Explain like I am 10" view. */
  eli10: string;
  /** Where the word came from and how it spread. */
  origin: string;
  /** Year the term entered wide circulation. */
  firstSeen: number;
  examples: string[];
  /** Slugs of related terms. */
  related: string[];
  tags: string[];
  /** 0-100 relative usage index. */
  popularity: number;
  /** Percentage change in usage over the trailing 30 days. */
  trend: number;
  status: TermStatus;
};

/**
 * The shape entries are authored in. Keys are abbreviated purely so that a
 * corpus of this size stays legible and diffable as a table of data rather
 * than thousands of screens of nested prose. Expanded to Term at load.
 *
 *   pron  pronunciation      def   definition        ex    examples
 *   pos   part of speech     eli   explain-like-10   rel   related slugs
 *   cat   category           org   origin            pop   popularity 0-100
 *   year  first seen         trend 30-day change %
 */
export type RawTerm = {
  slug: string;
  term: string;
  pron: string;
  pos: PartOfSpeech;
  cat: CategorySlug;
  year: number;
  pop: number;
  trend: number;
  status: TermStatus;
  def: string;
  eli: string;
  org: string;
  ex: string[];
  rel?: string[];
  tags: string[];
};

export function expandTerm(raw: RawTerm): Term {
  return {
    slug: raw.slug,
    term: raw.term,
    pronunciation: raw.pron,
    partOfSpeech: raw.pos,
    category: raw.cat,
    definition: raw.def,
    eli10: raw.eli,
    origin: raw.org,
    firstSeen: raw.year,
    examples: raw.ex,
    related: raw.rel ?? [],
    tags: raw.tags,
    popularity: raw.pop,
    trend: raw.trend,
    status: raw.status,
  };
}
