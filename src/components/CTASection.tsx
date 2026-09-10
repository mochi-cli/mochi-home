"use client";

import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { useDownloadHref } from "@/lib/useDownloadHref";

/** The closing block. This is the page's one inversion: the final ask and the
 *  footer share a single ink slab, so the light-locked page ends on a deliberate
 *  full-width switch rather than alternating bands on the way down. */
export default function CTASection() {
  const { m } = useLang();
  const { href: downloadHref } = useDownloadHref();

  return (
    <section className="on-ink pb-10 pt-28 md:pb-14 md:pt-36">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <h2 className="display max-w-[16ch]">{m.cta.title}</h2>
          <p className="lead mt-6 max-w-[48ch]">{m.cta.sub}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-[var(--r)] bg-ink px-6 text-[15px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px"
            >
              {m.hero.download}
            </a>
            <a
              href="/docs"
              className="text-[15px] text-ink underline-offset-4 transition-colors hover:text-ink-2 hover:underline"
            >
              {m.nav.docs}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
