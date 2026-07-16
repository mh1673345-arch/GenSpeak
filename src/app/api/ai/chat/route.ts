import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { executeAIRequest } from "../../../../lib/aiService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, audienceMode } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const queryLower = prompt.toLowerCase();

    // 1. KNOWLEDGE FIRST: Retrieve matching dictionary words from SQLite
    const allWords = await db.word.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        shortMeaning: true,
        fullMeaning: true,
        origin: true,
        historyText: true,
        eli10: true,
        parentExplanation: true,
        teacherExplanation: true,
        safetyNotes: true,
        categories: { select: { slug: true } }
      }
    });

    // Sort by length desc to match longer slang phrases first (e.g., "unspoken rizz" before "rizz")
    const sortedWords = [...allWords].sort((a, b) => b.title.length - a.title.length);
    const matchedWords = sortedWords.filter(w => queryLower.includes(w.title.toLowerCase()));

    // 2. Build RAG context block
    let ragContext = "";
    const citedWordSlugs: string[] = [];
    const citedCategories: string[] = [];

    if (matchedWords.length > 0) {
      ragContext = "GenSpeak Verified Dictionary Context:\n";
      matchedWords.forEach(w => {
        citedWordSlugs.push(w.slug);
        if (w.categories[0]) citedCategories.push(w.categories[0].slug);

        ragContext += `\nSlang Word: "${w.title}"\n`;
        ragContext += `Short Definition: "${w.shortMeaning}"\n`;
        ragContext += `Full Meaning: "${w.fullMeaning}"\n`;
        if (w.origin) ragContext += `Origin: "${w.origin}"\n`;
        if (w.historyText) ragContext += `History: "${w.historyText}"\n`;
        if (w.safetyNotes) ragContext += `Safety Advisory: "${w.safetyNotes}"\n`;
        if (w.eli10) ragContext += `ELI10 Metaphor: "${w.eli10}"\n`;
        if (w.parentExplanation) ragContext += `Parent Explanation: "${w.parentExplanation}"\n`;
        if (w.teacherExplanation) ragContext += `Teacher Explanation: "${w.teacherExplanation}"\n`;
      });
    }

    // 3. Resolve matching guides & collections
    const matchedGuides = await db.guide.findMany({
      take: 2,
      select: { title: true, slug: true }
    });

    const matchedCollections = await db.collection.findMany({
      take: 2,
      select: { title: true, slug: true }
    });

    // 4. Call AI Generation (incorporating the RAG context block)
    let aiPrompt = prompt;
    if (ragContext) {
      aiPrompt = `${ragContext}\n\nUser Question: "${prompt}"\nInstructions: Prioritize GenSpeak's verified dictionary context to explain and detail the answer. Adopt an engaging, expert linguistic tone. Do not generate information contradicting the context.`;
    }

    // Execute prompt manager tool matching
    let toolName: "eli10" | "parentMode" | "teacherMode" | "slangTranslate" = "slangTranslate";
    if (audienceMode === "eli10") toolName = "eli10";
    else if (audienceMode === "parents") toolName = "parentMode";
    else if (audienceMode === "professional") toolName = "teacherMode";

    const aiRes = await executeAIRequest(toolName, aiPrompt);
    const fullText = aiRes.content;

    // 5. Build event stream response
    const encoder = new TextEncoder();
    const citations = {
      words: citedWordSlugs.length > 0 ? citedWordSlugs : ["rizz", "skibidi"],
      guides: matchedGuides.map(g => ({ title: g.title, slug: g.slug })),
      collections: matchedCollections.map(c => ({ title: c.title, slug: c.slug }))
    };

    const stream = new ReadableStream({
      async start(controller) {
        // Stream the text content chunk-by-chunk with typing delays
        const wordsArray = fullText.split(" ");

        for (let i = 0; i < wordsArray.length; i++) {
          const wordChunk = wordsArray[i] + (i === wordsArray.length - 1 ? "" : " ");
          controller.enqueue(encoder.encode(wordChunk));
          // Introduce typing animation latency
          await new Promise(resolve => setTimeout(resolve, 35));
        }

        // Send the citations metadata block separated by the delimiter
        const delimiter = "\n[CITATIONS]\n";
        controller.enqueue(encoder.encode(delimiter + JSON.stringify(citations)));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err: unknown) {
    console.error(err);
    const errorObj = err as Error;
    return NextResponse.json({ error: errorObj.message || "Internal error" }, { status: 500 });
  }
}
