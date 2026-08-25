import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3Icon, PlusIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOwnedPolls, type OwnedPollSummary } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My polls" };

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

function PollCard({ poll }: { poll: OwnedPollSummary }) {
  const isExpired = poll.isExpired;

  return (
    <li>
      <Link
        href={`/p/${poll.slug}`}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base leading-snug text-balance">
              {poll.question}
            </CardTitle>
            <CardDescription>
              Created {formatDate(poll.createdAt)} · {poll.totalVotes}{" "}
              {poll.totalVotes === 1 ? "vote" : "votes"}
              {poll.expiresAt !== null && !isExpired
                ? ` · expires ${formatDate(poll.expiresAt)}`
                : ""}
              {isExpired ? " · expired" : ""}
            </CardDescription>
            <CardAction>
              <Badge variant={poll.status === "open" && !isExpired ? "secondary" : "outline"}>
                {poll.status === "closed" ? "Closed" : isExpired ? "Expired" : "Open"}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </Link>
    </li>
  );
}

export default async function MyPollsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center">
        <BarChart3Icon className="size-10 text-muted-foreground" aria-hidden />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold">No polls yet</h1>
          <p className="text-muted-foreground">
            Polls you create in this browser will show up here.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/">
            <PlusIcon data-icon="inline-start" />
            Create your first poll
          </Link>
        </Button>
      </div>
    );
  }

  const polls = await getOwnedPolls();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">My polls</h1>
        <Button asChild size="sm">
          <Link href="/">
            <PlusIcon data-icon="inline-start" />
            New poll
          </Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-12 text-center text-muted-foreground">
          You have not created any polls yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Your polls">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </ul>
      )}
    </div>
  );
}
