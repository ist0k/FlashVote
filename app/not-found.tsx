"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { dict } = useI18n();

  return (
    <div className="mx-auto flex w-full max-w-2xl animate-in fade-in flex-col items-center gap-6 px-4 py-24 text-center duration-500">
      <p className="font-heading text-7xl font-bold text-muted-foreground/40">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">{dict.notFound.title}</h1>
        <p className="max-w-md text-muted-foreground">{dict.notFound.text}</p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">{dict.notFound.cta}</Link>
      </Button>
    </div>
  );
}
