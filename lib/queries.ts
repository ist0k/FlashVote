import { createClient } from "@/lib/supabase/server";
import type { PollDetail, PollRowNested } from "@/lib/types/poll";

function isPollExpired(row: Pick<PollRowNested, "expires_at">): boolean {
  return row.expires_at !== null && new Date(row.expires_at).getTime() <= Date.now();
}

export function mapPollRow(row: PollRowNested): PollDetail {
  const options = (row.poll_options ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((option) => ({
      id: option.id,
      label: option.label,
      position: option.position,
      voteCount: option.poll_results?.[0]?.vote_count ?? 0,
    }));

  const isExpired = isPollExpired(row);

  return {
    id: row.id,
    slug: row.slug,
    question: row.question,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    ownerId: row.owner_id,
    isExpired,
    isOpen: row.status === "open" && !isExpired,
    options,
    totalVotes: options.reduce((sum, option) => sum + option.voteCount, 0),
  };
}

const POLL_SELECT = "*, poll_options(id, label, position, poll_results(vote_count))";

/** Loads a poll with its options and vote tallies. Returns null when not found. */
export async function getPollBySlug(slug: string): Promise<PollDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("polls")
    .select(POLL_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return mapPollRow(data as PollRowNested);
}

/** Returns the current viewer's vote for a poll, if any. */
export async function getViewerVote(
  pollId: string,
): Promise<{ optionId: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votes")
    .select("option_id")
    .eq("poll_id", pollId)
    .maybeSingle();

  if (error) {
    // Unauthenticated viewers simply have no visible votes.
    if (error.code === "PGRST301") return null;
    throw new Error(error.message);
  }

  return data ? { optionId: data.option_id } : null;
}

export interface OwnedPollSummary {
  id: string;
  slug: string;
  question: string;
  status: "open" | "closed";
  expiresAt: string | null;
  isExpired: boolean;
  createdAt: string;
  totalVotes: number;
}

/**
 * Lists votes owned by the current session (most recent first).
 * The filter is explicit because the public-read RLS policy on `polls`
 * intentionally allows everyone to open shared links.
 */
export async function getOwnedPolls(): Promise<OwnedPollSummary[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("polls")
    .select("id, slug, question, status, expires_at, created_at, poll_results(vote_count)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const isExpired =
      row.expires_at !== null && new Date(row.expires_at).getTime() <= Date.now();

    return {
      id: row.id,
      slug: row.slug,
      question: row.question,
      status: row.status,
      expiresAt: row.expires_at,
      isExpired,
      createdAt: row.created_at,
      totalVotes:
        row.poll_results?.reduce((sum, result) => sum + result.vote_count, 0) ?? 0,
    };
  });
}
