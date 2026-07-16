import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { mapDbWordToWordData } from "../../../lib/mapper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  const isRandom = searchParams.get("random") === "true";
  const isTrending = searchParams.get("trending") === "true";

  if (isTrending) {
    const dbWords = await db.word.findMany({
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        shortMeaning: true,
        popularityScore: true,
        trendScore: true,
        categories: {
          select: {
            name: true
          }
        }
      },
      orderBy: { popularityScore: "desc" }
    });

    const lightweightTrending = dbWords.map(w => ({
      id: w.id,
      term: w.title,
      slug: w.slug,
      definition: w.shortMeaning,
      category: w.categories[0]?.name || "Slang",
      popularity: [
        { platform: "TikTok", score: w.popularityScore || 95, trend: "UP" as const }
      ]
    }));

    return NextResponse.json(lightweightTrending);
  }

  if (isRandom) {
    const count = await db.word.count();
    if (count === 0) {
      return NextResponse.json({ error: "No words in database" }, { status: 404 });
    }
    const randomIndex = Math.floor(Math.random() * count);
    const dbWord = await db.word.findFirst({
      skip: randomIndex,
      include: {
        categories: true,
        examples: true,
        synonyms: true,
        antonyms: true,
        timelineEvents: true,
        votes: true,
        comments: true,
      }
    });
    if (!dbWord) {
      return NextResponse.json({ error: "Failed to find random word" }, { status: 404 });
    }
    return NextResponse.json(mapDbWordToWordData(dbWord));
  }

  if (!slug && !id) {
    const dbWords = await db.word.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        shortMeaning: true,
        categories: {
          select: {
            name: true
          }
        }
      },
      orderBy: { title: "asc" }
    });

    const lightweightWords = dbWords.map(w => ({
      id: w.id,
      term: w.title,
      slug: w.slug,
      definition: w.shortMeaning,
      category: w.categories[0]?.name || "Slang"
    }));

    return NextResponse.json(lightweightWords);
  }

  const dbWord = await db.word.findFirst({
    where: slug ? { slug } : { id: id! },
    include: {
      categories: true,
      examples: true,
      synonyms: true,
      antonyms: true,
      timelineEvents: true,
      votes: true,
      comments: true,
    }
  });

  if (!dbWord) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  return NextResponse.json(mapDbWordToWordData(dbWord));
}
