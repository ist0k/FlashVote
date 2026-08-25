"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
