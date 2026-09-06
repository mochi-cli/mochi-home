"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ProductPreview, { DEALS, type Deal } from "./ProductPreview";

/* ── the demo script ───────────────────────────────────────────────────────────
   One loop of "agent runs a tool → the table changes". Every beat is a full
   snapshot, so the loop can restart from any point without accumulating state.
   Row data is the real seeded Deals table, so the write beat lands on exactly
   the 5 rows that exist in the live workspace. */

const BASE_ROWS: Deal[] = DEALS.slice(0, 4);
const ALL_ROWS: Deal[] = DEALS;
const RICH_ROWS: Deal[] = DEALS.filter((d) => d.value > 30000);

const TERM: string[][] = [
  [],
  ["> create record in Deals", "● Ran 1 command", "└ create-records"],
  ["> create record in Deals", "● Ran 1 command", "└ create-records", "✓ 1 row written", "· 0.9s · ↓ 640 tokens"],
  ["> filter Deals where Value > 30000", "● Ran 1 command", "└ configure-view"],
  ["> filter Deals where Value > 30000", "● Ran 1 command", "└ configure-view", "✓ 3 of 5 rows match", "· 0.6s · ↓ 410 tokens"],
];

type Beat = {
  term: number;
  rows: Deal[];
  hi: string | null;
  filter: string | null;
  writing?: boolean;
  ms: number;
};

const BEATS: Beat[] = [
  { term: 0, rows: BASE_ROWS, hi: null, filter: null, ms: 2000 },
  { term: 0, rows: BASE_ROWS, hi: null, filter: null, ms: 1700 },
  { term: 1, rows: BASE_ROWS, hi: null, filter: null, writing: true, ms: 1400 },
  { term: 2, rows: ALL_ROWS, hi: "Northstar Robotics", filter: null, ms: 2600 },
  { term: 2, rows: ALL_ROWS, hi: null, filter: null, ms: 1700 },
  { term: 3, rows: ALL_ROWS, hi: null, filter: null, ms: 1300 },
  { term: 4, rows: RICH_ROWS, hi: null, filter: "Value > $30,000", ms: 3200 },
];

/** macOS-style traffic lights, shared by every window on the stage */
function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function Window({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_18px_50px_rgba(23,25,60,0.16)] ${
        dark ? "border-white/10 bg-[#16181d]" : "border-border bg-card"
      } ${className}`}
    >
      <div className={`flex h-8 items-center px-3 ${dark ? "bg-white/5" : "bg-secondary/70"}`}>
        <TrafficLights />
      </div>
      {children}
    </div>
  );
}

/* ── the CLI doing the work, agent-native ────────────────────────────────── */
function TerminalWindow({ lines }: { lines: string[] }) {
  const tone = (l: string) =>
    l.startsWith(">")
      ? "rounded bg-white/10 px-1.5 py-1 text-white/90"
      : l.startsWith("✓")
        ? "text-[#28c840]"
        : l.startsWith("●")
          ? "text-[#f97316]"
          : l.startsWith("·")
            ? "pl-2 text-[9px] text-white/35"
            : "pl-2 text-white/45";

  return (
    <Window dark className="w-full">
      <div className="mono min-h-[92px] space-y-1.5 px-3 py-3 text-[10px] leading-relaxed">
        {lines.map((l, i) => (
          <p key={i} className={`animate-in fade-in duration-200 ${tone(l)}`}>
            {l}
          </p>
        ))}
        <div className="mt-2 rounded border border-white/10 px-1.5 py-1.5 text-white/50">
          &gt;<span className="animate-cursor ml-0.5 inline-block h-2.5 w-1 translate-y-px bg-white/70 align-middle" />
        </div>
      </div>
      <div className="mono flex items-center gap-1.5 border-t border-white/10 px-3 py-2 text-[9px] text-white/40">
        <span className="text-[#28c840]">▶▶ auto</span>
        <span>mochi · local-first</span>
      </div>
    </Window>
  );
}

export default function HeroStage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [beat, setBeat] = useState(0);
  const [live, setLive] = useState(false); // only run the script while on screen

  // pause the loop whenever the stage is scrolled out of view, so an idle tab
  // isn't re-rendering the table forever
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setBeat((b) => (b + 1) % BEATS.length), BEATS[beat].ms);
    return () => clearTimeout(id);
  }, [beat, live]);

  const b = BEATS[beat];

  return (
    <div ref={ref} className="mx-auto w-full max-w-lg">
      {/* live badge, floating above the device row */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] text-foreground shadow-xs">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-brand" />
          Live workspace, synced <span className="text-violet">peer-to-peer</span>
        </span>
      </div>

      {/* the real Mochi table, live data */}
      <div className="mt-2">
        <ProductPreview chrome rows={b.rows} highlight={b.hi} filterLabel={b.filter} writing={b.writing} />
      </div>

      {/* one supporting window: the agent doing the work that drives the table
          above. Hidden on mobile, where it would only stretch an already tall
          hero — the table alone carries the story there. */}
      <div className="mt-4 hidden sm:block">
        <TerminalWindow lines={TERM[b.term]} />
      </div>
    </div>
  );
}
