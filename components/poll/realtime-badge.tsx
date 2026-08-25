"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RealtimeStatus } from "@/components/poll/use-poll-realtime";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  RealtimeStatus,
  { label: string; detail: string; dotClassName: string }
> = {
  connecting: {
    label: "Connecting",
    detail: "Establishing a live connection…",
    dotClassName: "bg-yellow-500",
  },
  live: {
    label: "Live",
    detail: "Results update automatically as votes come in.",
    dotClassName: "bg-emerald-500 animate-pulse",
  },
  reconnecting: {
    label: "Reconnecting",
    detail:
      "The live connection dropped. Results will catch up once reconnected.",
    dotClassName: "bg-amber-500 animate-pulse",
  },
  offline: {
    label: "Offline",
    detail:
      "Live updates are paused. Refresh the page to get the latest results.",
    dotClassName: "bg-red-500",
  },
};

export function RealtimeBadge({ status }: { status: RealtimeStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Realtime status: ${config.label}. ${config.detail}`}
      >
        <span
          className={cn("size-2 rounded-full", config.dotClassName)}
          aria-hidden
        />
        {config.label}
      </TooltipTrigger>
      <TooltipContent>{config.detail}</TooltipContent>
    </Tooltip>
  );
}
