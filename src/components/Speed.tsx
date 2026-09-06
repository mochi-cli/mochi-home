"use client";

import { useLang } from "./LanguageProvider";
import CanvasSection, { Captions } from "./CanvasSection";

/* The measured claims: how little it weighs, how fast it answers, and how
   cheaply an agent can talk to it. Every number here comes from the app repo's
   own benchmark run, so the canvas is written as a measurement sheet: the test
   conditions across the top, the readings underneath. */

/* Values arrive as "14 ms", "0,3 giây", "0.3 秒" or a bare "0". Splitting on the
   last space lets the unit sit in the secondary display colour the way the
   two-tone headlines do, and leaves a unit-less value whole. */
function Reading({ value }: { value: string }) {
  const cut = value.lastIndexOf(" ");
  if (cut === -1) return <span className="display-sm">{value}</span>;
  return (
    <span className="display-sm">
      {value.slice(0, cut)}
      <span className="cont"> {value.slice(cut + 1)}</span>
    </span>
  );
}

export default function Speed() {
  const { m } = useLang();

  return (
    <CanvasSection
      id="speed"
      kicker={m.eyebrow.speed}
      title={m.speed.title}
      sub={m.speed.sub}
      captions={<Captions items={m.speed.points} />}
    >
      <div className="canvas">
        <p className="border-b border-line px-5 py-3 text-[13px] leading-relaxed text-ink-3 sm:px-8">
          {m.speed.note}
        </p>

        <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {m.speed.stats.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-7 sm:px-8 sm:py-8">
              <Reading value={s.value} />
              <p className="mt-3 max-w-[18ch] text-[14px] leading-relaxed text-ink-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </CanvasSection>
  );
}
