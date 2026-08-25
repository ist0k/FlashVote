"use client";

import { useCallback, useMemo, useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

import { RealtimeBadge } from "@/components/poll/realtime-badge";
import { ResultsChart } from "@/components/poll/results-chart";
import { usePollRealtime } from "@/components/poll/use-poll-realtime";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rpcErrorMessage, toUserErrorMessage } from "@/lib/errors";
import { createClient } from "@/lib/supabase/client";
import type { PollDetail, PollStatus } from "@/lib/types/poll";

export interface PollViewProps {
  poll: PollDetail;
  viewerVotedOptionId: string | null;
}

/** Ensures the browser has a stable anonymous identity before voting. */
async function ensureAnonSession(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  }
}

export function PollView({ poll: initialPoll, viewerVotedOptionId }: PollViewProps) {
  const [status, setStatus] = useState<PollStatus>(initialPoll.status);
  const [isExpired, setIsExpired] = useState(initialPoll.isExpired);
  const [options, setOptions] = useState(initialPoll.options);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(
    viewerVotedOptionId,
  );
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);

  const isOpen = status === "open" && !isExpired;
  const hasVoted = votedOptionId !== null;

  /** Refetches authoritative poll state and reconciles local UI state. */
  const reconcile = useCallback(async () => {
    const supabase = createClient();
    try {
      const [pollResult, resultsResult] = await Promise.all([
        supabase
          .from("polls")
          .select("status, expires_at")
          .eq("id", initialPoll.id)
          .maybeSingle(),
        supabase
          .from("poll_results")
          .select("option_id, vote_count")
          .eq("poll_id", initialPoll.id),
      ]);

      if (pollResult.data) {
        setStatus(pollResult.data.status);
        setIsExpired(
          pollResult.data.expires_at !== null &&
            new Date(pollResult.data.expires_at).getTime() <= Date.now(),
        );
      }

      if (resultsResult.data) {
        const counts = new Map(
          resultsResult.data.map((row) => [row.option_id, row.vote_count]),
        );
        setOptions((current) =>
          current.map((option) => ({
            ...option,
            voteCount: counts.get(option.id) ?? option.voteCount,
          })),
        );
      }
    } catch (error) {
      console.error("[reconcile]", error);
    }
  }, [initialPoll.id]);

  const realtimeStatus = usePollRealtime({
    pollId: initialPoll.id,
    onChange: reconcile,
  });

  async function handleVote(optionId: string) {
    if (pendingOptionId !== null) return;
    setPendingOptionId(optionId);

    const supabase = createClient();
    try {
      await ensureAnonSession();

      const { data, error } = await supabase.rpc("cast_vote", {
        p_slug: initialPoll.slug,
        p_option_id: optionId,
      });

      if (error) {
        const message = rpcErrorMessage(error.message);
        if (message) {
          toast.error(message);
          // Our client state may be stale (e.g. the vote landed earlier).
          void reconcile();
        } else {
          toast.error(toUserErrorMessage(error));
        }
        return;
      }

      const counts = (data as { counts?: Record<string, number> } | null)?.counts;

      setOptions((current) =>
        current.map((option) => ({
          ...option,
          voteCount:
            counts && option.id in counts
              ? (counts[option.id] as number)
              : option.voteCount + (option.id === optionId ? 1 : 0),
        })),
      );
      setVotedOptionId(optionId);
      toast.success("Vote counted!");
    } catch (error) {
      toast.error(toUserErrorMessage(error));
    } finally {
      setPendingOptionId(null);
    }
  }

  const totalVotes = useMemo(
    () => options.reduce((sum, option) => sum + option.voteCount, 0),
    [options],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isOpen ? "secondary" : "outline"}>
          {status === "closed" ? "Closed" : isExpired ? "Expired" : "Open"}
        </Badge>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        </span>
        <RealtimeBadge status={realtimeStatus} />
      </div>

      {!isOpen ? (
        <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          This poll is no longer accepting votes.
        </p>
      ) : hasVoted ? (
        <p className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-4 shrink-0 text-primary" aria-hidden />
          Vote submitted — results update live below.
        </p>
      ) : (
        <fieldset className="flex flex-col gap-2" aria-label="Vote options">
          <legend className="sr-only">Choose an option to vote</legend>
          {options.map((option) => {
            const isOwnChoice = option.id === votedOptionId;
            const isPending = pendingOptionId === option.id;
            return (
              <Button
                key={option.id}
                variant={isOwnChoice ? "default" : "outline"}
                size="lg"
                className="h-auto w-full justify-start px-4 py-3 text-left whitespace-normal"
                disabled={!isOpen || pendingOptionId !== null}
                onClick={() => void handleVote(option.id)}
              >
                {isPending ? "Voting…" : option.label}
              </Button>
            );
          })}
        </fieldset>
      )}

      <section aria-labelledby="results-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 id="results-heading" className="text-sm font-medium text-muted-foreground">
            Live results
          </h2>
        </div>
        <ResultsChart options={options} totalVotes={totalVotes} />
      </section>

      {hasVoted ? (
        <p className="sr-only">
          You voted for{" "}
          {options.find((option) => option.id === votedOptionId)?.label ?? "an option"}.
        </p>
      ) : null}
    </div>
  );
}
