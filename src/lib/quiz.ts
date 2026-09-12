import { getAllTerms, type Term } from "@/lib/dictionary";
import { seededIndex } from "@/lib/utils";

export type QuizQuestion = {
  slug: string;
  definition: string;
  category: string;
  categoryName: string;
  firstSeen: number;
  /** Four headwords, one of which is correct. */
  options: string[];
  answer: number;
};

/**
 * Builds a round of questions. Distractors are drawn from the same category so
 * that the answer cannot be guessed from subject matter alone, which is what
 * makes the round worth playing.
 */
export function buildQuiz(count: number, seed: string, categoryNames: Map<string, string>) {
  const all = getAllTerms();
  // Bias toward well-known entries so a round is winnable, not obscure trivia.
  const pool = all.filter((term) => term.popularity >= 40);
  const questions: QuizQuestion[] = [];
  const used = new Set<string>();

  let i = 0;
  while (questions.length < count && i < count * 60) {
    const subject = pool[seededIndex(`${seed}:q${i}`, pool.length)];
    i += 1;
    if (!subject || used.has(subject.slug)) continue;
    used.add(subject.slug);

    const distractors = pickDistractors(subject, all, `${seed}:d${i}`);
    if (distractors.length < 3) continue;

    const options = [subject, ...distractors];
    // Deterministic shuffle so server and client agree on ordering.
    for (let j = options.length - 1; j > 0; j -= 1) {
      const k = seededIndex(`${seed}:s${i}:${j}`, j + 1);
      [options[j], options[k]] = [options[k], options[j]];
    }

    questions.push({
      slug: subject.slug,
      definition: subject.definition,
      category: subject.category,
      categoryName: categoryNames.get(subject.category) ?? subject.category,
      firstSeen: subject.firstSeen,
      options: options.map((option) => option.term),
      answer: options.findIndex((option) => option.slug === subject.slug),
    });
  }

  return questions;
}

function pickDistractors(subject: Term, all: Term[], seed: string): Term[] {
  const sameCategory = all.filter(
    (term) => term.category === subject.category && term.slug !== subject.slug,
  );
  const source = sameCategory.length >= 3 ? sameCategory : all.filter((t) => t.slug !== subject.slug);

  const picked: Term[] = [];
  const seen = new Set<string>();
  let i = 0;
  while (picked.length < 3 && i < 200) {
    const candidate = source[seededIndex(`${seed}:${i}`, source.length)];
    i += 1;
    if (!candidate || seen.has(candidate.slug)) continue;
    seen.add(candidate.slug);
    picked.push(candidate);
  }
  return picked;
}
