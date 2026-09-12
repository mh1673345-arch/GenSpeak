import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-line bg-canvas-subtle text-ink-muted",
        outline: "border-line text-ink-muted",
        accent: "border-transparent bg-accent text-accent-ink",
        soft: "border-transparent bg-accent-soft text-accent",
        hot: "border-transparent bg-hot/10 text-hot",
        cool: "border-transparent bg-cool/10 text-cool",
        category: "cat-tint",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] tracking-wide",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badge>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant, size }), className)} {...props} />;
}
