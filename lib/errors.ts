/**
 * Maps typed errors raised by the `create_poll` / `cast_vote` RPCs
 * (PostgREST surfaces them as the error `message`) to stable error keys.
 * Clients translate the keys into the active language; the strings below
 * serve as an English fallback.
 */
const RPC_ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "Your session expired. Please try again.",
  invalid_question: "The poll question is invalid.",
  invalid_option_count: "A poll needs between 2 and 10 options.",
  invalid_option_label: "One of the options is invalid.",
  duplicate_option: "Options must be unique.",
  invalid_expiry: "The expiration must be in the future.",
  could_not_generate_slug: "Could not create the poll. Please try again.",
  poll_not_found: "This poll does not exist.",
  poll_closed: "This poll is closed and no longer accepts votes.",
  already_voted: "You have already voted in this poll.",
  invalid_option: "That option does not belong to this poll.",
  rate_limited: "You are voting too fast. Please slow down.",
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/** Returns a stable error key for known RPC failures, null otherwise. */
export function rpcErrorKey(message: string | null | undefined): string | null {
  if (!message) return null;
  if (message in RPC_ERROR_MESSAGES) return message;
  return null;
}

export function toUserErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return RPC_ERROR_MESSAGES[error.message] ?? DEFAULT_ERROR_MESSAGE;
  }
  return DEFAULT_ERROR_MESSAGE;
}

/** Typed result for server actions surfaced to client components. */
export type ActionResult<T, E extends string = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };
