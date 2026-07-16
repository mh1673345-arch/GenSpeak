import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { WordStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Import items must be an array" }, { status: 400 });
    }

    const fallbackAuthor = await db.author.findFirst();
    if (!fallbackAuthor) {
      return NextResponse.json({ error: "Author profiles must be seeded before running imports" }, { status: 400 });
    }

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of items) {
      const term = (item.term || "").trim();
      const definition = (item.definition || "").trim();
      
      if (!term || !definition) {
        skippedCount++;
        continue;
      }

      const slug = term.toLowerCase().replace(/\s+/g, "-");

      // Skip duplicate word records
      const exists = await db.word.findUnique({
        where: { slug }
      });
      if (exists) {
        skippedCount++;
        continue;
      }

      // Check / create Category if missing
      const categoryName = item.category || "Slang";
      const categorySlug = categoryName.toLowerCase().trim().replace(/\s+/g, "-");
      
      let cat = await db.category.findUnique({
        where: { slug: categorySlug }
      });
      if (!cat) {
        cat = await db.category.create({
          data: {
            name: categoryName,
            slug: categorySlug,
            description: `Auto-generated category during bulk import`
          }
        });
      }

      // Convert scores
      const popScoreVal = item.popularityScore ? parseInt(item.popularityScore, 10) : 0;
      const trScoreVal = item.trendScore ? parseInt(item.trendScore, 10) : 0;

      // Insert the word entry
      const word = await db.word.create({
        data: {
          title: term,
          slug,
          shortMeaning: definition,
          fullMeaning: item.meaning || definition,
          pronunciation: item.pronunciation || `/${slug}/`,
          origin: item.origin || "Origin recorded via bulk import.",
          status: WordStatus.APPROVED,
          authorId: fallbackAuthor.id,
          ipa: item.ipa || item.pronunciation || null,
          historyText: item.historyText || null,
          relatedHashtags: item.relatedHashtags || null,
          difficulty: item.difficulty || null,
          popularityScore: Number.isNaN(popScoreVal) ? 0 : popScoreVal,
          trendScore: Number.isNaN(trScoreVal) ? 0 : trScoreVal,
          commonMistakes: item.commonMistakes || null,
          eli10: item.eli10 || null,
          parentExplanation: item.parentExplanation || null,
          teacherExplanation: item.teacherExplanation || null,
          safetyNotes: item.safetyNotes || null,
          references: item.references || null,
          ogTitle: item.ogTitle || null,
          ogDescription: item.ogDescription || null,
          featuredImage: item.featuredImage || null,
          gallery: item.gallery || null,
          categories: {
            connect: { id: cat.id }
          }
        }
      });

      // Import synonyms if provided
      if (Array.isArray(item.synonyms)) {
        await Promise.all(
          item.synonyms.map((s: string) => 
            db.synonym.create({
              data: {
                wordId: word.id,
                term: s.trim()
              }
            })
          )
        );
      }

      // Import antonyms if provided
      if (Array.isArray(item.antonyms)) {
        await Promise.all(
          item.antonyms.map((a: string) => 
            db.antonym.create({
              data: {
                wordId: word.id,
                term: a.trim()
              }
            })
          )
        );
      }

      importedCount++;
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount
    });

  } catch (error) {
    console.error("Failed to execute bulk import inside admin api:", error);
    return NextResponse.json({ error: "Failed to process bulk importer request" }, { status: 500 });
  }
}
