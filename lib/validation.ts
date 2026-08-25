import { z } from "zod";

import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX_LENGTH,
  POLL_QUESTION_MAX_LENGTH,
} from "@/lib/constants";

/**
 * Stable validation error keys. Server actions return these; the client
 * translates them via `dict.form.errors`.
 */
export type CreatePollErrorKey =
  | "emptyQuestion"
  | "questionTooLong"
  | "emptyOption"
  | "duplicateOption"
  | "tooFewOptions"
  | "generic";

export const createPollSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1)
    .max(POLL_QUESTION_MAX_LENGTH),
  options: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(POLL_OPTION_MAX_LENGTH),
    )
    .min(POLL_MIN_OPTIONS)
    .max(POLL_MAX_OPTIONS)
    .refine((options) => new Set(options).size === options.length),
  expiresInSeconds: z
    .number()
    .int()
    .min(60)
    .max(60 * 60 * 24 * 31)
    .nullable(),
});

/** Maps a failed Zod parse to a user-facing error key. */
export function createPollErrorKey(
  issue: z.core.$ZodIssue | undefined,
): CreatePollErrorKey {
  if (!issue) return "generic";
  const path = issue.path.join(".");
  if (path === "question") {
    return issue.input === undefined || issue.input === "" || (typeof issue.input === "string" && issue.input.trim() === "")
      ? "emptyQuestion"
      : "questionTooLong";
  }
  if (path.startsWith("options")) {
    if (issue.code === "too_small") return issue.path.length > 1 ? "emptyOption" : "tooFewOptions";
    if (issue.code === "custom") return "duplicateOption";
    if (issue.code === "too_big") return issue.path.length > 1 ? "generic" : "generic";
  }
  return "generic";
}

export type CreatePollInput = z.infer<typeof createPollSchema>;
