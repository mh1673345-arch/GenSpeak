import { WordData } from "../data/mockWords";

/**
 * Isolated search service abstraction.
 * This can be modified to query external indexes (Typesense, Meilisearch, or Algolia)
 * without modifying the client component interface.
 */
export async function searchSlang(query: string, data: WordData[]): Promise<WordData[]> {
  // Simulate network roundtrip latency to trigger dynamic loading states
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query.trim()) {
        resolve(data.slice(0, 3)); // Return top recommendation items when query is empty
        return;
      }

      const lower = query.toLowerCase();
      const filtered = data.filter(
        (word) =>
          word.term.toLowerCase().includes(lower) ||
          word.definition.toLowerCase().includes(lower) ||
          word.category.toLowerCase().includes(lower)
      );

      resolve(filtered);
    }, 120); // 120ms latency simulation
  });
}
