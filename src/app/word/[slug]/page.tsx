import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { WordDetails } from "../../../components/WordDetails";
import { Footer } from "../../../components/Footer";
import { db } from "../../../lib/db";
import { mapDbWordToWordData } from "../../../lib/mapper";
import { cache } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

// Request-level cache to deduplicate DB queries between page render and generateMetadata
const getWordBySlug = cache(async (slug: string) => {
  return db.word.findUnique({
    where: { slug },
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
});

export async function generateStaticParams() {
  try {
    const words = await db.word.findMany({
      select: { slug: true },
      take: 10
    });
    return words.map((word) => ({
      slug: word.slug,
    }));
  } catch (err) {
    console.warn("Failed to generate static params due to DB network issues. Falling back to dynamic rendering.", err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbWord = await getWordBySlug(slug);
  
  if (!dbWord) {
    return {
      title: "Word Not Found | GenSpeak",
    };
  }

  const word = mapDbWordToWordData(dbWord);

  return {
    title: `What Does "${word.term}" Mean? | GenSpeak Slang Dictionary`,
    description: `Meaning of "${word.term}": ${word.definition}. Origin: ${word.origin.slice(0, 100)}... Learn TikTok examples, gaming context, and related emojis.`,
    alternates: {
      canonical: `/word/${word.slug}`,
    },
    openGraph: {
      title: `Meaning of "${word.term}" | GenSpeak`,
      description: word.definition,
      type: "article",
      url: `https://genspeak.app/word/${word.slug}`,
    }
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const dbWord = await getWordBySlug(slug);

  if (!dbWord) {
    notFound();
  }

  const word = mapDbWordToWordData(dbWord);

  // Dynamic link engine queries
  const relatedSlangs = await db.word.findMany({
    where: {
      categories: {
        some: {
          slug: dbWord.categories[0]?.slug || "slang"
        }
      },
      NOT: { id: dbWord.id }
    },
    take: 3
  });

  const popularSlangs = await db.word.findMany({
    where: {
      NOT: { id: dbWord.id }
    },
    orderBy: {
      votes: {
        _count: "desc"
      }
    },
    take: 3
  });

  // Schema Rich Snippet parameters for Google crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": word.term,
    "description": word.definition,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "GenSpeak Slang Dictionary",
      "url": "https://genspeak.app"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] relative overflow-hidden grid-bg">
      {/* Schema Rich Snippet for Dictionary Search Index */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background glow overlay */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-pink/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10 flex flex-col gap-10">
        <div className="rounded-3xl glass-panel p-6 md:p-8 bg-[#090D1A]/50 border border-white/5">
          <WordDetails word={word} />
        </div>

        {/* Dynamic explore sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Related Slang Recommendations */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-white text-base text-left tracking-tight uppercase">
              Related Slang Keywords
            </h4>
            <div className="flex flex-col gap-3">
              {relatedSlangs.map((ws) => (
                <a
                  key={ws.id}
                  href={`/word/${ws.slug}`}
                  className="group rounded-2xl glass-panel p-4 border border-white/5 hover:border-primary-purple/20 transition-all duration-300 flex items-center justify-between text-left"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display font-bold text-sm text-white group-hover:text-primary-purple transition-colors uppercase">
                      {ws.title}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {ws.shortMeaning}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 group-hover:text-white transition-colors">
                    EXPLORE →
                  </span>
                </a>
              ))}
              {relatedSlangs.length === 0 && (
                <span className="text-xs text-slate-600 font-mono italic">No related definitions available.</span>
              )}
            </div>
          </div>

          {/* Popular Slang Recommendations */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-white text-base text-left tracking-tight uppercase">
              Popular Slang This Week
            </h4>
            <div className="flex flex-col gap-3">
              {popularSlangs.map((ws) => (
                <a
                  key={ws.id}
                  href={`/word/${ws.slug}`}
                  className="group rounded-2xl glass-panel p-4 border border-white/5 hover:border-primary-pink/20 transition-all duration-300 flex items-center justify-between text-left"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display font-bold text-sm text-white group-hover:text-primary-pink transition-colors uppercase">
                      {ws.title}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {ws.shortMeaning}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 group-hover:text-white transition-colors">
                    EXPLORE →
                  </span>
                </a>
              ))}
              {popularSlangs.length === 0 && (
                <span className="text-xs text-slate-600 font-mono italic">No popular definitions available.</span>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
