"use client";

import type { ReactNode } from "react";
import Reveal from "./Reveal";

/* The page's one section shape, taken from the reference: a small plain kicker,
   one display headline at the same size everywhere, one short lead, then the
   canvas, then the captions that read underneath it. */

export function Captions({
  items,
  cols = "sm:grid-cols-2",
}: {
  items: { title: string; desc?: string }[];
  cols?: string;
}) {
  return (
    <div className={`mt-10 grid border-t border-line ${cols}`}>
      {items.map((it) => (
        <div
          key={it.title}
          className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:pl-6 sm:pr-6 sm:first:border-l-0 sm:first:pl-0"
        >
          <p className="label">{it.title}</p>
          {it.desc && (
            <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-ink-2">{it.desc}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CanvasSection({
  id,
  kicker,
  title,
  sub,
  children,
  captions,
  after,
}: {
  id?: string;
  kicker: string;
  title: string;
  sub?: string;
  children: ReactNode;
  captions?: ReactNode;
  after?: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="kicker">{kicker}</p>
          <h2 className="display mx-auto mt-4 max-w-[20ch]">{title}</h2>
          {sub && <p className="lead mx-auto mt-6 max-w-[52ch]">{sub}</p>}
        </Reveal>

        <Reveal variant="soft" className="mt-14">
          {children}
          {captions}
        </Reveal>

        {after}
      </div>
    </section>
  );
}
