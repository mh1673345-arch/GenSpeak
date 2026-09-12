"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/term/${slug}`);
      setCopied(true);
    } catch {
      // Clipboard permission denied - leave the button in its resting state.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-muted transition hover:border-line-strong hover:text-ink"
    >
      {copied ? (
        <Check className="size-3.5 text-cool" aria-hidden />
      ) : (
        <Link2 className="size-3.5" aria-hidden />
      )}
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
