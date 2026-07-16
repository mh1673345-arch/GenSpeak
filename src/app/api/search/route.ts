import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// Typings for optimized database selects
interface SelectWord {
  id: string;
  title: string;
  shortMeaning: string;
  slug: string;
  emoji: string | null;
}

interface SelectGuide {
  id: string;
  title: string;
  description: string;
  slug: string;
}

interface SelectCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  icon: string | null;
}

interface SelectCollection {
  id: string;
  title: string;
  description: string;
  slug: string;
}

interface SearchItem {
  id: string;
  type: "word" | "guide" | "category" | "collection";
  title: string;
  subtitle: string;
  slug: string;
  emoji: string;
}

// Global query cache to optimize hot search paths and prevent DB spams
const searchCache = new Map<string, SearchItem[]>();

// Helper function to calculate Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp.push([i]);
  }
  for (j = 1; j <= b.length; j++) {
    tmp[0].push(j);
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  if (!query) {
    return NextResponse.json([]);
  }

  // 0. Cache hit checking
  const cachedResult = searchCache.get(query);
  if (cachedResult) {
    return NextResponse.json(cachedResult);
  }

  // 1. Fetch search pools from database (optimizing DB query loads using SELECT field projections)
  const [dbWords, dbGuides, dbCategories, dbCollections] = await Promise.all([
    db.word.findMany({
      select: {
        id: true,
        title: true,
        shortMeaning: true,
        slug: true,
        emoji: true
      }
    }) as Promise<SelectWord[]>,
    db.guide.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true
      }
    }) as Promise<SelectGuide[]>,
    db.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        icon: true
      }
    }) as Promise<SelectCategory[]>,
    db.collection.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        slug: true
      }
    }) as Promise<SelectCollection[]>
  ]);

  // 2. Map and filter words with similarity ranking (typo tolerance)
  const mappedWords = dbWords.map((word) => {
    const titleLower = word.title.toLowerCase();
    const isExact = titleLower === query;
    const isPrefix = titleLower.startsWith(query);
    const isSubstring = titleLower.includes(query);
    
    // Levenshtein distance check for typo tolerance
    const distance = levenshteinDistance(titleLower, query);
    const maxLen = Math.max(titleLower.length, query.length);
    const similarity = 1 - distance / maxLen;

    let score = 0;
    if (isExact) score = 100;
    else if (isPrefix) score = 80;
    else if (isSubstring) score = 60;
    else if (similarity > 0.5) score = 40 + Math.floor(similarity * 20); // Typo match

    return {
      item: {
        id: word.id,
        type: "word" as const,
        title: word.title,
        subtitle: word.shortMeaning,
        slug: word.slug,
        emoji: word.emoji || "💬"
      },
      score
    };
  });

  // Filter word matches
  const matchingWords = mappedWords
    .filter(w => w.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(w => w.item);

  // 3. Map and filter guides, categories, and collections
  const matchingGuides = dbGuides
    .filter(g => g.title.toLowerCase().includes(query) || g.description.toLowerCase().includes(query))
    .slice(0, 2)
    .map(g => ({
      id: g.id,
      type: "guide" as const,
      title: g.title,
      subtitle: g.description,
      slug: g.slug,
      emoji: "📚"
    }));

  const matchingCategories = dbCategories
    .filter(c => c.name.toLowerCase().includes(query) || (c.description || "").toLowerCase().includes(query))
    .slice(0, 2)
    .map(c => ({
      id: c.id,
      type: "category" as const,
      title: `${c.name} Category`,
      subtitle: c.description || "Subculture portal index.",
      slug: c.slug,
      emoji: c.icon || "💬"
    }));

  const matchingCollections = dbCollections
    .filter(col => col.title.toLowerCase().includes(query) || col.description.toLowerCase().includes(query))
    .slice(0, 2)
    .map(col => ({
      id: col.id,
      type: "collection" as const,
      title: col.title,
      subtitle: col.description,
      slug: col.slug,
      emoji: "🎵"
    }));

  // 4. Combine into final response
  const finalResults: SearchItem[] = [
    ...matchingWords,
    ...matchingGuides,
    ...matchingCategories,
    ...matchingCollections
  ];

  // Store in size-capped cache map
  if (searchCache.size > 200) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey !== undefined) {
      searchCache.delete(firstKey);
    }
  }
  searchCache.set(query, finalResults);

  return NextResponse.json(finalResults);
}
