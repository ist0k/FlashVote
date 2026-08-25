import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ManagePanel } from "@/components/poll/manage-panel";
import { PollView } from "@/components/poll/poll-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  if (!poll) return { title: "Poll not found" };
  return { title: poll.question, description: "Vote in this poll on PollSync." };
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
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl leading-snug text-balance sm:text-3xl">
            {poll.question}
          </CardTitle>
          <CardDescription>
            {isOwner
              ? "Participants see the voting buttons — you see owner controls below."
              : "Pick an option. Results update in real time."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PollView poll={poll} viewerVotedOptionId={viewerVote?.optionId ?? null} />
        </CardContent>
      </Card>

      {isOwner ? <ManagePanel slug={poll.slug} status={poll.status} /> : null}
    </div>
  );
}
