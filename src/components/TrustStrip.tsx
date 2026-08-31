"use client";

import { Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { useLang } from "./LanguageProvider";

/** The three claims that used to sit inside the hero. Pulled out so the hero
 *  stays a single moment, and given a band of its own directly beneath it. */
const ICONS = [Lock, RefreshCw, ShieldCheck];

export default function TrustStrip() {
  const { m } = useLang();
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-9 sm:grid-cols-3">
        {m.hero.trust.map((t, i) => {
          const Icon = ICONS[i];
          return (
            <div key={t.title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" />
              <div>
                <p className="text-[13px] font-semibold text-foreground">{t.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
