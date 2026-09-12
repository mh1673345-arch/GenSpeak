import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-3xl leading-none tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
