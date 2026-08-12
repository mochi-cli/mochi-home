"use client";

import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { locales } from "@/lib/i18n";
import { useLang } from "./LanguageProvider";

export default function LangSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = locales.find((l) => l.code === locale) ?? locales[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        {current.short}
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
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
            className="absolute right-0 z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-lg"
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
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-secondary ${
                    l.code === locale ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="mono text-[10px] text-muted-foreground">{l.short}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
