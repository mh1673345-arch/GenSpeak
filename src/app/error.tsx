"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24">
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
        Something broke
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
        That page did not load
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
        The error has been logged. Trying again usually works.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-ink-subtle">Reference: {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
