import type { Metadata } from "next";
import { Suspense } from "react";

import { SubmitForm } from "@/components/submit-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Submit a term",
  description:
    "Send GenSpeak a word we have missed. Include what it means and where you saw it, and it goes into the editorial review queue.",
  alternates: { canonical: "/submit" },
};

const steps = [
  {
    title: "You send it",
    body: "The word, what you think it means, and ideally where you saw it. Rough is fine.",
  },
  {
    title: "We check it",
    body: "We look for independent uses across at least two communities before writing an entry.",
  },
  {
    title: "It gets written",
    body: "Published entries carry an origin, a plain-language version and real examples. Contributors are credited.",
  },
];

export default function SubmitPage() {
  return (
    <Container className="py-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
            Contribute
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Submit a term
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted text-pretty">
            Words appear faster than any dictionary can keep up with. If something is missing, this
            is how it gets added.
          </p>

          <ol className="mt-12 space-y-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-ink-subtle">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display text-xl tracking-tight">{step.title}</h2>
                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Suspense fallback={<div className="card h-[32rem] animate-pulse" />}>
          <SubmitForm />
        </Suspense>
      </div>
    </Container>
  );
}
