"use client";

import { useState } from "react";
import { locales } from "@/lib/i18n";
import { useLang } from "./LanguageProvider";

export default function LangSwitcher({ inline = false }: { inline?: boolean }) {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = locales.find((l) => l.code === locale) ?? locales[0];

  // Inside the mobile sheet a dropdown has nowhere to drop: it opens below the
  // fold and fights the sheet for stacking order. A row of codes has neither
  // problem and is easier to hit with a thumb.
  if (inline) {
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label="Language">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={l.code === locale}
            className={`mono rounded-[var(--r)] border px-2.5 py-1.5 text-[13px] transition-colors ${
              l.code === locale
                ? "border-ink bg-ink text-ink-inv"
                : "border-line-strong text-ink-2 hover:text-ink"
            }`}
          >
            {l.short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="mono text-[13px] tracking-wide text-ink-2 transition-colors hover:text-ink"
      >
        {current.short}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close language menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-[var(--r-lg)] border border-line bg-surface py-1 shadow-[var(--shadow-window)]"
          >
            {locales.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === locale}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-[14px] transition-colors hover:bg-paper-sunk ${
                    l.code === locale ? "text-ink" : "text-ink-2"
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="mono text-[11px] text-ink-3">{l.short}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
