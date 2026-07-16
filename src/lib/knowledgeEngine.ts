import { db } from "./db";
import { WordStatus, VoteType, Prisma } from "@prisma/client";

export interface WordQueryOptions {
  query?: string;
  categorySlug?: string;
  tagSlug?: string;
  platformSlug?: string;
  status?: WordStatus;
  limit?: number;
  offset?: number;
}

// =========================================================
// KNOWLEDGE ENGINE SERVICE LAYER
// =========================================================

export const knowledgeEngine = {
  
  // 1. WORD DIRECTORY SERVICES
  async getWords(options: WordQueryOptions = {}) {
    const {
      query,
      categorySlug,
      tagSlug,
      platformSlug,
      status = WordStatus.APPROVED,
      limit = 20,
      offset = 0
    } = options;

    // Build Prisma query condition block
    const where: Prisma.WordWhereInput = { status };

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { shortMeaning: { contains: query } },
        { fullMeaning: { contains: query } }
      ];
    }

    if (categorySlug) {
      where.categories = {
        some: { slug: categorySlug }
      };
    }

    if (tagSlug) {
      where.tags = {
        some: { slug: tagSlug }
      };
    }

    if (platformSlug) {
      where.platforms = {
        some: { slug: platformSlug }
      };
    }

    const [items, total] = await Promise.all([
      db.word.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { title: "asc" },
        include: {
          categories: true,
          tags: true,
          platforms: true,
          author: true,
          examples: true
        }
      }),
      db.word.count({ where })
    ]);

    return { items, total };
  },

  async getWordBySlug(slug: string) {
    return db.word.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: true,
        tags: true,
        platforms: true,
        examples: true,
        conversations: true,
        synonyms: true,
        antonyms: true,
        relatedFrom: {
          include: { targetWord: true }
        },
        relatedTo: {
          include: { sourceWord: true }
        },
        trending: true,
        media: true
      }
    });
  },

  async createWord(data: {
    title: string;
    slug: string;
    shortMeaning: string;
    fullMeaning: string;
    authorId: string;
    pronunciation?: string;
    origin?: string;
    firstAppearance?: string;
    emoji?: string;
    aiExplanation?: string;
    aiTranslation?: string;
    seoTitle?: string;
    seoDescription?: string;
    status?: WordStatus;
    categoryIds?: string[];
    tagIds?: string[];
    platformIds?: string[];
    synonyms?: string[];
    antonyms?: string[];
    examples?: { text: string; context?: string }[];
  }) {
    const {
      categoryIds = [],
      tagIds = [],
      platformIds = [],
      synonyms = [],
      antonyms = [],
      examples = [],
      ...wordData
    } = data;

    return db.word.create({
      data: {
        ...wordData,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        },
        tags: {
          connect: tagIds.map(id => ({ id }))
        },
        platforms: {
          connect: platformIds.map(id => ({ id }))
        },
        synonyms: {
          create: synonyms.map(term => ({ term }))
        },
        antonyms: {
          create: antonyms.map(term => ({ term }))
        },
        examples: {
          create: examples
        }
      },
      include: {
        categories: true,
        tags: true,
        platforms: true
      }
    });
  },

  async updateWord(
    id: string,
    data: {
      title?: string;
      shortMeaning?: string;
      fullMeaning?: string;
      pronunciation?: string;
      origin?: string;
      firstAppearance?: string;
      emoji?: string;
      aiExplanation?: string;
      aiTranslation?: string;
      seoTitle?: string;
      seoDescription?: string;
      status?: WordStatus;
      categoryIds?: string[];
      tagIds?: string[];
      platformIds?: string[];
    }
  ) {
    const { categoryIds, tagIds, platformIds, ...wordData } = data;

    const updateData: Prisma.WordUpdateInput = { ...wordData };

    if (categoryIds) {
      updateData.categories = {
        set: categoryIds.map(catId => ({ id: catId }))
      };
    }

    if (tagIds) {
      updateData.tags = {
        set: tagIds.map(tId => ({ id: tId }))
      };
    }

    if (platformIds) {
      updateData.platforms = {
        set: platformIds.map(pId => ({ id: pId }))
      };
    }

    return db.word.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
        tags: true,
        platforms: true
      }
    });
  },

  // 2. SEARCH & AUTOCOMPLETE ACTIONS
  async autocomplete(query: string, limit = 8) {
    if (!query) return [];

    return db.word.findMany({
      where: {
        title: { startsWith: query },
        status: WordStatus.APPROVED
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortMeaning: true
      },
      take: limit
    });
  },

  async logSearch(query: string, userId?: string) {
    if (!query.trim()) return;

    return db.searchHistory.create({
      data: {
        query: query.trim(),
        userId
      }
    });
  },

  async getPopularSearches(limit = 6) {
    const aggregations = await db.searchHistory.groupBy({
      by: ["query"],
      _count: {
        query: true
      },
      orderBy: {
        _count: {
          query: "desc"
        }
      },
      take: limit
    });

    return aggregations.map(agg => ({
      query: agg.query,
      count: agg._count.query
    }));
  },

  // 3. CORE ANALYTICS ENGINE
  async incrementAnalytics(wordId: string, action: "view" | "share" | "copy") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert views/shares count for the current day
    const analytics = await db.analytics.findFirst({
      where: {
        wordId,
        date: today
      }
    });

    if (analytics) {
      return db.analytics.update({
        where: { id: analytics.id },
        data: {
          views: action === "view" ? { increment: 1 } : undefined,
          shares: action === "share" ? { increment: 1 } : undefined,
          copies: action === "copy" ? { increment: 1 } : undefined
        }
      });
    } else {
      return db.analytics.create({
        data: {
          wordId,
          date: today,
          views: action === "view" ? 1 : 0,
          shares: action === "share" ? 1 : 0,
          copies: action === "copy" ? 1 : 0
        }
      });
    }
  },

  // 4. INTERACTION SYSTEMS
  async voteWord(wordId: string, userId: string, type: VoteType) {
    return db.vote.upsert({
      where: {
        userId_wordId: { userId, wordId }
      },
      update: {
        type
      },
      create: {
        wordId,
        userId,
        type
      }
    });
  },

  // 5. TIMELINE SERVICES
  async getTimelineEvents() {
    return db.timelineEvent.findMany({
      orderBy: { eventDate: "asc" },
      include: {
        words: true
      }
    });
  },

  // 6. EDITORIAL CMS: PUBLISHING WORKFLOW
  async getDrafts(limit = 10, offset = 0) {
    return db.word.findMany({
      where: {
        status: { in: [WordStatus.DRAFT, WordStatus.PENDING_REVIEW] }
      },
      take: limit,
      skip: offset,
      orderBy: { updatedAt: "desc" },
      include: {
        author: true,
        categories: true
      }
    });
  }
};
