"use server";

import { revalidatePath } from "next/cache";

import { rpcErrorKey, type ActionResult } from "@/lib/errors";
import {
  createPollErrorKey,
  createPollSchema,
  type CreatePollErrorKey,
} from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";
import type { PollStatus } from "@/lib/types/poll";

const CREATE_ERROR_KEYS: readonly string[] = [
  "emptyQuestion",
  "questionTooLong",
  "emptyOption",
  "duplicateOption",
  "tooFewOptions",
];

/**
 * Ensures the visitor has an anonymous identity so the poll can be owned and
 * later managed. Server Actions may write cookies, so server-side anonymous
 * sign-in is safe here (unlike Server Components).
 */
async function ensureSession(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw new Error(error.message);
  }
}

export async function createPollAction(
  input: unknown,
): Promise<ActionResult<{ slug: string }, CreatePollErrorKey | "not_authenticated" | "generic">> {
  const parsed = createPollSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: createPollErrorKey(parsed.error.issues[0]) };
  }

  try {
    await ensureSession();

    const supabase = await createClient();
    const expiresAt =
      parsed.data.expiresInSeconds !== null
        ? new Date(Date.now() + parsed.data.expiresInSeconds * 1000).toISOString()
        : null;

    const { data: slug, error } = await supabase.rpc("create_poll", {
      p_question: parsed.data.question,
      p_options: parsed.data.options,
      ...(expiresAt !== null ? { p_expires_at: expiresAt } : {}),
    });

    if (error) {
      const key = rpcErrorKey(error.message);
      const known: CreatePollErrorKey | "not_authenticated" =
        key === "not_authenticated"
          ? "not_authenticated"
          : (key as CreatePollErrorKey);
      return {
        ok: false,
        error: key && (known === "not_authenticated" || known in CREATE_ERROR_KEYS)
          ? known
          : "generic",
      };
    }

    return { ok: true, data: { slug } };
  } catch (error) {
    console.error("[createPollAction]", error);
    return { ok: false, error: "generic" };
  }
}

export async function setPollStatusAction(
  slug: string,
  status: PollStatus,
): Promise<ActionResult<{ status: PollStatus }, "invalid_status" | "forbidden" | "generic">> {
  if (status !== "open" && status !== "closed") {
    return { ok: false, error: "invalid_status" };
  }

  try {
    const supabase = await createClient();

    // RLS restricts this UPDATE to rows owned by the current user.
    const { data, error } = await supabase
      .from("polls")
      .update({ status })
      .eq("slug", slug)
      .select("slug")
      .maybeSingle();

    if (error) return { ok: false, error: "generic" };
    if (!data) return { ok: false, error: "forbidden" };

    revalidatePath(`/p/${slug}`);
    revalidatePath("/polls");
    return { ok: true, data: { status } };
  } catch (error) {
    console.error("[setPollStatusAction]", error);
    return { ok: false, error: "generic" };
  }
}

export async function deletePollAction(
  slug: string,
): Promise<ActionResult<null, "forbidden" | "generic">> {
  try {
    const supabase = await createClient();

    // RLS restricts this DELETE to rows owned by the current user.
    const { data, error } = await supabase
      .from("polls")
      .delete()
      .eq("slug", slug)
      .select("slug")
      .maybeSingle();

    if (error) return { ok: false, error: "generic" };
    if (!data) return { ok: false, error: "forbidden" };

    revalidatePath("/polls");
    return { ok: true, data: null };
  } catch (error) {
    console.error("[deletePollAction]", error);
    return { ok: false, error: "generic" };
  }
}
