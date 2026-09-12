import type { Metadata } from "next";

import { QuizGame } from "@/components/quiz-game";
import { Container } from "@/components/ui/container";
import { categories } from "@/content/categories";
import { buildQuiz } from "@/lib/quiz";

export const metadata: Metadata = {
  title: "How online are you?",
  description:
    "Ten definitions, four choices each. A daily test of how much internet vocabulary you actually know.",
  alternates: { canonical: "/quiz" },
};

// A new round each day, identical for everyone, so scores are comparable.
export const revalidate = 3600;

export default function QuizPage() {
  const names = new Map(categories.map((category) => [category.slug as string, category.name]));
  const seed = new Date().toISOString().slice(0, 10);
  const questions = buildQuiz(10, seed, names);

  return (
    <Container className="py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Daily round
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          How online are you?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty">
          Ten definitions, four options each. The wrong answers come from the same category as the
          right one, so subject matter will not save you.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        <QuizGame questions={questions} />
      </div>
    </Container>
  );
}
