"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export type RealtimeStatus = "connecting" | "live" | "reconnecting" | "offline";

interface UsePollRealtimeOptions {
  pollId: string;
  /** Called (debounced) whenever authoritative data likely changed. */
  onChange: () => void | Promise<void>;
}

/**
 * Subscribes to authoritative database changes for one poll and reconciles
 * the client state:
 * - debounces bursts of vote events into a single refetch;
 * - treats every reconnect as a signal to resync (missed/duplicate events are
 *   tolerated because we refetch state instead of applying deltas);
 * - resyncs when the tab becomes visible again.
 */
export function usePollRealtime({ pollId, onChange }: UsePollRealtimeOptions) {
  const [status, setStatus] = useState<RealtimeStatus>("connecting");
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const debouncedChange = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestSync = useCallback(() => {
    if (debouncedChange.current !== null) {
      clearTimeout(debouncedChange.current);
    }
    debouncedChange.current = setTimeout(() => {
      debouncedChange.current = null;
      void onChangeRef.current();
    }, 150);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`poll:${pollId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "poll_results",
          filter: `poll_id=eq.${pollId}`,
        },
        requestSync,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "polls",
          filter: `id=eq.${pollId}`,
        },
        requestSync,
      )
      .subscribe((channelStatus) => {
        switch (channelStatus) {
          case "SUBSCRIBED":
            // A fresh subscription may have missed events while offline.
            setStatus("live");
            requestSync();
            break;
          case "CHANNEL_ERROR":
          case "TIMED_OUT":
            setStatus("reconnecting");
            break;
          case "CLOSED":
            setStatus("offline");
            break;
        }
      });

    return () => {
      if (debouncedChange.current !== null) {
        clearTimeout(debouncedChange.current);
      }
      void supabase.removeChannel(channel);
    };
  }, [pollId, requestSync]);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        requestSync();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [requestSync]);

  return status;
}
