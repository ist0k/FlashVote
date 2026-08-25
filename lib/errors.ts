/**
 * Maps typed errors raised by the `create_poll` / `cast_vote` RPCs
 * (PostgREST surfaces them as the error `message`) to user-facing strings.
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

export function rpcErrorMessage(
  message: string | null | undefined,
): string | undefined {
  if (!message) return undefined;
  return RPC_ERROR_MESSAGES[message];
}

export function toUserErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return rpcErrorMessage(error.message) ?? DEFAULT_ERROR_MESSAGE;
  }
  return DEFAULT_ERROR_MESSAGE;
}

/** Typed result for server actions surfaced to client components. */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
