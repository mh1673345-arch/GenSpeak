import { redirect } from "next/navigation";

import { getAllTerms } from "@/lib/dictionary";

// Never prerendered: the point is a different entry on every visit.
export const dynamic = "force-dynamic";

export default function RandomPage() {
  const terms = getAllTerms();
  const term = terms[Math.floor(Math.random() * terms.length)];
  redirect(`/term/${term.slug}`);
}
