import type { NextRequest } from "next/server";

import { getTrending, searchTerms, type Term } from "@/lib/dictionary";

export type SearchHit = Pick<
  Term,
  "slug" | "term" | "pronunciation" | "partOfSpeech" | "category" | "definition" | "trend"
>;

function toHit(term: Term): SearchHit {
  return {
    slug: term.slug,
    term: term.term,
    pronunciation: term.pronunciation,
    partOfSpeech: term.partOfSpeech,
    category: term.category,
    definition: term.definition,
    trend: term.trend,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 8, 25);

  // An empty query returns the trending board, which is what the palette shows
  // before the user types anything.
  const results = query
    ? searchTerms(query, limit).map((hit) => toHit(hit.term))
    : getTrending(limit).map(toHit);

  return Response.json(
    { query, count: results.length, results },
    { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
