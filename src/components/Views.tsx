"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "./LanguageProvider";
import CanvasSection from "./CanvasSection";

const SHOTS = [
  { src: "/product/view-kanban-status.png", alt: "Mochi kanban board: leads grouped by pipeline status, with a detail panel open" },
  { src: "/product/view-calendar.png", alt: "Mochi calendar view: orders plotted by order date across the month" },
  { src: "/product/view-gallery.png", alt: "Mochi gallery view: product cards with cover photos, pricing, and descriptions" },
  { src: "/product/view-grid-grouped.png", alt: "Mochi grid view: tasks grouped by priority with status and owner columns" },
  { src: "/product/view-chart.png", alt: "Mochi bar chart: lead count by source, computed from the same records" },
];

const AUTO_MS = 4500;

/** Five views of one dataset. Same shape as every other section: one canvas,
 *  with the captions underneath doubling as the switch. */
export default function Views() {
  const { m } = useLang();
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => (prev + 1) % SHOTS.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [active]);

  return (
    <CanvasSection
      kicker={m.eyebrow.views}
      title={m.views.title}
      sub={m.views.sub}
      captions={
        <div
          role="tablist"
          aria-label="Views"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-5"
        >
          {SHOTS.map((shot, i) => {
            const isActive = i === active;
            return (
              <button
                key={shot.src}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className="group relative border-b border-line py-5 text-left sm:border-b-0 sm:border-l sm:pl-5 sm:pr-5 sm:first:border-l-0 sm:first:pl-0"
              >
                <span className={`block text-[15px] leading-snug transition-colors ${isActive ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>
                  {m.views.shots[i]}
                </span>
                <span className="absolute inset-x-0 -top-px h-px overflow-hidden sm:left-5 sm:right-5 sm:first:left-0" aria-hidden>
                  {isActive && <span key={active} className="animate-tabgrow block h-full origin-left bg-ink" />}
                </span>
              </button>
            );
          })}
        </div>
      }
    >
      <div className="canvas">
        <Image
          key={SHOTS[active].src}
          src={SHOTS[active].src}
          alt={SHOTS[active].alt}
          width={1280}
          height={900}
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="block h-auto w-full animate-in fade-in duration-500"
        />
      </div>
    </CanvasSection>
  );
}
