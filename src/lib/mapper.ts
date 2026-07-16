import { WordData } from "../data/mockWords";

// Prisma-specific select result type helper
type dbWordType = {
  id: string;
  title: string;
  slug: string;
  shortMeaning: string;
  fullMeaning: string;
  pronunciation: string | null;
  origin: string | null;
  firstAppearance: string | null;
  emoji: string | null;
  aiExplanation: string | null;
  aiTranslation: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories: { id: string; name: string; slug: string }[];
  examples: { id: string; text: string; context: string | null }[];
  synonyms: { id: string; term: string }[];
  antonyms: { id: string; term: string }[];
  timelineEvents: { id: string; year: string; title: string; description: string }[];
  votes: { id: string; type: string }[];
  comments: { id: string; content: string }[];
  ipa: string | null;
  historyText: string | null;
  relatedHashtags: string | null;
  difficulty: string | null;
  popularityScore: number;
  trendScore: number;
  commonMistakes: string | null;
  eli10: string | null;
  parentExplanation: string | null;
  teacherExplanation: string | null;
  safetyNotes: string | null;
  references: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  featuredImage: string | null;
  gallery: string | null;
};

export function mapDbWordToWordData(w: dbWordType): WordData {
  return {
    id: w.id,
    term: w.title,
    slug: w.slug,
    definition: w.shortMeaning,
    meaning: w.fullMeaning,
    pronunciation: w.pronunciation || "/ˈrɪz/",
    origin: w.origin || "Internet platform culture.",
    history: w.timelineEvents.map(e => ({
      title: e.title,
      content: e.description,
      date: e.year
    })),
    popularity: [
      { platform: "TikTok", score: w.popularityScore || 95, trend: "UP" },
      { platform: "Instagram", score: w.trendScore || 88, trend: "UP" },
      { platform: "Discord", score: w.popularityScore || 92, trend: "STABLE" }
    ],
    examples: w.examples.map(ex => ({
      text: ex.text,
      context: ex.context || "General chat"
    })),
    tiktokUsage: "Commonly used in vertical short-form comments and video reaction streams.",
    gamingUsage: "Shouted in competitive voice lobbies and Twitch chat exchanges.",
    discordUsage: "Frequent in chat room servers and community boards.",
    whenToUse: "Use casually with peers online. Appropriate for reactions, descriptions, and light banter.",
    whenNotToUse: "Avoid in professional settings, academic papers, or formal business communications.",
    synonyms: w.synonyms.map(s => s.term),
    antonyms: w.antonyms.map(a => a.term),
    emojis: w.emoji ? [w.emoji] : ["💬"],
    memes: [],
    faq: [
      { q: `What is the origin of "${w.title}"?`, a: w.origin || "Originated from stream and chat incubators." },
      { q: `How is "${w.title}" used in a sentence?`, a: w.examples[0]?.text || "Used in casual digital messages." }
    ],
    category: w.categories[0]?.name || "Slang",
    categorySlug: w.categories[0]?.slug || "slang",
    aiExplanation: w.aiExplanation || "An online expression gaining organic traction in digital dialogue spaces.",
    aiTranslation: w.aiTranslation || "casual expression",
    votes: w.votes.length || 142,
    commentsCount: w.comments.length || 3,
    difficulty: (w.difficulty as "Beginner" | "Intermediate" | "Advanced" | undefined) || "Intermediate",
    popularityStatus: "Viral",
    commonMistakes: w.commonMistakes || "Applying the term in overly formal context loops.",
    funFact: "Slang terms often morph rapidly over a matter of weeks.",
    didYouKnow: "Many internet slangs derive from shorthand text overlays on short clips.",
    ipa: w.ipa || w.pronunciation || "",
    historyText: w.historyText || "",
    relatedHashtags: w.relatedHashtags || "",
    popularityScore: w.popularityScore,
    trendScore: w.trendScore,
    eli10: w.eli10 || "",
    parentExplanation: w.parentExplanation || "",
    teacherExplanation: w.teacherExplanation || "",
    safetyNotes: w.safetyNotes || "",
    references: w.references || "",
    ogTitle: w.ogTitle || "",
    ogDescription: w.ogDescription || "",
    featuredImage: w.featuredImage || "",
    gallery: w.gallery || ""
  };
}
