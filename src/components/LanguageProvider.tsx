"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, messages, type LocaleCode, type Messages } from "@/lib/i18n";

const STORAGE_KEY = "mochi-lang";

interface LangValue {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  m: Messages;
}

const LangContext = createContext<LangValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  m: messages[DEFAULT_LOCALE],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  // Resolve the locale on mount from ?lang= first, then the stored preference.
  // The URL wins so a shared /?lang=vi link renders Vietnamese even for a visitor
  // whose last visit picked something else -- those are the URLs advertised by
  // the hreflang alternates in layout.tsx and by sitemap.ts.
  // We intentionally start from DEFAULT_LOCALE on the server + first client render
  // to avoid a hydration mismatch, then sync.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const stored = localStorage.getItem(STORAGE_KEY);
    const next = [fromUrl, stored].find(
      (l): l is LocaleCode => !!l && l in messages,
    );
    if (!next) return;

    // An explicit ?lang= is a choice, so remember it for the next visit.
    if (next === fromUrl) localStorage.setItem(STORAGE_KEY, next);
    if (next === DEFAULT_LOCALE) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from external stores (URL + localStorage)
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const setLocale = (l: LocaleCode) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  return (
    <LangContext.Provider value={{ locale, setLocale, m: messages[locale] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
