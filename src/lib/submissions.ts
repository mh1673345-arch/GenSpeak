import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

export const submissionSchema = z.object({
  term: z
    .string()
    .trim()
    .min(1, "Enter the word or phrase")
    .max(60, "Keep it under 60 characters"),
  definition: z
    .string()
    .trim()
    .min(20, "Give us at least a sentence")
    .max(600, "Keep it under 600 characters"),
  category: z.enum(["slang", "meme", "ai", "gaming", "social", "web3", "fandom", "work"]),
  example: z.string().trim().max(300, "Keep the example short").optional().or(z.literal("")),
  source: z.string().trim().max(300, "Keep the source short").optional().or(z.literal("")),
  submitter: z.string().trim().max(80).optional().or(z.literal("")),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export type StoredSubmission = SubmissionInput & {
  id: string;
  receivedAt: string;
};

const QUEUE_PATH = path.join(process.cwd(), ".data", "submissions.jsonl");

/**
 * Appends a submission to a newline-delimited review queue on disk. On
 * read-only hosts (most serverless platforms) the write fails harmlessly and
 * the submission is logged instead, so the endpoint never rejects a valid
 * entry because of storage. Swap this one function for a database insert when
 * a persistent store is wired up.
 */
export async function saveSubmission(input: SubmissionInput): Promise<StoredSubmission> {
  const record: StoredSubmission = {
    ...input,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
  };

  try {
    await mkdir(path.dirname(QUEUE_PATH), { recursive: true });
    await appendFile(QUEUE_PATH, `${JSON.stringify(record)}\n`, "utf8");
  } catch {
    console.info("[genspeak] submission received (queue not writable)", record.id, record.term);
  }

  return record;
}
