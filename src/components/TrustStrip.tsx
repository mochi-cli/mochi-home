"use client";

import { useLang } from "./LanguageProvider";

/** Three claims, set as a thin band directly under the hero canvas. No icons
 *  and no card: at this size the vertical rules carry the grouping, and the
 *  band's job is to be read in one pass on the way down the page. */
export default function TrustStrip() {
  const { m } = useLang();
  return (
    <section className="mx-auto mt-20 max-w-[1280px] px-5 sm:mt-24 sm:px-8">
      <div className="grid border-t border-line sm:grid-cols-3">
        {m.hero.trust.map((t) => (
          <div
            key={t.title}
            className="border-b border-line py-6 sm:border-b-0 sm:border-l sm:py-7 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
          >
            <p className="label">{t.title}</p>
            <p className="mt-1.5 max-w-[34ch] text-[15px] leading-relaxed text-ink-2">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
