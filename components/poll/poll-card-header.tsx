"use client";

import { useI18n } from "@/components/i18n-provider";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PollCardHeaderProps {
  question: string;
  isOwner: boolean;
}

export function PollCardHeader({ question, isOwner }: PollCardHeaderProps) {
  const { dict } = useI18n();

  return (
    <CardHeader>
      <CardTitle className="font-heading text-2xl leading-snug text-balance sm:text-3xl">
        {question}
      </CardTitle>
      <CardDescription>
        {isOwner ? dict.poll.ownerDescription : dict.poll.participantDescription}
      </CardDescription>
    </CardHeader>
  );
}
