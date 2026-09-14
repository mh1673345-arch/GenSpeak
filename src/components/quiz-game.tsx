"use client";

import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { QuizQuestion } from "@/lib/quiz";
import { cn } from "@/lib/utils";

type Answer = { question: QuizQuestion; chosen: number };

export function QuizGame({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const question = questions[index];
  const finished = index >= questions.length;
  const score = answers.filter((a) => a.chosen === a.question.answer).length;

  function choose(option: number) {
    if (chosen !== null) return;
    setChosen(option);
    setAnswers((prev) => [...prev, { question, chosen: option }]);
  }

  function next() {
    setChosen(null);
    setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setChosen(null);
    setAnswers([]);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const verdict =
      pct === 100
        ? "Nothing left to teach you."
        : pct >= 80
          ? "Comfortably online."
          : pct >= 50
            ? "Respectably online."
            : "Touch grass, then come back.";

    return (
      <div className="card p-8 sm:p-12">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">Result</p>
        <p className="mt-4 font-display text-7xl leading-none tabular-nums">
          {score}
          <span className="text-ink-subtle">/{questions.length}</span>
        </p>
        <p className="mt-3 font-display text-2xl tracking-tight">{verdict}</p>

        <ul className="mt-8 divide-y divide-line border-t border-line">
          {answers.map(({ question: q, chosen: c }) => {
            const right = c === q.answer;
            return (
              <li key={q.slug} className="flex items-center gap-3 py-3">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full",
                    right ? "bg-cool/15 text-cool" : "bg-hot/15 text-hot",
                  )}
                >
                  {right ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                </span>
                <Link
                  href={`/meaning/${q.slug}`}
                  className="focus-ring font-display text-lg tracking-tight hover:text-accent"
                >
                  {q.options[q.answer]}
                </Link>
                {!right ? (
                  <span className="ml-auto font-mono text-[11px] text-ink-subtle">
                    you said {q.options[c]}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={restart}
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-canvas transition hover:bg-ink/88"
          >
            <RotateCcw className="size-4" aria-hidden />
            Play again
          </button>
          <Link
            href="/dictionary"
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm transition hover:border-line-strong"
          >
            Browse the dictionary
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          {index + 1} of {questions.length}
        </p>
        <p className="font-mono text-[11px] text-ink-subtle tabular-nums">
          score {score}/{answers.length}
        </p>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-canvas-subtle">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <p className="mt-8 font-mono text-[11px] tracking-widest text-ink-subtle uppercase">
        {question.categoryName} &middot; est. {question.firstSeen}
      </p>
      <p className="mt-4 font-display text-2xl leading-snug tracking-tight text-pretty sm:text-3xl">
        {question.definition}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const isAnswer = i === question.answer;
          const isChosen = i === chosen;
          const revealed = chosen !== null;

          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(i)}
              disabled={revealed}
              className={cn(
                "focus-ring flex items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left transition",
                !revealed && "border-line hover:border-line-strong hover:bg-canvas-subtle",
                revealed && isAnswer && "border-cool/40 bg-cool/10",
                revealed && isChosen && !isAnswer && "border-hot/40 bg-hot/10",
                revealed && !isAnswer && !isChosen && "border-line opacity-50",
              )}
            >
              <span className="font-display text-xl tracking-tight">{option}</span>
              {revealed && isAnswer ? <Check className="size-4 shrink-0 text-cool" /> : null}
              {revealed && isChosen && !isAnswer ? (
                <X className="size-4 shrink-0 text-hot" />
              ) : null}
            </button>
          );
        })}
      </div>

      {chosen !== null ? (
        <div className="animate-fade mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <Link
            href={`/meaning/${question.slug}`}
            className="focus-ring text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Read the full entry for {question.options[question.answer]}
          </Link>
          <button
            type="button"
            onClick={next}
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition hover:brightness-110"
          >
            {index === questions.length - 1 ? "See result" : "Next"}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
