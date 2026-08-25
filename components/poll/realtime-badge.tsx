"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/components/i18n-provider";
import type { RealtimeStatus } from "@/components/poll/use-poll-realtime";
import { cn } from "@/lib/utils";

export function RealtimeBadge({ status }: { status: RealtimeStatus }) {
  const { dict } = useI18n();

  const config = {
    connecting: {
      label: dict.realtime.connecting,
      detail: dict.realtime.connectingDetail,
      dotClassName: "bg-yellow-500",
    },
    live: {
      label: dict.realtime.live,
      detail: dict.realtime.liveDetail,
      dotClassName: "bg-emerald-500 animate-pulse",
    },
    reconnecting: {
      label: dict.realtime.reconnecting,
      detail: dict.realtime.reconnectingDetail,
      dotClassName: "bg-amber-500 animate-pulse",
    },
    offline: {
      label: dict.realtime.offline,
      detail: dict.realtime.offlineDetail,
      dotClassName: "bg-red-500",
    },
  }[status];

  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${dict.realtime.ariaLabel}: ${config.label}. ${config.detail}`}
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
