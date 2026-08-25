import { z } from "zod";

import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX_LENGTH,
  POLL_QUESTION_MAX_LENGTH,
} from "@/lib/constants";

/** Expiry choices offered by the creation form (in seconds). */
export const EXPIRY_CHOICES = [
  { label: "No expiry", value: null },
  { label: "1 hour", value: 60 * 60 },
  { label: "1 day", value: 60 * 60 * 24 },
  { label: "1 week", value: 60 * 60 * 24 * 7 },
] as const;

export const createPollSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Please enter a question.")
    .max(
      POLL_QUESTION_MAX_LENGTH,
      `Question must be at most ${POLL_QUESTION_MAX_LENGTH} characters.`,
    ),
  options: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Options cannot be empty.")
        .max(
          POLL_OPTION_MAX_LENGTH,
          `Options must be at most ${POLL_OPTION_MAX_LENGTH} characters.`,
        ),
    )
    .min(POLL_MIN_OPTIONS, `Add at least ${POLL_MIN_OPTIONS} options.`)
    .max(POLL_MAX_OPTIONS, `Add at most ${POLL_MAX_OPTIONS} options.`)
    .refine((options) => new Set(options).size === options.length, {
      message: "Options must be unique.",
    }),
  expiresInSeconds: z
    .number()
    .int()
    .min(60)
    .max(60 * 60 * 24 * 31)
    .nullable(),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;
