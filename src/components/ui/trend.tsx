import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

/** Small signed indicator for a term's 30-day usage change. */
export function TrendPill({ value, className }: { value: number; className?: string }) {
  const flat = Math.abs(value) < 3;
  const up = value > 0;
  const Icon = flat ? ArrowRight : up ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums",
        flat && "bg-canvas-subtle text-ink-subtle",
        !flat && up && "bg-cool/10 text-cool",
        !flat && !up && "bg-hot/10 text-hot",
        className,
      )}
      title={`${value > 0 ? "+" : ""}${value}% usage over the last 30 days`}
    >
      <Icon className="size-3" aria-hidden />
      {value > 0 ? "+" : ""}
      {value}%
    </span>
  );
}
