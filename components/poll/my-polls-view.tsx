"use client";

import Link from "next/link";
import { BarChart3Icon, PlusIcon } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pluralVotes } from "@/lib/i18n/dictionaries";
import type { OwnedPollSummary } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";

interface MyPollsViewProps {
  polls: OwnedPollSummary[];
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru" : "en", {
    dateStyle: "medium",
  }).format(new Date(iso));
}

function PollCard({ poll, locale }: { poll: OwnedPollSummary; locale: Locale }) {
  const { dict } = useI18n();
  const isOpenNow = poll.status === "open" && !poll.isExpired;

  return (
    <li>
      <Link
        href={`/p/${poll.slug}`}
        className="block rounded-xl outline-none transition-transform duration-150 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base leading-snug break-words text-balance">
              {poll.question}
            </CardTitle>
            <CardDescription>
              {dict.myPolls.created} {formatDate(poll.createdAt, locale)} ·{" "}
              {poll.totalVotes} {pluralVotes(locale, poll.totalVotes)}
              {poll.expiresAt !== null && !poll.isExpired
                ? ` · ${dict.myPolls.expires} ${formatDate(poll.expiresAt, locale)}`
                : ""}
              {poll.isExpired ? ` · ${dict.myPolls.expired}` : ""}
            </CardDescription>
            <CardAction>
              <Badge variant={isOpenNow ? "secondary" : "outline"}>
                {poll.status === "closed"
                  ? dict.poll.statusClosed
                  : poll.isExpired
                    ? dict.poll.statusExpired
                    : dict.poll.statusOpen}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </Link>
    </li>
  );
}

export function MyPollsView({ polls }: MyPollsViewProps) {
  const { dict, locale } = useI18n();

  return (
    <div className="mx-auto flex w-full max-w-2xl animate-in fade-in flex-col gap-6 px-4 py-10 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">{dict.myPolls.title}</h1>
        <Button asChild size="sm">
          <Link href="/">
            <PlusIcon data-icon="inline-start" />
            {dict.myPolls.newPoll}
          </Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-4 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <BarChart3Icon className="size-6 text-muted-foreground" aria-hidden />
          </span>
          <p className="text-muted-foreground">{dict.myPolls.noneYet}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label={dict.myPolls.ariaList}>
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} locale={locale} />
          ))}
        </ul>
      )}
    </div>
  );
}
