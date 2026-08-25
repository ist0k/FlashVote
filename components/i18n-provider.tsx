"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";
import {
  LOCALE_STORAGE_KEY,
  resolveInitialLocale,
  type Locale,
} from "@/lib/i18n/config";

const LOCALE_EVENT = "flashvote:locale-change";

function subscribe(callback: () => void): () => void {
  window.addEventListener(LOCALE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LOCALE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Client-side i18n without route prefixes, backed by an external store
 * (localStorage + event) so React reads it without cascading renders.
 * The server snapshot is the default locale; after hydration the stored or
 * system preference applies and switching re-renders text instantly.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    resolveInitialLocale,
    () => "en" as const satisfies Locale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort.
    }
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
