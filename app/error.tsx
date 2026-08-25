"use client";

import { useEffect } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useI18n();

  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl animate-in fade-in flex-col items-center gap-6 px-4 py-24 text-center duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">{dict.error.title}</h1>
        <p className="text-muted-foreground">{dict.error.text}</p>
      </div>
      <Button onClick={reset}>{dict.error.retry}</Button>
    </div>
  );
}
