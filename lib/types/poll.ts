import type { Enums } from "@/lib/types/database";

export type PollStatus = Enums["poll_status"];

export interface PollOptionWithVotes {
  id: string;
  label: string;
  position: number;
  voteCount: number;
}

export interface PollDetail {
  id: string;
  slug: string;
  question: string;
  status: PollStatus;
  expiresAt: string | null;
  createdAt: string;
  ownerId: string;
  /** True when status is "closed" or the expiry deadline has passed. */
  isOpen: boolean;
  isExpired: boolean;
  options: PollOptionWithVotes[];
  totalVotes: number;
}

/** Row shape returned by the nested Supabase select in getPollBySlug. */
export interface PollRowNested {
  id: string;
  slug: string;
  question: string;
  status: PollStatus;
  expires_at: string | null;
  created_at: string;
  owner_id: string;
  poll_options: Array<{
    id: string;
    label: string;
    position: number;
    poll_results: Array<{ vote_count: number }> | null;
  }> | null;
}
