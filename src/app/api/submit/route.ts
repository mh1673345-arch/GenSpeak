import type { NextRequest } from "next/server";

import { saveSubmission, submissionSchema } from "@/lib/submissions";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return Response.json({ error: "Some fields need attention", fieldErrors }, { status: 422 });
  }

  const record = await saveSubmission(parsed.data);

  return Response.json(
    {
      ok: true,
      id: record.id,
      message: `Thanks. "${record.term}" is in the review queue.`,
    },
    { status: 201 },
  );
}
