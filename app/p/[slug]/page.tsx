import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

import { ManagePanel } from "@/components/poll/manage-panel";
import { PollCardHeader } from "@/components/poll/poll-card-header";
import { PollView } from "@/components/poll/poll-view";
import { getPollBySlug, getViewerVote } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

interface PollPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PollPageProps): Promise<Metadata> {
  const { slug } = await params;
  const poll = await getPollBySlug(slug);
  if (!poll) return { title: "404" };
  return { title: poll.question, description: "Vote in this poll on FlashVote." };
}

export default async function PollPage({ params }: PollPageProps) {
  const { slug } = await params;
  const poll = await getPollBySlug(slug);

  if (!poll) notFound();

  const supabase = await createClient();
  const [viewerVote, viewer] = await Promise.all([
    getViewerVote(poll.id),
    supabase.auth.getUser(),
  ]);

  const isOwner = viewer.data.user?.id === poll.ownerId;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <PollCardHeader question={poll.question} isOwner={isOwner} />
        <CardContent>
          <PollView poll={poll} viewerVotedOptionId={viewerVote?.optionId ?? null} />
        </CardContent>
      </Card>

      {isOwner ? <ManagePanel slug={poll.slug} status={poll.status} /> : null}
    </div>
  );
}
