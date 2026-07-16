import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { mapDbWordToWordData } from "../../../../lib/mapper";
import { WordStatus } from "@prisma/client";

// Fetch all words in database
export async function GET() {
  try {
    const dbWords = await db.word.findMany({
      include: {
        categories: true,
        examples: true,
        synonyms: true,
        antonyms: true,
        timelineEvents: true,
        votes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(dbWords.map(mapDbWordToWordData));
  } catch (error) {
    console.error("Failed to fetch words in admin portal:", error);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

// Add or edit a word inside the database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      term, definition, meaning, pronunciation, origin, 
      firstAppearance, emoji, examples, 
      synonyms, antonyms, category, 
      seoTitle, seoDescription, status, aiExplanation,
      ipa, historyText, relatedHashtags, difficulty, 
      popularityScore, trendScore, commonMistakes, eli10, 
      parentExplanation, teacherExplanation, safetyNotes, 
      references, ogTitle, ogDescription, featuredImage, gallery
    } = body;

    if (!term || !definition) {
      return NextResponse.json({ error: "Term and definition are required" }, { status: 400 });
    }

    const slug = term.toLowerCase().trim().replace(/\s+/g, "-");

    // Retrieve or create the category record
    const categorySlug = category.toLowerCase().trim().replace(/\s+/g, "-");
    let catRecord = await db.category.findUnique({
      where: { slug: categorySlug }
    });
    if (!catRecord) {
      catRecord = await db.category.create({
        data: {
          name: category,
          slug: categorySlug,
          description: `curated glossary index for ${category}`
        }
      });
    }

    // Check if the author exists, retrieve a fallback
    const fallbackAuthor = await db.author.findFirst();
    if (!fallbackAuthor) {
      return NextResponse.json({ error: "Setup database authors first before adding words" }, { status: 400 });
    }

    // Parse array string formats
    const listExamples = examples ? JSON.parse(examples) : [];
    const listSynonyms = synonyms ? synonyms.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
    const listAntonyms = antonyms ? antonyms.split(",").map((a: string) => a.trim()).filter(Boolean) : [];

    // Parse status matching schema enum values
    let schemaStatus: WordStatus = WordStatus.PENDING_REVIEW;
    if (status === "APPROVED" || status === "PUBLISHED") schemaStatus = WordStatus.APPROVED;
    else if (status === "DRAFT") schemaStatus = WordStatus.DRAFT;

    // Convert scores to integers
    const popScoreVal = popularityScore ? parseInt(popularityScore, 10) : 0;
    const trScoreVal = trendScore ? parseInt(trendScore, 10) : 0;

    // Upsert the word entry inside SQLite
    const word = await db.word.upsert({
      where: { slug },
      update: {
        title: term,
        shortMeaning: definition,
        fullMeaning: meaning || definition,
        pronunciation,
        origin,
        firstAppearance,
        emoji,
        aiExplanation,
        aiTranslation: definition,
        seoTitle,
        seoDescription,
        status: schemaStatus,
        authorId: fallbackAuthor.id,
        ipa: ipa || null,
        historyText: historyText || null,
        relatedHashtags: relatedHashtags || null,
        difficulty: difficulty || null,
        popularityScore: Number.isNaN(popScoreVal) ? 0 : popScoreVal,
        trendScore: Number.isNaN(trScoreVal) ? 0 : trScoreVal,
        commonMistakes: commonMistakes || null,
        eli10: eli10 || null,
        parentExplanation: parentExplanation || null,
        teacherExplanation: teacherExplanation || null,
        safetyNotes: safetyNotes || null,
        references: references || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        featuredImage: featuredImage || null,
        gallery: gallery || null,
      },
      create: {
        title: term,
        slug,
        shortMeaning: definition,
        fullMeaning: meaning || definition,
        pronunciation,
        origin,
        firstAppearance,
        emoji,
        aiExplanation,
        aiTranslation: definition,
        seoTitle,
        seoDescription,
        status: schemaStatus,
        authorId: fallbackAuthor.id,
        ipa: ipa || null,
        historyText: historyText || null,
        relatedHashtags: relatedHashtags || null,
        difficulty: difficulty || null,
        popularityScore: Number.isNaN(popScoreVal) ? 0 : popScoreVal,
        trendScore: Number.isNaN(trScoreVal) ? 0 : trScoreVal,
        commonMistakes: commonMistakes || null,
        eli10: eli10 || null,
        parentExplanation: parentExplanation || null,
        teacherExplanation: teacherExplanation || null,
        safetyNotes: safetyNotes || null,
        references: references || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        featuredImage: featuredImage || null,
        gallery: gallery || null,
        categories: {
          connect: { id: catRecord.id }
        }
      }
    });

    // Sync examples, synonyms, antonyms
    await Promise.all([
      db.example.deleteMany({ where: { wordId: word.id } }),
      db.synonym.deleteMany({ where: { wordId: word.id } }),
      db.antonym.deleteMany({ where: { wordId: word.id } })
    ]);

    await Promise.all([
      ...listExamples.map((ex: { text: string; context?: string }) => 
        db.example.create({
          data: {
            wordId: word.id,
            text: ex.text,
            context: ex.context || "Usage Example"
          }
        })
      ),
      ...listSynonyms.map((syn: string) => 
        db.synonym.create({
          data: {
            wordId: word.id,
            term: syn
          }
        })
      ),
      ...listAntonyms.map((ant: string) => 
        db.antonym.create({
          data: {
            wordId: word.id,
            term: ant
          }
        })
      )
    ]);

    return NextResponse.json({ success: true, slug: word.slug });
  } catch (error) {
    console.error("Failed to upsert word inside admin route:", error);
    return NextResponse.json({ error: "Failed to write word entry to database" }, { status: 500 });
  }
}
