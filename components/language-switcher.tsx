"use client";

import { useTransition } from "react";
import { LanguagesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/components/i18n-provider";
import { locales, type Locale } from "@/lib/i18n/config";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    startTransition(() => setLocale(next));
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex items-center gap-0.5 rounded-lg border p-0.5"
          role="group"
          aria-label="Language"
        >
          <LanguagesIcon className="mx-1 size-3.5 text-muted-foreground" aria-hidden />
          {locales.map((code) => (
            <Button
              key={code}
              variant={locale === code ? "secondary" : "ghost"}
              size="xs"
              className="px-1.5 font-mono text-[11px]"
              aria-pressed={locale === code}
              disabled={isPending}
              onClick={() => switchLocale(code)}
            >
              {LOCALE_LABELS[code]}
            </Button>
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent>Language / Язык</TooltipContent>
    </Tooltip>
  );
}
