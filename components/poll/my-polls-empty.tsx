"use client";

import Link from "next/link";
import { BarChart3Icon, PlusIcon } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

/** Empty state for visitors without an anonymous session yet. */
export function MyPollsEmpty() {
  const { dict } = useI18n();

  return (
    <div className="mx-auto flex w-full max-w-2xl animate-in fade-in flex-col items-center gap-6 px-4 py-20 text-center duration-500">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <BarChart3Icon className="size-6 text-muted-foreground" aria-hidden />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">{dict.myPolls.emptyTitle}</h1>
        <p className="text-muted-foreground">{dict.myPolls.emptyText}</p>
        <p className="text-xs text-muted-foreground/80">{dict.myPolls.hint}</p>
      </div>
      <Button asChild size="lg">
        <Link href="/">
          <PlusIcon data-icon="inline-start" />
          {dict.myPolls.createFirst}
        </Link>
      </Button>
    </div>
  );
}
