"use client";

import { useCallback, useMemo, useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

import { RealtimeBadge } from "@/components/poll/realtime-badge";
import { ResultsChart } from "@/components/poll/results-chart";
import { usePollRealtime } from "@/components/poll/use-poll-realtime";
import { useI18n } from "@/components/i18n-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rpcErrorKey, toUserErrorMessage } from "@/lib/errors";
import { pluralVotes } from "@/lib/i18n/dictionaries";
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
  const { dict, locale } = useI18n();
  const [status, setStatus] = useState<PollStatus>(initialPoll.status);
  const [isExpired, setIsExpired] = useState(initialPoll.isExpired);
  const [options, setOptions] = useState(initialPoll.options);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(
    viewerVotedOptionId,
  );
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  const [isChangingVote, setIsChangingVote] = useState(false);

  const isOpen = status === "open" && !isExpired;
  const hasVoted = votedOptionId !== null;
  const showVoteButtons = !hasVoted || isChangingVote;

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

  async function submitChoice(optionId: string) {
    if (pendingOptionId !== null) return;
    setPendingOptionId(optionId);

    const supabase = createClient();
    try {
      await ensureAnonSession();

      // First choice uses cast_vote; a re-selection while changing uses
      // change_vote, which moves the existing vote between counters.
      const rpcName =
        hasVoted && isChangingVote ? "change_vote" : "cast_vote";

      const { data, error } = await supabase.rpc(rpcName, {
        p_slug: initialPoll.slug,
        p_option_id: optionId,
      });

      if (error) {
        const key = rpcErrorKey(error.message);
        if (key === "not_authenticated") {
          toast.error(dict.poll.voteErrors.session_expired);
          void reconcile();
        } else if (key && key in dict.poll.voteErrors) {
          toast.error(
            dict.poll.voteErrors[key as keyof typeof dict.poll.voteErrors],
          );
          void reconcile();
        } else {
          toast.error(toUserErrorMessage(error));
        }
        return;
      }

      const counts = (
        data as { counts?: Record<string, number>; changed?: boolean } | null
      )?.counts;

      setOptions((current) =>
        current.map((option) => ({
          ...option,
          voteCount:
            counts && option.id in counts
              ? (counts[option.id] as number)
              : option.voteCount +
                (option.id === optionId ? 1 : 0) -
                (!isChangingVote && hasVoted && option.id === votedOptionId ? 1 : 0),
        })),
      );
      setVotedOptionId(optionId);
      setIsChangingVote(false);
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
          {status === "closed"
            ? dict.poll.statusClosed
            : isExpired
              ? dict.poll.statusExpired
              : dict.poll.statusOpen}
        </Badge>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {totalVotes} {pluralVotes(locale, totalVotes)}
        </span>
        <RealtimeBadge status={realtimeStatus} />
      </div>

      {!isOpen ? (
        <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {dict.poll.closedNotice}
        </p>
      ) : showVoteButtons ? (
        <fieldset className="flex flex-col gap-2" aria-label={dict.poll.voteFieldsetSr}>
          <legend className="sr-only">{dict.poll.voteFieldsetSr}</legend>
          {options.map((option) => {
            const isCurrentChoice = option.id === votedOptionId;
            return (
              <Button
                key={option.id}
                variant={isChangingVote && isCurrentChoice ? "default" : "outline"}
                size="lg"
                className="h-auto w-full justify-start px-4 py-3 text-left whitespace-normal break-words transition-all duration-150 hover:-translate-y-px hover:border-primary/40 hover:bg-accent/50 active:translate-y-0 active:scale-[0.99]"
                disabled={!isOpen || pendingOptionId !== null}
                onClick={() => void submitChoice(option.id)}
              >
                {pendingOptionId === option.id
                  ? dict.poll.voting
                  : isChangingVote && isCurrentChoice
                    ? `${option.label} ✓`
                    : option.label}
              </Button>
            );
          })}
          {isChangingVote ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChangingVote(false)}
              disabled={pendingOptionId !== null}
            >
              {dict.manage.cancel}
            </Button>
          ) : null}
        </fieldset>
      ) : (
        <div className="flex animate-in fade-in slide-in-from-bottom-1 flex-col gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground duration-300 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 shrink-0 text-primary" aria-hidden />
            {dict.poll.votedNotice}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 transition-transform duration-150 hover:-translate-y-px"
            onClick={() => setIsChangingVote(true)}
          >
            {dict.poll.changeVote}
          </Button>
        </div>
      )}

      <section aria-labelledby="results-heading" className="flex flex-col gap-3">
        <h2 id="results-heading" className="text-sm font-medium text-muted-foreground">
          {dict.poll.resultsHeading}
        </h2>
        <ResultsChart options={options} totalVotes={totalVotes} />
      </section>

      {hasVoted && votedOptionId ? (
        <p className="sr-only">
          {dict.poll.youVotedForSr}{" "}
          {options.find((option) => option.id === votedOptionId)?.label}
        </p>
      ) : null}
    </div>
  );
}
