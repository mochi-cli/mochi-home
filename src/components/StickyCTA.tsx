"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LanguageProvider";
import { useDownloadHref } from "@/lib/useDownloadHref";

/** The hero holds the download button, and everything below it is argument, so
 *  once the hero scrolls away there is no way to act until the closing block.
 *  This bar covers that gap. One IntersectionObserver rather than a scroll
 *  listener, so nothing runs per frame. */
export default function StickyCTA() {
  const { m } = useLang();
  const { href: downloadHref } = useDownloadHref();
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const shown = !heroVisible;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 backdrop-blur-md transition-transform duration-300 ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-5 py-3 sm:px-8">
        <p className="hidden min-w-0 flex-1 truncate text-[14px] text-ink-2 sm:block">
          {m.footer.tagline}
        </p>
        <a
          href={downloadHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-full items-center justify-center rounded-[var(--r)] bg-ink px-5 text-[14px] text-ink-inv transition-opacity hover:opacity-88 active:translate-y-px sm:h-9 sm:w-auto sm:flex-none"
        >
          {m.hero.download}
        </a>
      </div>
    </div>
  );
}
