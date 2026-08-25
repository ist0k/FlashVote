export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const LOCALE_STORAGE_KEY = "flashvote.locale";

export const DEFAULT_LOCALE: Locale = "en";

/** RFC 5646 language tags we can resolve, everything else falls back to en. */
export function normalizeLocale(tag: string | null | undefined): Locale | null {
  if (!tag) return null;
  const lower = tag.toLowerCase();
  if (lower.startsWith("ru")) return "ru";
  if (lower.startsWith("en")) return "en";
  return null;
}

/** Resolves the initial locale: stored preference, then system, then default. */
export function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const fromStorage = normalizeLocale(stored);
    if (fromStorage) return fromStorage;
  } catch {
    // Storage unavailable (private mode etc.) — fall through to system.
  }

  for (const candidate of window.navigator.languages ?? []) {
    const match = normalizeLocale(candidate);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}
